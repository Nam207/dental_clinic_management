const Joi = require('joi');

const forgotSchema = Joi.object({
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().alphanum().min(8).required()
});

module.exports = {
  forgotSchema,
  loginSchema
}