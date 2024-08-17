import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from 'src/models/gameSchema';
import { CreateGameDto } from './game.dto';
import { User } from 'src/models/userSchema';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<Game>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createGame(data: CreateGameDto) {
    //Check if user exists
    const exists = await this.userModel.exists({ _id: data.ownerId });
    if (!exists)
      throw new HttpException(
        'Room owner does not exists',
        HttpStatus.FORBIDDEN,
      );

    //Check if user is already in game
    const isInGame = await this.gameModel.findOne({
      'users.$.userId': data.ownerId,
    });
    if (isInGame) {
      return; //return user to game
    }

    //Create new game
    const newGameObject: Game = {
      code: '123456',
      users: [{ userId: data.ownerId, isOwner: true, cardsInHand: [] }],
      drawPile: [],
      discardPile: [],
      status: 'lobby',
    };
    const newGame = await this.gameModel.create(newGameObject);

    return {
      gameId: newGame._id,
    };
  }
}
