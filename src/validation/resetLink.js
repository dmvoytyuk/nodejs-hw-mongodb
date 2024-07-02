import Joi from 'joi';

export const resetLinkSchema = Joi.object({
  password: Joi.string().email().required(),
  token: Joi.string().required(),
});
