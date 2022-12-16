const mongoose = require('mongoose');

const MedicinePrescribeSchema = new mongoose.Schema({
    doctorId: {
        type: String,
        require: true,
    },
    medicalPaperId: {
        type: String,
        require: true,
    },
    medicineId: {
        type: String,
        require: true,
    },
    quantity: {
        type: Number,
        require: true,
    },
    usage: {
        type: String,
    },
    createBy: {
        type: mongoose.Types.ObjectId,
    },
    modifyBy: {
        type: mongoose.Types.ObjectId,
    }
}, {
    timestamps: true
});

const MedicinePrescribeModel = mongoose.model('MedicinePrescribe', MedicinePrescribeSchema);

module.exports = MedicinePrescribeModel