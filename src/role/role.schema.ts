import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ required: true, unique: true })
  roleName: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Module', default: [] })
  accessModules: Types.ObjectId[];

  @Prop({ default: true })
  active: boolean;
}

@Schema()
export class Module extends Document {
  @Prop({ required: true, unique: true })
  moduleName: string;
}

export const AccessModuleSchema = SchemaFactory.createForClass(Module);
export const RoleSchema = SchemaFactory.createForClass(Role);
