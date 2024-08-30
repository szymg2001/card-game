import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CardColor, CardValue } from 'src/game/game.dto';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class GameCard {
  @Prop()
  value: CardValue;

  @Prop()
  color: CardColor | 'black';

  @Prop()
  isSpecial: boolean;

  @Prop()
  imgName: string;

  @Prop()
  selectedColor?: CardColor;
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

  @Prop()
  username: string;

  @Prop()
  stopped: number;
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

  @Prop()
  specialActive: 'plus' | 'stop' | null;

  @Prop()
  specialSum: number;

  @Prop()
  direction: -1 | 1;
}

export const GameSchema = SchemaFactory.createForClass(Game);
