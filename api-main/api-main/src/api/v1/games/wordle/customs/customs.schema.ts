import Joi from 'joi';

export const createCustomWordleBodyRequest = Joi.object({
  isPublic: Joi.boolean().required(),
  shareToUserId: Joi.string().uuid(),
  customWord: Joi.string().required(),
  hint: Joi.string()
});