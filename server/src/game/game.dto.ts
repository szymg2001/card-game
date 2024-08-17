import mongoose from 'mongoose';

export class CreateGameDto {
  ownerId: mongoose.Schema.Types.ObjectId;
}

export class JoinGameDto {
  code: string;
}
