const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      require: true,
    },
    fullname: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    address: {
      type: String,
    },
    workingDays: {
      type: Number,
      require: true,
    },
    salary: {
      type: Number,
      require: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
    status: {
      type: Boolean,
      default: true,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProfileModel = mongoose.model("Profile", ProfileSchema);

module.exports = ProfileModel;
