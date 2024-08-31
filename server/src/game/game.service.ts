import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Game } from 'src/models/gameSchema';
import {
  CreateGameDto,
  GameIdDto,
  JoinGameDto,
  UserGameViewDto,
} from './game.dto';
import { User } from 'src/models/userSchema';
import { Cards } from './cards';
import { GameGateway } from './game.gateway';

export function returnGame(
  game: mongoose.Document<unknown, {}, Game> &
    Game & {
      _id: mongoose.Types.ObjectId;
    },
  userId: mongoose.Types.ObjectId,
): UserGameViewDto {
  return {
    gameId: game._id,
    code: game.code,
    drawPileLength: game.drawPile.length,
    discardPileLength: game.discardPile.length,
    lastDiscardedCard: game.discardPile[game.discardPile.length - 1],
    status: game.status,
    turn: game.turn,
    users: game.users.map((el) => ({
      username: el.username,
      userId: el.userId,
      stopped: false,
      cardsInHand:
        el.userId.toString() === userId.toString()
          ? el.cardsInHand
          : el.cardsInHand.length,
    })),
  };
}

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly gameGateway: GameGateway,
  ) {}

  async checkIfInGame(id: mongoose.Schema.Types.ObjectId) {
    //Check if user is already in game
    const isInGame = await this.gameModel.findOne({
      'users.userId': id,
    });
    if (isInGame) {
      throw new HttpException('User already in game', HttpStatus.FORBIDDEN);
      return; //return user to game
    }
  }

  async createGame(data: CreateGameDto) {
    //Check if user exists
    const exists = await this.userModel.exists({ _id: data.ownerId });
    if (!exists)
      throw new HttpException(
        'Room owner does not exists',
        HttpStatus.FORBIDDEN,
      );

    //Check if user is already in game
    await this.checkIfInGame(data.ownerId);

    //Create new game
    let user = await this.userModel.findById(data.ownerId);
    const newGameObject: Game = {
      code: '123456',
      users: [
        {
          userId: data.ownerId,
          isOwner: true,
          cardsInHand: [],
          username: user.username,
          stopped: 0,
        },
      ],
      drawPile: [],
      discardPile: [],
      status: 'lobby',
      turn: 0,
      specialActive: null,
      direction: 1,
      specialSum: 0,
    };
    const newGame = await this.gameModel.create(newGameObject);

    return {
      gameId: newGame._id,
    };
  }

  async joinGame(
    data: JoinGameDto & { userId: mongoose.Schema.Types.ObjectId },
  ) {
    //Check if user is already in game
    await this.checkIfInGame(data.userId);

    const game = await this.gameModel.findOne({ code: data.code });
    if (!game) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND, {
        cause: 'Code',
      });
    }

    let user = await this.userModel.findById(data.userId);

    game.users.push({
      userId: data.userId,
      cardsInHand: [],
      isOwner: false,
      username: user.username,
      stopped: 0,
    });

    await game.save();
    return {
      gameId: game._id,
    };
  }

  async getGame(params: { id: string; userId: mongoose.Types.ObjectId }) {
    const { id } = params;
    const game = await this.gameModel.findById(id);

    if (!game) throw new HttpException('Game not found', HttpStatus.NOT_FOUND);

    return returnGame(game, params.userId);
  }

  async startGame(data: GameIdDto) {
    const { gameId } = data;

    const game = await this.gameModel.findById(gameId);
    if (!game) throw new HttpException('Game not found', HttpStatus.NOT_FOUND);

    //Generate cards
    const deck = new Cards(7);
    game.users.forEach((el, index) => {
      game.users[index].cardsInHand = deck.generateHand();
    });

    let firstNonBlack = deck.cards.findIndex((el) => el.color !== 'black');
    game.discardPile = deck.cards.splice(firstNonBlack, 1);
    game.drawPile = deck.cards;

    //Change status
    game.status = 'inGame';

    //Emit event to users
    const userIdArray = game.users.map((el) => el.userId);
    this.gameGateway.startGameForUsers(userIdArray, game._id);

    await game.save();
  }
}
