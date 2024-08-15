import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/userSchema';
import { UserIdDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUser(userId: UserIdDto) {
    let user = await this.userModel.findById(userId);
    if (!user)
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);

    return user;
  }
}
