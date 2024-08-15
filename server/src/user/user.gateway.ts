import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { User } from 'src/models/userSchema';

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token;

    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub;

      await this.userModel.findByIdAndUpdate(userId, { socketId: socket.id });
    } catch (error) {
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    await this.userModel.findOneAndUpdate(
      { socketId: socket.id },
      { socketId: '' },
    );
  }
}
