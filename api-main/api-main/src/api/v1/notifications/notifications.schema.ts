import Joi from 'joi';

export const addNotificationBodySchema = Joi.object({
  type: Joi.string().pattern(/^[a-z]+$/),
  message: Joi.string()
});
