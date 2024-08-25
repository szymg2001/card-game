import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Model, ObjectId } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { User } from 'src/models/userSchema';
import { PlayCardDto, UserGameViewDto } from './game.dto';
import { Game } from 'src/models/gameSchema';
import { returnGame } from './game.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit {
  server: Server;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
  ) {}

  afterInit(server: Server) {
    this.server = server;
  }

  updateTurn(currentTurn: number, direction: -1 | 1, playersLength: number) {
    if (currentTurn >= playersLength && direction === 1) currentTurn = 0;
    else if (currentTurn <= 0 && direction === -1)
      currentTurn = playersLength - 1;
    else {
      currentTurn += direction;
    }
    return currentTurn;
  }

  async startGameForUsers(usersIdArray: ObjectId[], data: UserGameViewDto) {
    const users = await this.userModel.find({ _id: { $in: usersIdArray } });
    users.forEach((el) => {
      this.server.to(el.socketId).emit('gameStarted', data);
    });
  }

  @SubscribeMessage('playCard')
  async playCard(
    @MessageBody() data: /* PlayCardDto */ any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { gameId, userId, cardIndex, selectedColor } = data.data;
      //Get socketId of every user
      let game = await this.gameModel.findById(gameId);
      if (!game) throw new Error('Game does not exist');
      const idArray = game.users.map((user) => user.userId);

      //Get user index and cards
      const userIndex = game.users.findIndex(
        (users) => users.userId.toString() === userId.toString(),
      );
      const playedCard = game.users[userIndex].cardsInHand[cardIndex];
      const lastDiscardedCard = game.discardPile[game.discardPile.length - 1];

      //Validate card
      if (!playedCard.isSpecial) {
        if (game.specialActive === null) {
          if (
            lastDiscardedCard.color !== playedCard.color &&
            lastDiscardedCard.value !== playedCard.value &&
            lastDiscardedCard.selectedColor !== playedCard.color
          )
            throw new Error("You can't play this card");
          game.discardPile.push(
            ...game.users[userIndex].cardsInHand.splice(cardIndex, 1),
          );
        } else {
          throw new Error("You can't play this card");
        }
      } else {
        if (playedCard.color === 'black' && !selectedColor) {
          throw new Error('You need to select color to play this card');
        } else {
          playedCard.selectedColor = selectedColor;
        }
        if (
          lastDiscardedCard.color !== playedCard.color &&
          lastDiscardedCard.value !== playedCard.value &&
          playedCard.color !== 'black' &&
          lastDiscardedCard.selectedColor !== playedCard.color
        ) {
          throw new Error("You can't play this card");
        }

        if (playedCard.value === '+2' || playedCard.value === '+4') {
          if (game.specialActive !== 'plus' && game.specialActive !== null)
            throw new Error("You can't play this card");
          game.specialActive = 'plus';

          game.specialSum += parseInt(playedCard.value.split('+')[1]);
        } else if (playedCard.value === 'stop') {
          if (game.specialActive !== 'stop' && game.specialActive !== null)
            throw new Error("You can't play this card");
          game.specialActive = 'stop';

          game.specialSum += 1;
        }

        game.discardPile.push(
          ...game.users[userIndex].cardsInHand.splice(cardIndex, 1),
        );
      }

      //Update turn and save game
      game.turn = this.updateTurn(game.turn, game.direction, game.users.length);
      game.save();
      let returnData = returnGame(game, userId);

      //Emit played card to every player
      const users = await this.userModel.find({ _id: { $in: idArray } });
      users.forEach((el) => {
        this.server.to(el.socketId).emit('playedCard', returnData);
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }
}
