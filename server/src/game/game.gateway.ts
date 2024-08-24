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
    @MessageBody() data: PlayCardDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      //Get all users socketId in game
      let game = await this.gameModel.findById(data.gameId);
      if (!game) throw new Error('Game does not exist');

      const idArray = game.users.map((user) => user.userId);

      //Validate if card is playable

      //Jeśli karta jest zwykła - sprawdź czy pasuje kolor, czy pasuje znak i czy special nie jest aktywny -> zagraj kartę
      //Jeśli karta jest zwykła a special jest aktywny => nie pozwalaj na zagranie karty
      //Jeśli karta jest specjalna i special jest aktywny - sprawdź czy znak pasuje => zagraj kartę jeśli pasuje
      //Jeśli karta jest specjalna i special nie jest aktywny - sprawdź czy kolor pasuje, czy ewentualnie znak pasuje, czy karta jest czarna => aktywuj special i zagraj kartę

      //Jeśli special jest null
      //-Jeśli karta jest zwykła = sprawdź kolor i value => zagraj kartę
      //-Jeśli karta jest specjalna = sprawdź kolor i value i czy jest black => zagraj kartę, aktywuj special
      //Jeśli special jest aktywny
      //-Sprawdź czy karta pasuje do special = jeśli nie - block => zagraj kartę

      const userIndex = game.users.findIndex(
        (users) => users.userId.toString() === data.userId.toString(),
      );
      const playedCard = game.users[userIndex].cardsInHand[data.cardIndex];
      const lastDiscardedCard = game.discardPile[game.discardPile.length - 1];

      if (!playedCard.isSpecial) {
        if (game.specialActive === null) {
          if (
            lastDiscardedCard.color !== playedCard.color &&
            lastDiscardedCard.value !== playedCard.value
          )
            throw new Error("You can't play this card");

          //Play card

          //remove card from hand and push it to discardPile
          game.discardPile.push(
            ...game.users[userIndex].cardsInHand.splice(data.cardIndex, 1),
          );
        } else {
          throw new Error("You can't play this card");
        }
      } else {
        if (
          lastDiscardedCard.color !== playedCard.color &&
          lastDiscardedCard.value !== playedCard.value &&
          playedCard.color !== 'black'
        ) {
          throw new Error("You can't play this card");
        }

        if (playedCard.value === '+2' || playedCard.value === '+4') {
          game.specialActive = 'plus';

          game.specialSum += parseInt(playedCard.value.split('+')[1]);
        } else if (playedCard.value === 'stop') {
          game.specialActive = 'stop';

          game.specialSum += 1;
        }

        game.discardPile.push(
          ...game.users[userIndex].cardsInHand.splice(data.cardIndex, 1),
        );
      }

      /*  if (game.specialActive === null) {
        if (!playedCard.isSpecial) {
          if (
            lastDiscardedCard.color !== playedCard.color &&
            lastDiscardedCard.value !== playedCard.value
          )
            throw new Error("You can't play this card");

          //Play card

          //remove card from hand and push it to discardPile
          game.discardPile.push(
            ...game.users[userIndex].cardsInHand.splice(data.cardIndex, 1),
          );
        } else {
          if (
            lastDiscardedCard.color !== playedCard.color &&
            lastDiscardedCard.value !== playedCard.value &&
            playedCard.color !== 'black'
          )
            throw new Error("You can't play this card");

          //special true
          if (playedCard.value === '+2' || playedCard.value === '+4') {
            game.specialActive = 'plus';

            game.specialSum += parseInt(playedCard.value.split('+')[1]);
          } else if (playedCard.value === 'stop') {
            game.specialActive = 'stop';

            game.specialSum += 1;
          }

          //remove card from hand and push it to discardPile
          game.discardPile.push(
            ...game.users[userIndex].cardsInHand.splice(data.cardIndex, 1),
          );
        }
      } else {
        if (game.specialActive === 'plus') {
          if (playedCard.color !== lastDiscardedCard.color)
            throw new Error("You can't play this card");
          if (
            playedCard.value !== '+2' &&
            playedCard.value !== '+4' &&
            playedCard.value !== 'rev'
          ) {
            throw new Error("You can't play this card");
          }

          //Play card
        }
      } */

      game.turn = this.updateTurn(game.turn, game.direction, game.users.length);
      game.save();
      //Emit played card to every player
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }
}
