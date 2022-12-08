const Joi = require('joi');

const MedicalPaperSchema = Joi.object({
  customerId: Joi.string().required(),
  doctorId: Joi.string().required(),
  reExamination: Joi.date(),
  status: Joi.number().integer().required(),
  medicalService: Joi.array().items(Joi.object()).required(),
});

module.exports = MedicalPaperSchema