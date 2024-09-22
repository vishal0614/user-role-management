import Joi from 'joi';

export const updateUserSchema = Joi.object().keys({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().optional(),
});

export class UpdateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
