const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    imageUrl: {
        type: String,
        require: true,
    },
    quantity: {
        type: Number,
        require: true,
    },
    price: {
        type: mongoose.Types.Decimal128,
        require: true,
    },
    purchasePrice: {
        type: mongoose.Types.Decimal128,
        require: true,
    },
    unit: {
        type: String,
        require: true,
    },
    usage: {
        type: String,
    },
    expiredDay: {
        type: Date,
        require: true,
    },
    status: {
        type: Boolean,
        default: true,
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

const MedicineModel = mongoose.model('Medicine', MedicineSchema);

module.exports = MedicineModel