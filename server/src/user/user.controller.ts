import { Controller, Get, Param } from '@nestjs/common';
import { UserIdDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUser(@Param() id: UserIdDto) {
    return this.getUser(id);
  }
}
