const BillModel = require("./bill");
const ProfileModel = require("../profile/profile");
const PaymentModel = require("../payment/payment");
const MedicalPaperModel = require("../medical_paper/medical_paper");
const HTTPError = require("../../common/httpError");

const getBillByMedicalPaper = async (req, res) => {
  const { medicalPaperId } = req.query;
  const bill = await BillModel.find({
    medicalPaperId: medicalPaperId,
  });

  const tempBill = [];
  await Promise.all(
    bill.map(async (element) => {
      const temp = await ProfileModel.findById(element.employeeId);
      let tempObject = {};
      tempObject = {
        ...element._doc,
        nameEmployee: temp.fullname,
      };

      const tempPayment = await PaymentModel.findById(element.paymentId);
      tempObject = {
        ...tempObject,
        namePayment: tempPayment.name,
      };
      tempBill.push(tempObject);
    })
  );
  res.send({ success: 1, data: tempBill });
};

const inputBill = async (req, res) => {
  const senderUser = req.user;
  const { billMedical } = req.body;

  let billArray = JSON.parse(JSON.stringify(billMedical));

  let paymentMoney = 0;
  await Promise.all(
    billArray.map(async (element) => {
      paymentMoney+=Number(element.amount);
      if (
        element._id === "null" ||
        !element ||
        element._id === "undefined" ||
        element._id.length < 1
      ) {
        await BillModel.create({
          medicalPaperId: element.medicalPaperId,
          employeeId: element.employeeId,
          amount: element.amount,
          paymentId: element.paymentId,
          createAt: element.createAt,
          createBy: senderUser._id,
        });
      }
    })
  );

  await MedicalPaperModel.findByIdAndUpdate(billArray[0].medicalPaperId,{ customerPayment: paymentMoney}, {new: true});

  const bill = await BillModel.find({
    medicalPaperId: billArray[0].medicalPaperId,
  });
  res.send({ success: 1, data: bill });
};

module.exports = {
  getBillByMedicalPaper,
  inputBill,
};
