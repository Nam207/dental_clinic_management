const MedicalPaperModel = require("./medical_paper");
const HTTPError = require("../../common/httpError");
const ProfileModel = require("../profile/profile");
const MedicalServiceModel = require("../medical_service/medical_service");
const CustomerModel = require("../customer/customer");
const ServiceModel = require("../service/service");
const MedicalTechModel = require("../medical_tech/medical_tech");

const getReExamination = async (req, res) => {
  const { offset, limit, startDate, endDate } = req.query;

  const offsetNumber = offset && Number(offset) ? Number(offset) : 0;
  const limitNumber = limit && Number(limit) ? Number(limit) : 5;

  let filter = {};
  if (startDate && endDate) {
    const fromDate = new Date(startDate);
    fromDate.setHours(0);

    const toDate = new Date(endDate);
    toDate.setHours(24);
    filter.reExamination = { $gte: fromDate, $lt: toDate };
  }

  const [medicalPaper, totalMedicalPaper] = await Promise.all([
    MedicalPaperModel.find(filter)
      .skip(offsetNumber * limitNumber)
      .limit(limitNumber),
    MedicalPaperModel.countDocuments(filter),
  ]);

  let fullMedicalPaper = [];
  await Promise.all(
    medicalPaper.map(async (element) => {
      const customer = await CustomerModel.findById(element.customerId);
      fullMedicalPaper.push({
        ...element._doc,
        customerName: customer.fullname,
        phone: customer.phone,
      });
    })
  );
  res.send({
    success: 1,
    data: { data: fullMedicalPaper, total: totalMedicalPaper },
  });
};

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

  if (
    startDate &&
    endDate &&
    (startDate !== "undefined" || endDate !== "undefined")
  ) {
    var dateStartParts = startDate.split("/");
    var fromDate = new Date(
      +dateStartParts[2],
      dateStartParts[1] - 1,
      +dateStartParts[0]
    );
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    var dateEndParts = endDate.split("/");
    var toDate = new Date(
      +dateEndParts[2],
      dateEndParts[1] - 1,
      +dateEndParts[0]
    );
    toDate.setHours(24);
    toDate.setMinutes(0);
    toDate.setSeconds(0);

    filter.createdAt = { $gte: fromDate, $lte: toDate };
  } else {
    var fromDate = new Date();
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    var toDate = new Date();
    toDate.setHours(24);
    toDate.setMinutes(0);
    toDate.setSeconds(0);
    filter.createdAt = { $gte: fromDate, $lte: toDate };
  }

  const [medicalPaper, totalMedicalPaper] = await Promise.all([
    MedicalPaperModel.find()
      .skip(offsetNumber * limitNumber)
      .limit(limitNumber)
      .where(filter),
    MedicalPaperModel.countDocuments(filter),
  ]);

  let medicalPaperArray = [];
  await Promise.all(
    medicalPaper.map(async (element) => {
      const customer = await CustomerModel.findById(element.customerId);
      const staff = await ProfileModel.findById(element.createBy);
      medicalPaperArray.push({
        ...element._doc,
        customer: customer.fullname,
        staff: staff.fullname,
      });
    })
  );

  res.send({
    success: 1,
    data: { data: medicalPaperArray, total: totalMedicalPaper },
  });
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
    totalAmount,
  } = req.body;
  const medicalId = await getNext();

  // let medicalServiceArray;
  // if (medicalService != null) {
  //   medicalServiceArray = JSON.parse(JSON.stringify(medicalService));

  //   medicalServiceArray.forEach(async (element) => {
  //     await MedicalServiceModel.create({
  //       serviceId: element.serviceId,
  //       techStaffId: element.ktvId,
  //       customerId: customerId,
  //       status: element.status,
  //       medicalPaperId: medicalId,
  //       createBy: senderUser._id,
  //     });
  //   });
  // }

  const newMedicalPaper = await MedicalPaperModel.create({
    _id: medicalId,
    customerId,
    doctorId,
    reExamination,
    note,
    status,
    createBy: profile[0]._id,
    totalAmount,
  });
  res.send({ success: 1, data: newMedicalPaper });
};

const updateMedicalPaper = async (req, res) => {
  const senderUser = req.user;
  const { medicalPaperId } = req.params;
  const profile = await ProfileModel.find({ userId: senderUser });

  if (!profile) {
    throw new HTTPError(400, "Not found profile");
  }

  const medicalPaper = await MedicalPaperModel.find({ _id: medicalPaperId });

  if (!medicalPaper) {
    throw new HTTPError(400, "Not found medical Paper");
  }

  const {
    customerId,
    doctorId,
    reExamination,
    status,
    note,
    predic,
    totalAmount,
  } = req.body;

  const newMedicalPaper = await MedicalPaperModel.findByIdAndUpdate(
    medicalPaperId,
    {
      customerId,
      doctorId,
      reExamination,
      note,
      predic,
      status,
      modifyBy: senderUser._id,
      totalAmount,
    },
    { new: true }
  );
  res.send({ success: 1, data: newMedicalPaper });
};

const getMedicalPaperById = async (req, res) => {
  const { medicalPaperId } = req.params;

  const medicalPaper = await MedicalPaperModel.findById(medicalPaperId);
  const medicalService = await MedicalServiceModel.find({
    medicalPaperId: medicalPaperId,
  });

  let medicalServiceArray = [];
  console.log(medicalService);
  if (medicalService.length > 0) {
    await Promise.all(
      medicalService.map(async (element) => {
        const medical_tech = await MedicalTechModel.find({
          medicalService: element._id,
        }).sort({ dateDoing: -1 });
        const techStaff = await ProfileModel.findById(medical_tech[0].techId);
        const service = await ServiceModel.findById(element.serviceId);
        medicalServiceArray.push({
          ...element._doc,
          techStaff: techStaff.fullname,
          servicePrice: service.price,
          serviceName: service.name,
        });
      })
    );
  }

  const staff = await ProfileModel.findById(medicalPaper.createBy);
  const customer = await CustomerModel.findById(medicalPaper.customerId);
  const doctor = await ProfileModel.findById(medicalPaper.doctorId);

  res.send({
    success: 1,
    data: {
      ...medicalPaper._doc,
      medicalService: medicalServiceArray,
      staff: `${staff.fullname} - ${staff._id}`,
      customer: customer.fullname,
      doctor: doctor.fullname,
      systemicMedicalHistory: customer.systemicMedicalHistory,
      dentalMedicalHistory: customer.dentalMedicalHistory,
    },
  });
};

const getMedicalPaperForDoctor = async (req, res) => {
  const senderUser = req.user;
  const role = req.role;
  const { keyword, offset, limit, startDate, endDate } = req.query;
  const offsetNumber = offset && Number(offset) ? Number(offset) : 0;
  const limitNumber = limit && Number(limit) ? Number(limit) : 5;

  let filter = {};

  if (startDate && endDate) {
    const fromDate = new Date(startDate);
    fromDate.setHours(0);

    const toDate = new Date(endDate);
    toDate.setHours(24);
    filter.createdAt = { $gte: fromDate, $lte: toDate };
  }

  if (role[0].name !== "Admin") {
    const techStaff = await ProfileModel.findOne({ userId: senderUser._id });
    filter.doctorId = techStaff._id;
  }

  filter.status = 0;
  const [listMedicalPaper, total] = await Promise.all([
    MedicalPaperModel.find(filter)
      .populate({ path: "customerId", select: "fullname" })
      .skip(offsetNumber * limitNumber)
      .limit(limitNumber),
    MedicalPaperModel.count(filter),
  ]);
  if (keyword) {
    let listMedicalPaperArray = [];
    let totalListMedicalPaper = 0;
    await Promise.all(
      listMedicalPaper.map((element) => {
        if (
          element._id.toLowerCase().includes(keyword.toLowerCase()) ||
          element.customerId._id
            .toLowerCase()
            .includes(keyword.toLowerCase()) ||
          element.customerId.fullname
            .toLowerCase()
            .includes(keyword.toLowerCase())
        ) {
          listMedicalPaperArray.push({ ...element._doc });
          totalListMedicalPaper++;
        }
      })
    );

    res.send({
      success: 1,
      data: { data: listMedicalPaperArray, total: totalListMedicalPaper },
    });
    return;
  }

  res.send({
    success: 1,
    data: { data: listMedicalPaper, total: total },
  });
};

const getNext = async () => {
  const count = await MedicalPaperModel.find().count();
  if (count <= 0) return "PK_0000000001";

  const lastMedicalPaper = await MedicalPaperModel.find()
    .sort({ _id: -1 })
    .limit(1);
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
  getReExamination,
  updateMedicalPaper,
  getMedicalPaperForDoctor,
};
