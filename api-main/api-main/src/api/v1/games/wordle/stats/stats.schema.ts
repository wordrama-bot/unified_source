import Joi from 'joi';

const upsertStatBodySchema = Joi.object({
  gamesFailed: Joi.number()
    .integer()
    .min(0)
    .required(),
  currentStreak: Joi.number()
    .integer()
    .min(0)
    .required(),
  bestStreak: Joi.number()
    .integer()
    .min(0)
    .required(),
  successRate: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .required(),
  totalGames: Joi.number()
    .integer()
    .min(0)
    .required(),
  winDistribution: Joi.array()
});

export const upsetStatsBodySchema = Joi.object({
  FIVE: upsertStatBodySchema,
  SIX: upsertStatBodySchema,
  SEVEN: upsertStatBodySchema,
  EIGHT: upsertStatBodySchema,
  NINE: upsertStatBodySchema,
  TEN: upsertStatBodySchema,
  ELEVEN: upsertStatBodySchema,
});