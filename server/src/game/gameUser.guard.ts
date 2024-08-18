import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { Game } from 'src/models/gameSchema';

@Injectable()
export class GameUserGuard implements CanActivate {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  async canActivate(context: ExecutionContext) {
    let request = context.switchToHttp().getRequest();
    let userId = request.user.sub;
    let method = request.method;

    //Get gameId
    let gameId: string;
    if (method === 'GET' || method === 'DELETE') gameId = request.params.id;
    else if (method === 'POST' || method === 'PUT' || method === 'PATCH')
      gameId = request.body.gameId;

    if (!gameId)
      throw new HttpException(
        'Game id not passed in request',
        HttpStatus.FORBIDDEN,
      );

    //Find game
    const game = await this.gameModel.findById(gameId);
    if (!game) throw new HttpException('Game not found', HttpStatus.NOT_FOUND);

    //Check if user is in game
    let isInGame = game.users.some((e) => e.userId === userId);

    if (!isInGame)
      throw new ForbiddenException(
        'You are not in this game. Join using code.',
      );

    return true;
  }
}
