const ClinicModel = require("./clinic");
const HTTPError = require("../../common/httpError");

const createClinic = async () => {
    try {
        if (await ClinicModel.find().count() > 0) return;
        
        const clinic = {
            name:  process.env.CLINIC_NAME,
            phone:  process.env.CLINIC_PHONE,
            email:  process.env.CLINIC_EMAIL,
            accountNumber: process.env.CLINIC_ACCOUNT_NUMBER,
            icon:  process.env.CLINIC_ICON,
            address:  process.env.CLINIC_ADDRESS
        };

        await ClinicModel.create(clinic);
        return;
    } catch (err) {
        return err;
    }
};


const getClinic = async (req, res) => {
  const clinic = await ClinicModel.find();

  res.send({ success: 1, data: clinic });
};

const updateClinic = async (req, res) => {
  const senderUser = req.user;
  const {
    name,
    phone,
    email,
    address,
    accountNumber,
    icon,
  } = req.body;

  const clinic = await ClinicModel.find();
  let iconUrl;
  let updatedClinic;
  if (icon || typeof icon === "string" || icon == "") {
    updatedClinic = await ClinicModel.findByIdAndUpdate(
      clinic[0]._id,
      {
        name,
        phone,
        email,
        address,
        accountNumber,
        modifyBy: senderUser._id,
      },
      { new: true }
    );
  } else {
    iconUrl = req.file.path;
    updatedClinic = await ClinicModel.findByIdAndUpdate(
      clinic[0]._id,
      {
        name,
        icon: iconUrl,
        phone,
        email,
        address,
        accountNumber,
        modifyBy: senderUser._id,
      },
      { new: true }
    );
  }

  res.send({ success: 1, data: updatedClinic });
};

module.exports = {
    getClinic,
    updateClinic,
    createClinic,
};
