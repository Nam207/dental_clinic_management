const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    roleId: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
    permissionArray: [
        {
            functionId: {
                type: mongoose.Types.ObjectId,
                require: true,
            },
            add:{
                type: Boolean,
                require: true
            },
            delete:{
                type: Boolean,
                require: true
            },
            edit:{
                type: Boolean,
                require: true
            },
            view:{
                type: Boolean,
                require: true
            }
        }
    ],
} , {
    timestamps: true
});

const PermissionModel = mongoose.model('Permission', PermissionSchema);

module.exports = PermissionModel;