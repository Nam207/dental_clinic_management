const Joi = require('joi');

const medicineSchema = Joi.object({
  name: Joi.string().required(),
  imageUrl: Joi.string().min(8).required(),
  quantity: Joi.number().integer().required(),
  price: Joi.number().required(),
  purchasePrice: Joi.number().required(),
  unit: Joi.number().required(),
  usage: Joi.string(),
  expiredDay: Joi.date(),
  status: Joi.boolean(),
});

module.exports = medicineSchema