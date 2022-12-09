const Joi = require("joi");

const medicineSchema = Joi.object({
  imageUrl: Joi.string(),
  name: Joi.string().required(),
  quantity: Joi.number().integer().required(),
  price: Joi.number().required(),
  purchasePrice: Joi.number().required(),
  effect: Joi.string().required(),
  usage: Joi.string().allow(null, ''),
  contraindication: Joi.string().required(),
  status: Joi.boolean(),
});

module.exports = medicineSchema;
