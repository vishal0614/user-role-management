import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from './role.schema';
import { CreateRoleDTO, roleSchema } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async create(role: CreateRoleDTO): Promise<Role> {
    const { error } = roleSchema.validate(role);
    if (error) {
      throw new Error(error.details.map((err) => err.message).join(', '));
    }
    return new this.roleModel(role).save();
  }

  async findAll(search?: string): Promise<Role[]> {
    const filter = search
      ? { roleName: { $regex: search, $options: 'i' } }
      : {};
    return this.roleModel.find(filter).populate('accessModules').exec();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleModel
      .findById(id)
      .populate('accessModules')
      .exec();
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async update(id: string, updateData: Partial<Role>): Promise<Role> {
    const updatedRole = await this.roleModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('accessModules')
      .exec();
    if (!updatedRole) {
      throw new NotFoundException('Role not found');
    }
    return updatedRole;
  }

  async remove(id: string): Promise<any> {
    const result = await this.roleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Role not found');
    }
    return result;
  }

  async updateAccessModules(
    id: string,
    accessModules: Types.ObjectId[],
  ): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // unique values in accessModules
    role.accessModules = Array.from(
      new Set([...role.accessModules, ...accessModules]),
    );

    return role.save();
  }

  async removeAccessModule(
    id: string,
    accessModuleId: Types.ObjectId,
  ): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    role.accessModules = role.accessModules.filter(
      (moduleId) => !moduleId.equals(accessModuleId),
    );

    return role.save();
  }
}
