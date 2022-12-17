const MedicinePrescribeModel = require("./medicine_prescribe");
const MedicineModel = require("../medicine/medicine");
const HTTPError = require("../../common/httpError");

const getMedicineByMedicalPaper = async (req, res) => {
  const { medicalPaper } = req.query;
  const medicineTemp = await MedicinePrescribeModel.find({
    medicalPaperId: medicalPaper,
  });
  let medicine = [];
  await Promise.all(
    medicineTemp.map(async (element) => {
      const temp = await MedicineModel.findById(element.medicineId);
      medicine.push({
        ...element._doc,
        name: temp.name,
        unit: temp.quantity,
      });
    })
  );
  res.send({ success: 1, data: medicine });
};

const inputMedicinePrescribe = async (req, res) => {
  const senderUser = req.user;
  const { medicalPrescribe } = req.body;

  let prescriptionArray = JSON.parse(JSON.stringify(medicalPrescribe));

  const existMedicine = await MedicinePrescribeModel.findOne({
    medicalPaperId: prescriptionArray[0].medicalPaperId,
  });
  if (existMedicine) {
    await MedicinePrescribeModel.deleteMany({
      medicalPaperId: prescriptionArray[0].medicalPaperId,
    });
  }

  prescriptionArray.map((element) => {
    element = { ...element, createBy: senderUser._id };
  });
  const newMedicine = await MedicinePrescribeModel.create(prescriptionArray);
  res.send({ success: 1, data: newMedicine });
};

module.exports = {
  getMedicineByMedicalPaper,
  inputMedicinePrescribe,
};
