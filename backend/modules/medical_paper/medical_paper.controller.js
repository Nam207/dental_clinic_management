const MedicalPaperModel = require("./medical_paper");
const HTTPError = require("../../common/httpError");
const ProfileModel = require("../profile/profile");
const MedicalServiceModel = require("../medical_service/medical_service");

const getMedicalPaper = async (req, res) => {
  const { keyword, offset, limit, startDate, endDate } = req.query;

  const offsetNumber = offset && Number(offset) ? Number(offset) : 0;
  const limitNumber = limit && Number(limit) ? Number(limit) : 5;

  let filter = {};
  if (keyword) {
    const regex = new RegExp(`${keyword}`, "i");
    const regexCond = { $regex: regex };

    filter["$or"] = [{ _id: regexCond }, { fullname: regexCond }];
  }

  if(startDate && endDate){
    filter.created_on = {$gte: [startDate], $lt: [endDate]}
  }

  const [medicalPaper, totalMedicalPaper] = await Promise.all([
    MedicalPaperModel.find(filter)
      .skip(offsetNumber * limitNumber)
      .limit(limitNumber),
      MedicalPaperModel.countDocuments(filter),
  ]);

  res.send({ success: 1, data: { data: medicalPaper, total: totalMedicalPaper } });
};

const createMedicalPaper = async (req, res) => {
  const senderUser = req.user;
  const profile = await ProfileModel.find({ userId: senderUser });

  if (!profile) {
    throw new HTTPError(400, "Not found profile");
  }

  const {
    customerId,
    doctorId,
    reExamination,
    status,
    note,
    medicalService,
  } = req.body;
  const medicalId = await getNext();

  let medicalServiceArray;
  if (medicalService != null) {
    medicalServiceArray = JSON.parse(JSON.stringify(medicalService));

    medicalServiceArray.forEach(async (element) => {
      const temp = JSON.parse(element);

      await MedicalServiceModel.create({
        serviceId: temp.serviceId,
        TechStaffId: temp.techStaffId,
        status: temp.status,
        medicalPaperId: medicalId,
        createBy: senderUser._id,
      });
    });
  }

  const newMedicalPaper = await MedicalPaperModel.create({
    _id: medicalId,
    customerId,
    doctorId,
    reExamination,
    note,
    status,
    createBy: profile._id,
  });
  res.send({ success: 1, data: newMedicalPaper });
};

const getMedicalPaperById = async (req, res) => {
  const { medicalPaperId } = req.params;

  const medicalPaper = await MedicalPaperModel.findById(medicalPaperId);
  const medicalService = await MedicalServiceModel.find({medicalPaperId: medicalPaperId})

  console.log(medicalPaper);
  console.log(medicalService);
  res.send({ success: 1, data: {...medicalPaper, ...medicalService} });
};


const getNext = async () => {
  const count = await MedicalPaperModel.find().count();
  if (count <= 0) return "PK_0000000001";

  const lastMedicalPaper = await MedicalPaperModel.find().sort({ _id: -1 }).limit(1);
  const nextId = lastMedicalPaper[0]._id;
  const idNumber = parseInt(nextId.split("_")[1]) + 1 + "";
  var temp = "";
  for (let i = 0; i < 10 - idNumber.length; i++) {
    temp += "0";
  }
  temp += idNumber;
  return "PK_" + temp;
};

module.exports = {
  getMedicalPaper,
  getMedicalPaperById,
  createMedicalPaper,
};
