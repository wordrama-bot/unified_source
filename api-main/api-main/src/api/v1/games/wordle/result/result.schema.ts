import Joi from 'joi';

export const gameResultBodySchema = Joi.object({
  isHardMode: Joi.bool().required(),
  guesses: Joi.array().items(Joi.string().pattern(/^[A-Z]+$/)).required(),
  solution: Joi.string().pattern(/^[A-Z]+$/).required()
});

export const gameProcessorBodySchema = Joi.object({
  isDaily: Joi.bool().required(),
  isCustomGame: Joi.bool().required(),
  isHardMode: Joi.bool().required(),
  isDarkMode: Joi.bool().required(),
  isHighContrastMode: Joi.bool().required(),
  swapEnterAndDelete: Joi.bool().required(),
  isSpeedRunEnabled: Joi.bool().required(),
  isConfettiEnabled: Joi.bool().required(),
  wordLength: Joi.string().required(),
  gameId: Joi.string().required(),
  isGameLost: Joi.bool().required(),
  isGameWon: Joi.bool().required(),
  solution: Joi.string().pattern(/^[A-Z]+$/).required(),
  guesses: Joi.array().items(Joi.string().pattern(/^[A-Z]+$/)).required()
});