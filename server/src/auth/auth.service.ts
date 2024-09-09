import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/userSchema';
import { LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const { email, username, password, confirmPassword } = data;
    console.log('1', data);
    //Validate data
    if (password !== confirmPassword)
      throw new HttpException('Passwords do not match', HttpStatus.FORBIDDEN);
    let exists = await this.userModel.exists({ email });
    if (exists)
      throw new HttpException('User already exists', HttpStatus.FORBIDDEN);

    //Create new user
    let hashedPassword = await bcrypt.hash(password, 12);
    let newUserObject: User = {
      username,
      email,
      password: hashedPassword,
      friends: [],
      socketId: '',
    };
    let newUser = await this.userModel.create(newUserObject);

    console.log('10');
    return {
      token: await this.jwtService.signAsync({ sub: newUser._id }),
    };
  }

  async login(data: LoginDto) {
    let { email, password } = data;

    //Find user
    let user = await this.userModel.findOne({ email });
    if (!user)
      throw new HttpException('Incorrect credentials', HttpStatus.FORBIDDEN);

    //Check password
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new HttpException('Incorrect credentials', HttpStatus.FORBIDDEN);

    return {
      token: await this.jwtService.signAsync({ sub: user._id }),
    };
  }
}
