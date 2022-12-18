require("dotenv").config();
require("express-async-errors");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const clinicRouter = require("./modules/clinic/clinic.router");
const clinicController = require("./modules/clinic/clinic.controller");

const medicineRouter = require("./modules/medicine/medicine.router");

const permissionController = require("./modules/permission/permission.controller");
const permissionRouter = require("./modules/permission/permission.router");

const roleController = require("./modules/role/role.controller");
const roleRouter = require("./modules/role/role.router");

const authRouter = require("./modules/auth/auth.router");
const serviceRouter = require("./modules/service/service.router");

const functionController = require("./modules/function/function.controller");
const functionRouter = require("./modules/function/function.router");

const profileRouter = require("./modules/profile/profile.router");
const profileController = require("./modules/profile/profile.controller");

const systemicMedicalHistoryController = require("./modules/systemic_medical_history/systemic_medical_history.controller");
const dentalMedicalHistoryController = require("./modules/dental_medical_history/dental_medical_history.controller");
const systemicMedicalHistoryRouter = require("./modules/systemic_medical_history/systemic_medical_history.router");
const dentalMedicalHistoryRouter = require("./modules/dental_medical_history/dental_medical_history.router");

const invoicePdfRouter = require("./common/invoicePdf/invoicePdf.router");
const prescriptionPdfRouter = require("./common/prescriptionPdf/prescription.router");

const customerRouter = require("./modules/customer/customer.router");

const medicalPaperRouter = require("./modules/medical_paper/medical_paper.router");

const medicinePrescribeRouter = require("./modules/medicine_prescribe/medicine_prescribe.router");

const paymentController = require("./modules/payment/payment.controller");
const paymentRouter = require("./modules/payment/payment.router");


const medicalServiceRouter = require("./modules/medical_service/medical_service.router");

const billRouter = require("./modules/bill/bill.router");

mongoose.connect(process.env.MONGODB_URL, (err) => {
  if (err) {
    return console.log("Err connnect mongodb", err);
  }
  console.log("Connect DB successfully");
  try {
    roleController.createRole();
    functionController.createFunction();
    systemicMedicalHistoryController.createSystemicMedicalHistory();
    dentalMedicalHistoryController.createDentalMedicalHistory();
    profileController.createAdmin();
    clinicController.createClinic();
    permissionController.createPermission();
    paymentController.createPayment();
  } catch (err) {
    return console.log("Err insert", err);
  }
});

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("time", Date.now(), req.method, req.originalUrl);
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/medicine", medicineRouter);
app.use("/api/role", roleRouter);
app.use("/api/service", serviceRouter);
app.use("/api/profile", profileRouter);
app.use("/api/systemicMedicalHistory", systemicMedicalHistoryRouter);
app.use("/api/dentalMedicalHistory", dentalMedicalHistoryRouter);
app.use("/api/customer", customerRouter);
app.use("/api/clinic", clinicRouter);
app.use("/api/medicalPaper", medicalPaperRouter);
app.use("/api/function", functionRouter);
app.use("/api/permission", permissionRouter);
app.use("/api/medicinePrescribe", medicinePrescribeRouter);
app.use('/api/invoice', invoicePdfRouter);
app.use('/api/prescriptionPdf', prescriptionPdfRouter);
app.use('/api/payment', paymentRouter);
app.use("/api/medicalService", medicalServiceRouter);;
app.use("/api/bill", billRouter);

app.use("*", (req, res, next) => {
  res.status(404).send({ message: "404 not found" });
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).send({ success: 0, message: err.message });
});

app.listen(process.env.PORT || 8080, (err) => {
  if (err) {
    return console.log("Server Error", err);
  }
  console.log("Server started");
});
