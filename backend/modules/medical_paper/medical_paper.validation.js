const Joi = require("joi");

const MedicalPaperSchema = Joi.object({
  customerId: Joi.string().required(),
  doctorId: Joi.string().required(),
  reExamination: Joi.date().allow(null, ""),
  status: Joi.number().integer(),
  medicalService: Joi.array().items(Joi.object()).required(),
  note: Joi.string().allow(null, ""),
});

module.exports = MedicalPaperSchema;
