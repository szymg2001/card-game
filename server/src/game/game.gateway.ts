import { InjectModel } from '@nestjs/mongoose';
import { WebSocketGateway } from '@nestjs/websockets';
import { Model, ObjectId } from 'mongoose';
import { Server } from 'socket.io';
import { User } from 'src/models/userSchema';

@WebSocketGateway()
export class GameGateway {
  server: Server;
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async startGameForUsers(usersIdArray: ObjectId[], data: { gameId: string }) {
    const users = await this.userModel.find({ _id: { $in: usersIdArray } });
    users.forEach((el) => {
      this.server.to(el.socketId).emit('gameStarted', data);
    });
  }
}
