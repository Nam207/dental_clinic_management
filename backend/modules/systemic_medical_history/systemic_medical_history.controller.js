const SystemicMedicalHistoryModel = require('./systemic_medical_history');


const createSystemicMedicalHistory = async () => {
    try {
        if (await SystemicMedicalHistoryModel.find().count() > 0) return;
        await SystemicMedicalHistoryModel.create({name: "Khác"});
        const systemicMedicalHistory = [
            { name: "Gan" },
            { name: "Tiểu đường" },
            { name: "Thấp khớp" },
            { name: "Thần kinh" },
            { name: "Dị ứng" },
            { name: "Tiêu hóa" },
            { name: "Hô hấp" },
            { name: "Tim mạch" },
            { name: "Thận" },
        ];

        await SystemicMedicalHistoryModel.create(systemicMedicalHistory);
        return;
    } catch (err) {
        return err;
    }
}

const getSystemicMedicalHistory = async (req, res) => {
    const systemicMedicalHistories= await SystemicMedicalHistoryModel.find({});
    res.send({ success: 1, data: systemicMedicalHistories });
}

module.exports = {
    createSystemicMedicalHistory,
    getSystemicMedicalHistory,
}