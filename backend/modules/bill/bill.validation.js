const { object } = require("joi");
const Joi = require("joi");

const billSchema = Joi.object({
  billMedical: Joi.array()
    .items(
      Joi.object({
        medicalPaperId: Joi.string().required(),
        employeeId: Joi.string().required(),
        paymentId: Joi.string().required(),
        amount: Joi.number().required(),
        createAt: Joi.date().required(),
        _id: Joi.string().allow("", null),
      })
    )
    .required(),
});

module.exports = billSchema;
