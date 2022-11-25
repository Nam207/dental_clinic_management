const Joi = require("joi");

const medicineSchema = Joi.object({
  imageUrl: Joi.string(),
  name: Joi.string().required(),
  quantity: Joi.number().integer().required(),
  price: Joi.number().required(),
  purchasePrice: Joi.number().required(),
  unit: Joi.string().required(),
  usage: Joi.string().allow(null, ''),
  expiredDay: Joi.date(),
  status: Joi.boolean(),
});

module.exports = medicineSchema;
