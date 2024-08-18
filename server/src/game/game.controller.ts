import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateGameDto, JoinGameDto } from './game.dto';
import { GameService } from './game.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { GameUserGuard } from './gameUser.guard';

@UseGuards(AuthGuard)
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('/create')
  createGame(@Req() request) {
    return this.gameService.createGame({ ownerId: request.user.sub });
  }

  @Post('/join')
  joinGame(@Req() request, @Body() dto: JoinGameDto) {
    return this.gameService.joinGame({ userId: request.user.sub, ...dto });
  }

  @UseGuards(GameUserGuard)
  @Get(':id')
  getGame(@Param() params: { id: string }) {
    return this.gameService.getGame(params);
  }
}
