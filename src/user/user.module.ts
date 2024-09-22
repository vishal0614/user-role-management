import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessModuleSchema, RoleSchema } from 'src/role/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Role', schema: RoleSchema },
      { name: 'Module', schema: AccessModuleSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
