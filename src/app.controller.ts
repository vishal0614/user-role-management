import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Module, Role } from './role/role.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectModel(Module.name) private module: Model<Module>,
    @InjectModel(Role.name) private role: Model<Role>,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // migrate the modules
  @Get('seed_module')
  async seedModules(@Body() data: { moduleName: string }): Promise<any> {
    try {
      return this.module.create(data);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to add module',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('seed_admin_role')
  async seedAdminRole() {
    try {
      const adminData = {
        roleName: 'Admin',
      };
      return this.role.create(adminData);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to add role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
