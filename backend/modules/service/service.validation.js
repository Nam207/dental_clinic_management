const { object } = require("joi");
const Joi = require("joi");

const serviceSchema = Joi.object({
  name: Joi.string().required(),
  time: Joi.number().integer().required(),
  price: Joi.number().required(),

  note: Joi.string().allow(null, ''),
  status: Joi.boolean(),
  consumable: Joi.any(),
  prescription: Joi.any(),
  imageUrl: Joi.string(),
});

module.exports = serviceSchema;
