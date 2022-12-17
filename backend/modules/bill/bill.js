const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    medicalPaperId: {
        type: String,
        require: true,
    },
    employeeId: {
        type: String,
        require: true,
    },
    paymentId: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
    amount: {
        type: mongoose.Types.Decimal128,
        require: true,
    }
} , {
    timestamps: true
});

const BillModel = mongoose.model('Bill', BillSchema);

module.exports = BillModel;