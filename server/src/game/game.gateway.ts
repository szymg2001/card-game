import { InjectModel } from '@nestjs/mongoose';
import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { Model, ObjectId } from 'mongoose';
import { Server } from 'socket.io';
import { User } from 'src/models/userSchema';
import { UserGameViewDto } from './game.dto';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit {
  server: Server;
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  afterInit(server: Server) {
    this.server = server;
  }

  async startGameForUsers(usersIdArray: ObjectId[], data: UserGameViewDto) {
    const users = await this.userModel.find({ _id: { $in: usersIdArray } });
    users.forEach((el) => {
      this.server.to(el.socketId).emit('gameStarted', data);
    });
  }
}
