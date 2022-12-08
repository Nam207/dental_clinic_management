const Joi = require('joi');

const ProfileSchema = Joi.object({
  fullname: Joi.string().required(),
  phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  email: Joi.string().email().required(),
  address: Joi.string().min(3).max(30).allow(null, ''),
  status: Joi.boolean(),
  workingDays: Joi.number().integer().required(),
  salary: Joi.number().required(),
  role: Joi.array().items(Joi.string()).required(),
  schedule: Joi.array().items(Joi.object()).required(),
});

const ProfileInforSchema = Joi.object({
  fullname: Joi.string().required(),
  phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  email: Joi.string().email().required(),
  address: Joi.string().min(3).max(30).allow(null, ''),
  status: Joi.boolean(),
});

module.exports = {ProfileSchema, ProfileInforSchema}

