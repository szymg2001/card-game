import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from 'src/models/gameSchema';
import { User, UserSchema } from 'src/models/userSchema';
import { GameUserGuard } from './gameUser.guard';

@Module({
  controllers: [GameController],
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [GameService, GameUserGuard],
})
export class GameModule {}
