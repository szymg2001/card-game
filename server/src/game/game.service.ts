import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Game } from 'src/models/gameSchema';
import { CreateGameDto, GameIdDto, JoinGameDto } from './game.dto';
import { User } from 'src/models/userSchema';
import { Cards } from './cards';
import { GameGateway } from './game.gateway';

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
    const newGameObject: Game = {
      code: '123456',
      users: [{ userId: data.ownerId, isOwner: true, cardsInHand: [] }],
      drawPile: [],
      discardPile: [],
      status: 'lobby',
      turn: 0,
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

    game.users.push({
      userId: data.userId,
      cardsInHand: [],
      isOwner: false,
    });

    await game.save();
    return {
      gameId: game._id,
    };
  }

  async getGame(params: { id: string }) {
    const { id } = params;
    const game = await this.gameModel.findById(id);

    if (!game) throw new HttpException('Game not found', HttpStatus.NOT_FOUND);

    return {
      game,
    };
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

    game.drawPile = deck.cards;

    //Change status
    game.status = 'started';

    //Emit event to users
    const userIdArray = game.users.map((el) => el.userId);
    this.gameGateway.startGameForUsers(userIdArray, {
      gameId: game._id,
      code: game.code,
      drawPileLength: game.drawPile.length,
      discardPileLength: game.discardPile.length,
      status: game.status,
      turn: game.turn,
      users: [],
    });

    await game.save();
  }
}
