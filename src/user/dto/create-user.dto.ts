import Joi from 'joi';

export const userSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});

export class CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}
