import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.schema';
import { Module, Role } from '../role/role.schema';
import { CreateUserDTO, userSchema } from './dto/create-user.dto';
import { UpdateUserDTO, updateUserSchema } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Module.name) private moduleModel: Model<Module>,
  ) {}

  async create(createUserDto: CreateUserDTO): Promise<User> {
    const { error } = userSchema.validate(createUserDto);
    if (error) {
      throw new Error(error.details.map((err) => err.message).join(', '));
    }
    const role = await this.roleModel.findById(createUserDto.role).exec();
    if (!role) {
      throw new BadRequestException('Invalid role');
    }

    const user = await new this.userModel(createUserDto).save();
    const userData = user.toObject();
    delete userData.password; // remove password field from response
    return userData;
  }

  async findAll(search?: string): Promise<User[]> {
    const filter = search
      ? { firstName: { $regex: search, $options: 'i' } }
      : {};
    return this.userModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role',
        },
      },
      { $unwind: '$role' },
      {
        $lookup: {
          from: 'modules',
          localField: 'role.accessModules',
          foreignField: '_id',
          as: 'modules',
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          roleName: '$role.roleName',
          accessModules: {
            $map: {
              input: '$modules',
              as: 'module',
              in: {
                moduleId: '$$module._id',
                moduleName: '$$module.moduleName',
              },
            },
          },
        },
      },
    ]);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate('role')
      .select('-password')
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateData: UpdateUserDTO): Promise<User> {
    const { error } = updateUserSchema.validate(updateData);
    if (error) {
      throw new Error(error.details.map((err) => err.message).join(', '));
    }

    if (updateData?.email) {
      const existingUser = await this.findOneByEmail(updateData?.email);
      // check email, allow updating same with current user old email
      if (existingUser?._id?.toString() !== id?.toString()) {
        throw new BadRequestException('Email is already in use');
      }
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async remove(id: string): Promise<any> {
    const result = await this.userModel
      .findByIdAndDelete(id)
      .select('-password')
      .exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }

  async updateManyUsers(
    filter: object,
    updateData: Partial<User>,
  ): Promise<any> {
    return this.userModel.updateMany(filter, updateData).exec();
  }

  async bulkUpdateUsers(
    updates: { userId: string; updateData: Partial<User> }[],
  ): Promise<any> {
    const bulkOps = updates.map(({ userId, updateData }) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(userId) },
        update: { $set: updateData },
      },
    }));
    return this.userModel.bulkWrite(bulkOps);
  }

  // check for user modules permissions
  async hasModulePermissions(user: User, module: string): Promise<boolean> {
    const roleDetail = await this.roleModel.findById(
      new Types.ObjectId(user.role),
    );
    const modules: any = await this.moduleModel.find({
      _id: { $in: roleDetail.accessModules },
    });
    return modules?.map((module) => module.moduleName)?.includes(module);
  }
}
