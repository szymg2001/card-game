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

type CardValue =
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

export class Card {
  color: 'red' | 'blue' | 'yellow' | 'green' | 'black';
  isSpecial: boolean;
  value: CardValue;
  imgName: string;
}

export class UserGameViewPlayerDto {
  username: string;
  userId: mongoose.Schema.Types.ObjectId;
  cardsInHandLength: number;
  isOwner: boolean;
}

export class UserGameViewDto {
  gameId: mongoose.Types.ObjectId;
  code: string;
  drawPileLength: number;
  discardPileLength: number;
  status: 'lobby' | 'started' | 'endScreen';
  turn: number;
  users: UserGameViewPlayerDto[];
}
