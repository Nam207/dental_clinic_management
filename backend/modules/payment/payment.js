const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },

} , {
    timestamps: true
});

const PaymentModel = mongoose.model('Payment', PaymentSchema);

module.exports = PaymentModel;