const mongoose = require('mongoose');

const MedicalPaperSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true,
    },
    customerId: {
        type: String,
        require: true,
        ref: 'Customer'
    },
    doctorId: {
        type: String,
        require: true,
        ref: 'Profile'
    },
    reExamination: {
        type: Date,
    }, 
    status: {
        type: mongoose.Types.Decimal128,
        default: 0,
        require: true,
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

const MedicalPaperModel = mongoose.model('MedicalPaper', MedicalPaperSchema);

module.exports = MedicalPaperModel