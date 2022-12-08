const mongoose = require('mongoose');

const ClinicSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    accountNumber: {
        type: String,
        require: true,
    }, 
    email: {
        type: String,
        require: true,
    }, 
    icon: {
        type: String,
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

const ClinicModel = mongoose.model('Clinic', ClinicSchema);

module.exports = ClinicModel