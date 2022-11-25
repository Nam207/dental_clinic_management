const ServiceModel = require('./service');
const ConsumableModel = require('../consumable/consumable');
const PrescriptionModel = require('../prescription/prescription');
const HTTPError = require('../../common/httpError');
const MedicineModel = require('../medicine/medicine');

const getService = async (req, res, next) => {
  const { keyword, offset, limit } = req.query;

  const offsetNumber = offset && Number(offset) ? Number(offset) : 0;
  const limitNumber = limit && Number(limit) ? Number(limit) : 5;

  let filter = {};
  if (keyword) {
    const regex = new RegExp(`${keyword}`, "i");
    const regexCond = { $regex: regex };

    filter["$or"] = [{ _id: regexCond }, { name: regexCond }];
  }

  const [service, totalService] = await Promise.all([
    ServiceModel.find(filter)
      .skip(offsetNumber * limitNumber)
      .limit(limitNumber),
    ServiceModel.countDocuments(filter),
  ]);

  res.send({ success: 1, data: { data: service, total: totalService } });
};

const getActiveService = async (req, res, next) => {
  const service = await ServiceModel.find({ status: true });
  res.send({ success: 1, data: service });
};

const createService = async (req, res) => {
  const senderUser = req.user;
  const {
    name,
    imageUrl,
    time,
    price,
    note,
    status,
    consumable,
    prescription,
  } = req.body;
  //   console.log(typeof consumable[0]);
  const _id = await getNext();
  const imgUrl = req.file.path;
  const newService = await ServiceModel.create({
    _id: _id,
    name,
    imageUrl: imgUrl,
    time,
    price,
    note,
    status,
    createBy: senderUser._id,
  });

  var consumableArray;
  if (consumable != null) {
    consumableArray = JSON.parse(JSON.stringify(consumable));

    consumableArray.forEach(async (element) => {
      const temp = JSON.parse(element);

      await ConsumableModel.create({
        serviceId: _id,
        medicineId: temp.medicineId,
        numberOfUses: temp.numberOfUses,
        createBy: senderUser._id,
      });
    });
  }

  var prescriptionArray;
  if (prescription != null) {
    prescriptionArray = JSON.parse(JSON.stringify(prescription));
    prescriptionArray.forEach(async (element) => {
      const temp = JSON.parse(element);

      await PrescriptionModel.create({
        serviceId: _id,
        medicineId: temp.medicineId,
        quantity: temp.quantity,
        usage: temp.usage,
        createBy: senderUser._id,
      });
    });
  }

  const fullService = {
    ...newService._doc,
    consumableArray,
    prescriptionArray,
  };
  res.send({ success: 1, data: fullService });
};

const updateService = async (req, res) => {
  const senderUser = req.user;
  const { serviceId } = req.params;
  const {
    name,
    imageUrl,
    time,
    price,
    note,
    status,
    consumable,
    prescription,
  } = req.body;
  const existService = await ServiceModel.findOne({ _id: serviceId });
  if (!existService) {
    throw new HTTPError(400, "Not found service");
  }

  let imgUrl;
  let updatedService;
  if (imageUrl || typeof imageUrl === "string" || imageUrl == "") {
    updatedService = await ServiceModel.findByIdAndUpdate(
      serviceId,
      {
        name,
        time,
        price,
        note,
        status,
        modifyBy: senderUser._id,
      },
      { new: true }
    );
  } else {
    imgUrl = req.file.path;
    updatedService = await ServiceModel.findByIdAndUpdate(
      serviceId,
      {
        name,
        imageUrl: imgUrl,
        time,
        price,
        note,
        status,
        modifyBy: senderUser._id,
      },
      { new: true }
    );
  }

  await ConsumableModel.deleteMany({ serviceId: serviceId });
  var consumableArray;
  if (consumable != null) {
    consumableArray = JSON.parse(JSON.stringify(consumable));
    consumableArray.forEach(async (element) => {
      const temp = JSON.parse(element);

      await ConsumableModel.create({
        serviceId: _id,
        medicineId: temp.medicineId,
        numberOfUses: temp.numberOfUses,
        createBy: senderUser._id,
      });
    });
  }
  await PrescriptionModel.deleteMany({ serviceId: serviceId });
  var prescriptionArray;
  if (prescription != null) {
    prescriptionArray = JSON.parse(JSON.stringify(prescription));
    prescriptionArray.forEach(async (element) => {
      const temp = JSON.parse(element);

      await PrescriptionModel.create({
        serviceId: _id,
        medicineId: temp.medicineId,
        quantity: temp.quantity,
        usage: temp.usage,
        createBy: senderUser._id,
      });
    });
  }

  const fullService = {
    ...updateService._doc,
    consumableArray,
    prescriptionArray,
  };
  res.send({ success: 1, data: fullService });
};

const getServiceById = async (req, res) => {
  const { serviceId } = req.params;

  const service = await ServiceModel.findById(serviceId);
  const consumable = await ConsumableModel.find({ serviceId: serviceId });
  const prescription = await PrescriptionModel.find({ serviceId: serviceId });
  let consumableArray = JSON.parse(JSON.stringify(consumable));
  let prescriptionArray = JSON.parse(JSON.stringify(prescription));

  if (consumableArray.length > 0) {
    await Promise.all(
      consumableArray.map(async (element, index) => {
        const medicine = await MedicineModel.findById(element.medicineId);
        consumableArray[index] = {
          ...consumableArray[index],
          medicineName: medicine.name,
          medicineQuantity: medicine.quantity,
          medicineUnit: medicine.unit,
        };
      })
    );
  }

  if (prescriptionArray.length > 0) {
    await Promise.all(
      prescriptionArray.map(async (element, index) => {
        const medicine = await MedicineModel.findById(element.medicineId);

        prescriptionArray[index] = {
          ...prescriptionArray[index],
          medicineName: medicine.name,
          medicineQuantity: medicine.quantity,
          medicineUnit: medicine.unit,
        };
      })
    );
  }

  if (!service) {
    throw new HTTPError(400, "Not found service");
  }

  const fullService = { ...service._doc, consumableArray, prescriptionArray };
  res.send({ success: 1, data: fullService });
};

const updateStatus = async (req, res) => {
  const senderUser = req.user;
  const { serviceId, status } = req.params;

  const existService = await ServiceModel.findOne({ _id: serviceId });
  if (!existService) {
    throw new HTTPError(400, "Not found service");
  }

  const updatedService = await ServiceModel.findByIdAndUpdate(
    serviceId,
    {
      status,
      modifyBy: senderUser._id,
    },
    { new: true }
  );

  res.send({ success: 1, data: updatedService });
};

const getNext = async () => {
  const count = await ServiceModel.find().count();
  if (count <= 0) return "DV_0000000001";

  const lastService = await ServiceModel.find().sort({ _id: -1 }).limit(1);
  const nextId = lastService[0]._id;
  const idNumber = parseInt(nextId.split("_")[1]) + 1 + "";
  var temp = "";
  for (let i = 0; i < 10 - idNumber.length; i++) {
    temp += "0";
  }
  temp += idNumber;
  return "DV_" + temp;
};

module.exports = {
  getService,
  createService,
  updateService,
  getServiceById,
  updateStatus,
  getActiveService,
};
