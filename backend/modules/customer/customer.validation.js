const Joi = require('joi');

const CustomerSchema = Joi.object({
  fullname: Joi.string().required(),
  phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  email: Joi.string().email().required(),
  dateOfBirth: Joi.date(),
  gender: Joi.number().integer().valid(0,  1, 2),
  job: Joi.string().allow(null, ''),
  bloodGroup: Joi.string(),
  address: Joi.string().allow(null, ''),
  note: Joi.string().allow(null, ''),
  status: Joi.boolean(),
  systemicMedicalHistory: Joi.array(),
  dentalMedicalHistory: Joi.array(),
});

module.exports = CustomerSchema