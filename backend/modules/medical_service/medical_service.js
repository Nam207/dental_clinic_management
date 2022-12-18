const mongoose = require("mongoose");

const MedicalServiceSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      require: true,
      ref: "Service",
    },
    techStaffId: {
      type: String,
      require: true,
      ref: "Profile",
    },
    medicalPaperId: {
      type: String,
      require: true,
      ref: "MedicalPaper",
    },
    customerId: {
      type: String,
      require: true,
      ref: "Customer"
    },
    status: {
      type: mongoose.Types.Decimal128,
      default: 0,
      require: true,
    },
    createBy: {
      type: mongoose.Types.ObjectId,
    },
    modifyBy: {
      type: mongoose.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

const MedicalServiceModel = mongoose.model(
  "MedicalService",
  MedicalServiceSchema
);

module.exports = MedicalServiceModel;
