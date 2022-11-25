const DentalMedicalHistoryModel = require('./dental_medical_history');


const createDentalMedicalHistory = async () => {
    try {
        if (await DentalMedicalHistoryModel.find().count() > 0) return;
        
        await DentalMedicalHistoryModel.create({ name: "Khác" });
        const dentalMedicalHistory = [
            { name: "Khớp thái dương hàm" },
            { name: "Đã từng nhổ răng" },
            { name: "Đã từng chỉnh nha" },
            { name: "Đã từng đeo hàm" },
        ];

        await DentalMedicalHistoryModel.create(dentalMedicalHistory);
        return;
    } catch (err) {
        return err;
    }
}

const getDentalMedicalHistory = async (req, res) => {
    const dentalMedicalHistories= await DentalMedicalHistoryModel.find({});
    res.send({ success: 1, data: dentalMedicalHistories });
}

module.exports = {
    createDentalMedicalHistory,
    getDentalMedicalHistory,
}
