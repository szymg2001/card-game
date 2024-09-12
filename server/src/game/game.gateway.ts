import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { User } from 'src/models/userSchema';
import { PlayCardDto, TakeCardDto, UserGameViewDto } from './game.dto';
import { Game, GameUser } from 'src/models/gameSchema';
import { returnGame } from './game.service';
import { Cards } from './cards';

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

  async emitToUsers<T>(
    userIds: mongoose.Types.ObjectId[] | string[],
    event: string,
    data: T,
  ) {
    const users = await this.userModel.find({ _id: { $in: userIds } });
    users.forEach((el) => {
      this.server.to(el.socketId).emit(event, data);
    });
  }

  async updateGameData(gameData: UserGameViewDto) {}

  updateTurn(currentTurn: number, direction: -1 | 1, users: GameUser[]) {
    const playersLength = users.length;

    do {
      currentTurn = (currentTurn + direction + playersLength) % playersLength;
    } while (users[currentTurn].cardsInHand.length === 0);

    return currentTurn;
  }

  async getGame(gameId: mongoose.Types.ObjectId) {
    const game = await this.gameModel.findById(gameId);
    if (!game) throw new Error('Game does not exist');

    return game;
  }

  /* async startGameForUsers(
    usersIdArray: ObjectId[],
    gameId: mongoose.Types.ObjectId,
  ) {
    const users = await this.userModel.find({ _id: { $in: usersIdArray } });
    users.forEach((el) => {
      this.server.to(el.socketId).emit('gameStarted', gameId);
    });
  } */

  /* async removeGame(usersIdArray: ObjectId[], gameId: mongoose.Types.ObjectId) {
    const users = await this.userModel.find({ _id: { $in: usersIdArray } });
    users.forEach((el) => {
      this.server.to(el.socketId).emit('gameRemoved', gameId);
    });
  } */

  /* async emitGameAction(
    game: mongoose.Document<unknown, {}, Game> &
      Game & {
        _id: mongoose.Types.ObjectId;
      },
    userId: mongoose.Types.ObjectId | string,
  ) {
    const idArray = game.users.map((user) => user.userId);
    const users = await this.userModel.find({ _id: { $in: idArray } });

    let returnData = returnGame(game, userId);
    users.forEach((el) => {
      this.server.to(el.socketId).emit('gameAction', returnData);
    });
  } */

  async playCardFunction(
    cardIndex: number[],
    game: Game,
    userIndex: number,
    selectedColor: 'red' | 'green' | 'yellow' | 'blue',
  ) {
    const playedCard = game.users[userIndex].cardsInHand[cardIndex[0]];
    const lastDiscardedCard = game.discardPile[game.discardPile.length - 1];

    if (cardIndex.length > 1) {
      let cards = game.users[userIndex].cardsInHand.filter((el, index) =>
        cardIndex.includes(index),
      );
      if (cards.some((el) => el.value !== playedCard.value)) {
        throw new Error("You can't play this card");
      }
    }

    if (!playedCard.isSpecial) {
      if (game.specialActive === null) {
        if (
          lastDiscardedCard.color !== playedCard.color &&
          lastDiscardedCard.value !== playedCard.value &&
          lastDiscardedCard.selectedColor !== playedCard.color
        )
          throw new Error("You can't play this card");
        game.users[userIndex].cardsInHand = game.users[
          userIndex
        ].cardsInHand.filter((el, index) => {
          if (cardIndex.includes(index)) {
            game.discardPile.push(game.users[userIndex].cardsInHand[index]);
            return false;
          } else {
            return true;
          }
        });
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

        game.specialSum +=
          parseInt(playedCard.value.split('+')[1]) * cardIndex.length;
      } else if (playedCard.value === 'stop') {
        if (game.specialActive !== 'stop' && game.specialActive !== null)
          throw new Error("You can't play this card");
        game.specialActive = 'stop';

        game.specialSum += 1 * cardIndex.length;
      }

      game.users[userIndex].cardsInHand = game.users[
        userIndex
      ].cardsInHand.filter((el, index) => {
        if (cardIndex.includes(index)) {
          game.discardPile.push(game.users[userIndex].cardsInHand[index]);
          return false;
        } else {
          return true;
        }
      });
    }
  }

  @SubscribeMessage('playCard')
  async playCard(
    @MessageBody() data: { data: PlayCardDto },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { gameId, userId, cardIndex, selectedColor } = data.data;
      //Get socketId of every user
      let game = await this.getGame(gameId);
      if (game.status !== 'inGame') {
      }

      //Get user index and cards
      const userIndex = game.users.findIndex(
        (users) => users.userId.toString() === userId.toString(),
      );

      await this.playCardFunction(cardIndex, game, userIndex, selectedColor);

      //Check if player has empty hand = game end
      if (game.users[userIndex].cardsInHand.length === 0) {
        if (
          game.users.filter((el) => el.cardsInHand.length === 0).length >=
          game.rules.endCondition
        ) {
          game.status = 'endScreen';
        }
      }

      //Update turn and save game
      game.turn = await this.updateTurn(game.turn, game.direction, game.users);
      await game.save();

      //Emit event
      const idArray = game.users.map((user) => user.userId.toString());
      this.emitToUsers(idArray, 'updateGameData', returnGame(game, userId));
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('checkFirst')
  async checkFirstCard(
    @MessageBody() data: { data: TakeCardDto },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { gameId, userId } = data.data;

      //get Game and userIndex
      const game = await this.getGame(gameId);
      const playerIndex = game.users.findIndex(
        (user) => user.userId.toString() === userId.toString(),
      );
      if (playerIndex === -1) throw new Error('Player does not exists');

      //Check if drawPile is not empty and fill it
      if (game.drawPile.length === 0) {
        game.drawPile = new Cards().shuffle(game.discardPile);
        game.discardPile = [];
      }

      const drawnCard = game.drawPile[0];

      //Ask what to do
      client.emit('confirmPlayCard', { drawnCard });

      client.once('playCardResponse', async (data: { response: boolean }) => {
        try {
          const { response } = data;
          game.users[playerIndex].cardsInHand.push(drawnCard);
          game.drawPile.splice(0, 1);
          if (response) {
            //play card
            await this.playCardFunction(
              [game.users[playerIndex].cardsInHand.length - 1],
              game,
              playerIndex,
              'red' /* need to add selecting color functionality */,
            );
          } else {
            //take card
            if (game.specialActive !== null) {
              if (game.specialActive === 'stop') {
                game.users[playerIndex].stopped = game.specialSum;
              } else if (game.specialActive === 'plus') {
                if (game.drawPile.length < game.specialSum) {
                  game.drawPile = new Cards().shuffle(game.discardPile);
                  game.discardPile = [];
                }
                game.users[playerIndex].cardsInHand.push(
                  ...game.drawPile.splice(0, game.specialSum - 1),
                );
              }

              game.specialActive = null;
              game.specialSum = 0;
            }
          }

          //Update turn
          game.turn = this.updateTurn(game.turn, game.direction, game.users);

          await game.save();
          const idArray = game.users.map((user) => user.userId.toString());
          this.emitToUsers(idArray, 'updateGameData', returnGame(game, userId));
        } catch (error) {
          client.emit('error', { message: error.message });
        }
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }
}
