import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { AccessModuleSchema, RoleSchema } from 'src/role/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
    UserModule,
    MongooseModule.forFeature([
      { name: 'Role', schema: RoleSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Module', schema: AccessModuleSchema },
    ]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
