import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ValidationPipe,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async findAll(@Req() req, @Query('search') search: string) {
    const checkModuleAccess = await this.userService.hasModulePermissions(
      req.user,
      'User',
    );
    if (!checkModuleAccess) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.userService.findAll(search);
  }

  @Get(':user_id')
  findOne(@Param('user_id') user_id: string) {
    return this.userService.findOne(user_id);
  }

  @Put(':user_id')
  update(
    @Param('user_id') user_id: string,
    @Body(new ValidationPipe({ transform: true })) user: UpdateUserDTO,
  ) {
    return this.userService.update(user_id, user);
  }

  @Delete(':user_id')
  remove(@Param('user_id') user_id: string) {
    return this.userService.remove(user_id);
  }

  @Put('bulk_update/group')
  bulkUpdateUsers(
    @Body() updates: { userId: string; updateData: Partial<User> }[],
  ) {
    return this.userService.bulkUpdateUsers(updates);
  }

  @Put('update/all')
  updateManyUsers(
    @Body('filter') filter: object,
    @Body('updateData') updateData: Partial<User>,
  ) {
    return this.userService.updateManyUsers(filter, updateData);
  }
}
