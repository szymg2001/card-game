import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateGameDto, GameIdDto, JoinGameDto } from './game.dto';
import { GameService } from './game.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { GameUserGuard } from './gameUser.guard';

@UseGuards(AuthGuard)
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('/create')
  //To change
  createGame(@Req() request, @Body() dto: any) {
    return this.gameService.createGame({
      ownerId: request.user.sub,
      rules: dto,
    });
  }

  @Post('/join')
  joinGame(@Req() request, @Body() dto: JoinGameDto) {
    return this.gameService.joinGame({ userId: request.user.sub, ...dto });
  }

  @UseGuards(GameUserGuard)
  @Get(':id')
  getGame(@Req() request, @Param() params: { id: string }) {
    return this.gameService.getGame({ ...params, userId: request.user.sub });
  }

  @UseGuards(GameUserGuard)
  @Post('/start')
  startGame(@Body() dto: GameIdDto) {
    return this.gameService.startGame(dto);
  }

  @UseGuards(GameUserGuard)
  @Post('/leave')
  leaveGame(@Body() dto: GameIdDto, @Param() params: { id: string }) {}
}
