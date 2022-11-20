const CustomerModel = require("./customer");
const HTTPError = require("../../common/httpError");

const getCustomer = async (req, res) => {
  const customers = await CustomerModel.find({});
  res.send({ success: 1, data: customers });
};

const checkPhone = async (req, res) => {
  const {phone} = req.params;
  const customers = await CustomerModel.findOne({phone: phone});
  if(customers != null) res.send({success: 0, data: customers})
  res.send({ success: 1, data: customers });
};

const checkEmail = async (req, res) => {
  const {email} = req.params;
  const customers = await CustomerModel.findOne({email: email});
  if(customers != null) res.send({success: 0, data: customers})
  res.send({ success: 1, data: customers });
};

const getActiveCustomer = async (req, res) => {
  const customers = await CustomerModel.find({status: true});
  res.send({ success: 1, data: customers });
};

const createCustomer = async (req, res) => {
  const senderUser = req.user;
  const {
    fullname,
    phone,
    email,
    dateOfBirth,
    gender,
    job,
    bloodGroup,
    address,
    note,
    systemicMedicalHistory,
    dentalMedicalHistory,
  } = req.body;
  const cusId = await getNext();
  const newCustomer = await CustomerModel.create({
    _id: cusId,
    fullname,
    phone,
    email,
    dateOfBirth,
    gender,
    job,
    bloodGroup,
    address,
    note,
    createBy: senderUser._id,
    systemicMedicalHistory,
    dentalMedicalHistory,
  });
  res.send({ success: 1, data: newCustomer });
};

const updateCustomer = async (req, res) => {
  const senderUser = req.user;
  const { customerId } = req.params;
  const {
    fullname,
    phone,
    email,
    dateOfBirth,
    gender,
    job,
    bloodGroup,
    address,
    note,
    status,
    systemicMedicalHistory,
    dentalMedicalHistory,
  } = req.body;

  const existCustomer = await CustomerModel.findOne({ '_id': customerId });
  if (!existCustomer) {
    throw new HTTPError(400, "Not found customer");
  }

  const updatedCustomer = await CustomerModel.findByIdAndUpdate(
    customerId,
    {
      fullname,
      phone,
      email,
      dateOfBirth,
      gender,
      job,
      bloodGroup,
      address,
      note,
      status,
      modifyBy: senderUser._id,
      systemicMedicalHistory,
      dentalMedicalHistory,
    },
    { new: true }
  );

  res.send({ success: 1, data: updatedCustomer });
};

const getCustomerById = async (req, res) => {
  const { customerId } = req.params;

  const customer = await CustomerModel.findById(customerId);

  res.send({ success: 1, data: customer });
};

const updateStatus = async (req, res) => {
  const senderUser = req.user;
  const { customerId, status } = req.params;

  const existCustomer = await CustomerModel.findOne({ _id: customerId });
  if (!existCustomer) {
    throw new HTTPError(400, "Not found customer");
  }

  const updatedCustomer = await CustomerModel.findByIdAndUpdate(
    customerId,
    {
      status,
      modifyBy: senderUser._id,
    },
    { new: true }
  );

  res.send({ success: 1, data: updatedCustomer });
};

const getNext = async () => {
  const count = await CustomerModel.find().count();
  if (count <= 0) return "KH_0000000001";

  const lastCustomer = await CustomerModel.find().sort({ _id: -1 }).limit(1);
  const nextId = lastCustomer[0]._id;
  const idNumber = parseInt(nextId.split("_")[1]) + 1 + "";
  var temp = "";
  for (let i = 0; i < 10 - idNumber.length; i++) {
    temp += "0";
  }
  temp += idNumber;
  return "KH_" + temp;
};

module.exports = {
  getCustomer,
  createCustomer,
  updateCustomer,
  getCustomerById,
  updateStatus,
  getActiveCustomer,
  checkPhone,
  checkEmail,
};
