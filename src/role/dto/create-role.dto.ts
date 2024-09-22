import Joi from 'joi';

export const roleSchema = Joi.object().keys({
  roleName: Joi.string().required(),
  accessModules: Joi.array().items(Joi.string()).default([]),
});

export class CreateRoleDTO {
  roleName: string;
  accessModules: string[];
}
