import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class GameCard {
  @Prop()
  value: string;

  @Prop()
  color: string;

  @Prop()
  isSpecial: boolean;

  @Prop()
  imgName: string;
}

const GameCardSchema = SchemaFactory.createForClass(GameCard);

@Schema()
export class GameUser {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  isOwner: boolean;

  @Prop([GameCardSchema])
  cardsInHand: GameCard[];
}

const GameUserSchema = SchemaFactory.createForClass(GameUser);

@Schema()
export class Game {
  @Prop()
  status: 'lobby' | 'started' | 'endScreen';

  @Prop([GameUserSchema])
  users: GameUser[];

  @Prop([GameCardSchema])
  drawPile: GameCard[];

  @Prop([GameCardSchema])
  discardPile: GameCard[];

  @Prop()
  code: string;

  @Prop()
  turn: number;
}

export const GameSchema = SchemaFactory.createForClass(Game);
