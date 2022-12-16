const { object } = require("joi");
const Joi = require("joi");

const medicalPrescribeSchema = Joi.object({
  medicalPrescribe: Joi.array()
    .items(
      Joi.object({
        medicalPaperId: Joi.string().required(),
        doctorId: Joi.string().required(),
        medicineId: Joi.string().required(),
        quantity: Joi.number().required(),
        usage: Joi.string().required(),
      })
    )
    .required(),
});

module.exports = medicalPrescribeSchema;
