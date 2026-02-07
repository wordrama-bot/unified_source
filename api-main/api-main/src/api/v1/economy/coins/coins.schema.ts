import Joi from 'joi';

export const incrementBodySchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .required(),
  incrementBy: Joi.number()
    .integer()
    .min(1)
    .max(1000000)
    .required()
});

export const decrementBodySchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .required(),
  decrementBy: Joi.number()
    .integer()
    .min(1)
    .max(1000000)
    .required()
});

export const transferBodySchema = Joi.object({
  senderUserId: Joi.string()
    .uuid()
    .required(),
  receiverUserId: Joi.string()
    .uuid()
    .required(),
  coins: Joi.number()
    .integer()
    .min(1)
    .max(1000000)
    .required()
});