import mongoose from 'mongoose';

export class GameIdDto {
  gameId: mongoose.Schema.Types.ObjectId;
}

export class CreateGameDto {
  ownerId: mongoose.Schema.Types.ObjectId;
}

export class JoinGameDto {
  code: string;
}

export type CardValue =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '+2'
  | '+4'
  | 'color'
  | 'stop'
  | 'rev';

export type CardColor = 'red' | 'blue' | 'yellow' | 'green';

export class Card {
  color: CardColor | 'black';
  isSpecial: boolean;
  value: CardValue;
  imgName: string;
  selectedColor?: CardColor;
}

export class UserGameViewPlayerDto {
  username: string;
  userId: mongoose.Schema.Types.ObjectId;
  cardsInHand: Card[] | number;
  /* isOwner: boolean; */
  stopped: false;
}

export class UserGameViewDto {
  gameId: mongoose.Types.ObjectId;
  code: string;
  drawPileLength: number;
  discardPileLength: number;
  status: 'lobby' | 'inGame' | 'endScreen';
  turn: number;
  users: UserGameViewPlayerDto[];
  lastDiscardedCard: Card;
}

export class PlayCardDto {
  gameId: mongoose.Types.ObjectId;
  cardIndex: number[];
  userId: mongoose.Types.ObjectId;
  selectedColor: CardColor;
}

export class TakeCardDto {
  gameId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}
