import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signup(
    @Body(new ValidationPipe({ transform: true })) user: CreateUserDTO,
  ): Promise<User> {
    return this.authService.signup(user);
  }
}
