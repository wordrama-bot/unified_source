import Joi from 'joi';

export const settingsBodySchema = Joi.object({
  isHighContrast: Joi.bool().required(),
  isDarkMode: Joi.bool().required(),
  isHardMode: Joi.bool().required(),
  wordLength: Joi.string().required(),
  isConfettiEnabled: Joi.bool().required(),
});