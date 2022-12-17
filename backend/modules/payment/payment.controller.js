const PaymentModel = require('./payment');


const createPayment = async () => {
    try {
        if (await PaymentModel.find().count() > 0) return;
        await PaymentModel.create({name: "Khác"});
        const payments = [
            { name: "Tiền mặt" },
            { name: "Thẻ tín dụng" },
            { name: "MOMO" },
            { name: "VNPAY" },
            { name: "Chuyển khoản" },
            { name: "Thẻ trả trước" },
        ];

        await PaymentModel.create(payments);
        return;
    } catch (err) {
        return err;
    }
}

const getPayment = async (req, res) => {
    const roles = await PaymentModel.find();
    res.send({ success: 1, data: roles });
}

module.exports = {
    createPayment,
    getPayment
}