const { object } = require("joi");
const Joi = require("joi");

const billSchema = Joi.object({
  bill: Joi.array()
    .items(
      Joi.object({
        medicalPaperId: Joi.string().required(),
        employeeId: Joi.string().required(),
        paymentId: Joi.string().required(),
        amount: Joi.number().required(),
        createAt: Joi.date().required(),
      })
    )
    .required(),
});

module.exports = billSchema;
