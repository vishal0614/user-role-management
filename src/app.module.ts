import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UtilModule } from './util/util.module';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AccessModuleSchema, RoleSchema } from './role/role.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: await new ConfigService().get<string>('DB_URL'),
      }),
    }),
    MongooseModule.forFeature([
      { name: 'Module', schema: AccessModuleSchema },
      { name: 'Role', schema: RoleSchema },
    ]),
    RoleModule,
    UserModule,
    AuthModule,
    UtilModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    try {
      await mongoose.connect(new ConfigService().get<string>('DB_URL'));
      console.log('MongoDB connection established');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
}
