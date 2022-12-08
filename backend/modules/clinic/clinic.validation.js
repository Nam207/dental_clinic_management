const Joi = require('joi');

const ClinicSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  email: Joi.string().email().required(),
  address: Joi.string().min(3).required(),
  accountNumber: Joi.string().min(15).required(),
  icon: Joi.string(),
});

module.exports = ClinicSchema