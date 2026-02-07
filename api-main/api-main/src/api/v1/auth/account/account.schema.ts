import Joi from 'joi';

export const updateProfileBodySchema = Joi.object({
  firstname: Joi.string().pattern(/^[a-zA-Z]+$/).allow(''),
  lastname: Joi.string().pattern(/^[a-zA-Z]+$/).allow(''),
  profileImage: Joi.string().allow('')
});

export const updateUsernameBodySchema = Joi.object({
  username: Joi.string().pattern(/^[a-zA-Z0-9\-_\.]+$/)
});

export const linkDiscordBodySchema = Joi.object({
  linkCode: Joi.string().pattern(/^[a-z0-9]+$/).length(10),
  discordUsername: Joi.string().required(),
  discordUserId: Joi.string().required()
});