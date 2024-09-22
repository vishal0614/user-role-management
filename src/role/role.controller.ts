import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Types } from 'mongoose';
import { Role } from './role.schema';
import { CreateRoleDTO } from './dto/create-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(
    @Body(new ValidationPipe({ transform: true })) role: CreateRoleDTO,
  ): Promise<Role> {
    return this.roleService.create(role);
  }

  @Get()
  findAll(@Query('search') search: string) {
    return this.roleService.findAll(search);
  }

  @Get(':role_id')
  findOne(@Param('role_id') role_id: string) {
    return this.roleService.findOne(role_id);
  }

  @Put(':role_id')
  update(@Param('role_id') role_id: string, @Body() updateData: Partial<Role>) {
    return this.roleService.update(role_id, updateData);
  }

  @Delete(':role_id')
  remove(@Param('role_id') role_id: string) {
    return this.roleService.remove(role_id);
  }

  @Put(':role_id/access_modules')
  updateAccessModules(
    @Param('role_id') role_id: string,
    @Body('accessModules') accessModules: Types.ObjectId[],
  ) {
    return this.roleService.updateAccessModules(role_id, accessModules);
  }

  @Delete(':role_id/access_modules/:module_id')
  removeAccessModule(
    @Param('role_id') role_id: string,
    @Param('module_id') moduleId: string,
  ) {
    return this.roleService.removeAccessModule(
      role_id,
      new Types.ObjectId(moduleId),
    );
  }
}
