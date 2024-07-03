import Joi from 'joi';

export const resetLinkSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
