const MedicineModel = require("./medicine");
const HTTPError = require("../../common/httpError");

const getMedicine = async (req, res) => {
  const { keyword, offset, limit } = req.query;

  const offsetNumber = offset && Number(offset) ? Number(offset) : 0;
  const limitNumber = limit && Number(limit) ? Number(limit) : 5;

  let filter = {};
  if (keyword) {
    const regex = new RegExp(`${keyword}`, "i");
    const regexCond = { $regex: regex };
    // filter.title = { $regex: regex }
    filter["$or"] = [{ _id: regexCond }, { name: regexCond }];
  }

  const [medicine, totalMedicine] = await Promise.all([
    MedicineModel.find(filter)
      .skip(offsetNumber * limitNumber)
      .limit(limitNumber),
    MedicineModel.countDocuments(filter),
  ]);

  res.send({ success: 1, data: { data: medicine, total: totalMedicine } });
};

const getActiveMedicine = async (req, res) => {
  const medicine = await MedicineModel.find({ status: true });
  res.send({ success: 1, data: medicine });
};

const checkName = async (req, res) => {
  const { name } = req.params;
  const medicine = await MedicineModel.findOne({ name: name });
  if (medicine != null) res.send({ success: 0, data: medicine })
  res.send({ success: 1, data: medicine });
};

const createMedicine = async (req, res) => {
  const senderUser = req.user;
  const imgUrl = req.file.path;
  const {
    name,
    imageUrl,
    quantity,
    price,
    purchasePrice,
    effect,
    usage,
    contraindication,
  } = req.body;

  const existMedicine = await MedicineModel.findOne({ 'name': name });
  if (existMedicine) {
    throw new HTTPError(400, "Medicine had exist");
  }

  const medID = await getNext();
  const newMedicine = await MedicineModel.create({
    _id: medID,
    name,
    imageUrl: imgUrl,
    quantity,
    price,
    purchasePrice,
    effect,
    usage,
    contraindication,
    createBy: senderUser._id,
  });
  res.send({ success: 1, data: newMedicine });
};

const updateMedicine = async (req, res) => {
  const senderUser = req.user;
  const { medicineId } = req.params;
  const {
    name,
    imageUrl,
    quantity,
    price,
    purchasePrice,
    effect,
    usage,
    contraindication,
    status,
  } = req.body;

  const existMedicine = await MedicineModel.findOne({ _id: medicineId });
  if (!existMedicine) {
    throw new HTTPError(400, "Not found medicine");
  }

  let imgUrl;
  let updatedMedicine;
  if (imageUrl || typeof imageUrl === "string" || imageUrl == "") {
    updatedMedicine = await MedicineModel.findByIdAndUpdate(
      medicineId,
      {
        name,
        quantity,
        price,
        purchasePrice,
        effect,
        usage,
        contraindication,
        status,
        modifyBy: senderUser._id,
      },
      { new: true }
    );
  } else {
    imgUrl = req.file.path;
    updatedMedicine = await MedicineModel.findByIdAndUpdate(
      medicineId,
      {
        name,
        imageUrl: imgUrl,
        quantity,
        price,
        purchasePrice,
        effect,
        usage,
        contraindication,
        status,
        modifyBy: senderUser._id,
      },
      { new: true }
    );
  }

  res.send({ success: 1, data: updatedMedicine });
};

const getMedicineById = async (req, res) => {
  const { medicineId } = req.params;

  const medicine = await MedicineModel.findById(medicineId);

  res.send({ success: 1, data: medicine });
};

const updateStatus = async (req, res) => {
  const senderUser = req.user;
  const { medicineId, status } = req.params;

  const existMedicine = await MedicineModel.findOne({ _id: medicineId });
  if (!existMedicine) {
    throw new HTTPError(400, "Not found medicine");
  }

  const updatedMedicine = await MedicineModel.findByIdAndUpdate(
    medicineId,
    {
      status,
      modifyBy: senderUser._id,
    },
    { new: true }
  );

  res.send({ success: 1, data: updatedMedicine });
};

const getNext = async () => {
  const count = await MedicineModel.find().count();
  if (count <= 0) return "SP_0000000001";

  const lastMedicine = await MedicineModel.find().sort({ _id: -1 }).limit(1);
  const nextId = lastMedicine[0]._id;
  const idNumber = parseInt(nextId.split("_")[1]) + 1 + "";
  var temp = "";
  for (let i = 0; i < 10 - idNumber.length; i++) {
    temp += "0";
  }
  temp += idNumber;
  return "SP_" + temp;
};

module.exports = {
  getMedicine,
  createMedicine,
  updateMedicine,
  getMedicineById,
  updateStatus,
  getActiveMedicine,
  checkName,
};
