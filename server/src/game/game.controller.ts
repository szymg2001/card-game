import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateGameDto, JoinGameDto } from './game.dto';
import { GameService } from './game.service';
import { AuthGuard } from 'src/auth/auth.guard';

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
}
