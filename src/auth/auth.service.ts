import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);
    const isComparePass = bcrypt.compare(pass, user.password);
    if (user && (await isComparePass)) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signup(createUserDto: CreateUserDTO): Promise<User> {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }
    return this.userService.create(createUserDto);
  }
}
