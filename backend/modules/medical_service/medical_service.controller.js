const MedicalServiceModel = require("./medical_service");
const HTTPError = require("../../common/httpError");
const ProfileModel = require("../profile/profile");
const e = require("express");

const getMedicalPaperWithService = async (req, res) => {
  const senderUser = req.user;
  const role = req.role;
  const { keyword, offset, limit, startDate, endDate } = req.query;

  const offsetNumber = offset && Number(offset) ? Number(offset) : 0;
  const limitNumber = limit && Number(limit) ? Number(limit) : 5;

  let filter = {};

  //ngày lloiix
  // if (startDate && endDate) {
  //   filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  // }

  if (role[0].name !== "Admin") {
    const techStaff = await ProfileModel.findOne({ userId: senderUser._id });
    filter.techStaffId = techStaff._id;
  }
  console.log(filter)
  const [listMedicalService, total] = await Promise.all([MedicalServiceModel
    .find(filter)
    .populate({ path: 'customerId', select: 'fullname' })
    .populate({ path: 'serviceId', select: 'name' })
    .skip(offsetNumber * limitNumber)
    .limit(limitNumber),
    MedicalServiceModel.count(filter)
  ])

  console.log(listMedicalService)
  if (keyword) {
    let listMedicalServiceArray = [];
    let totalListMedicalService = 0;
    await Promise.all(listMedicalService.map((element) => {
      if (
        element.medicalPaperId.toLowerCase().includes(keyword.toLowerCase()) ||
        element.customerId._id.toLowerCase().includes(keyword.toLowerCase()) ||
        element.customerId.fullname.toLowerCase().includes(keyword.toLowerCase()) ||
        element.serviceId._id.toLowerCase().includes(keyword.toLowerCase()) ||
        element.serviceId.name.toLowerCase().includes(keyword.toLowerCase())
      ) {
        listMedicalServiceArray.push({ ...element._doc });
        totalListMedicalService++;
      }
    }))

    res.send({
      success: 1,
      data: { data: listMedicalServiceArray, total: totalListMedicalService },
    });
    return;
  }
  res.send({
    success: 1,
    data: { data: listMedicalService, total: total },
  });
}

const updateStatus = async (req, res) => {
  const senderUser = req.user;
  const role = req.role;
  const { medicalServiceId, status } = req.params;

  let filter = {};

  const existMedicalService = await MedicalServiceModel.findOne({ _id: medicalServiceId });
  if (!existMedicalService) {
    throw new HTTPError(400, "Not found medical service");
  }
  if (role[0].name !== "Admin") {
    const profile = await ProfileModel.findOne({ userId: senderUser._id });
    if (profile._id !== existMedicalService.techStaffId) {
      throw new HTTPError(500, "Not Auth");
    }
  }

  const newMedicalService = await MedicalServiceModel.findByIdAndUpdate(medicalServiceId, { status: status }, { new: true });

  res.send({
    success: 1,
    data: newMedicalService,
  });
}

module.exports = {
  getMedicalPaperWithService,
  updateStatus,
};
