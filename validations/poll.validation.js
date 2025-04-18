const Joi = require("joi");

const createPollSchema = Joi.object({
  question: Joi.string().min(3).required(),
  durationInMinutes: Joi.number().min(1).required(),
});

const submitResponseSchema = Joi.object({
  type: Joi.string().valid("like", "dislike").required(),
  ip: Joi.string().required(), // Or use `.ip()` if it's an IP format
});

module.exports = {
  createPollSchema,
  submitResponseSchema,
};
