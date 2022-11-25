const RoleModel = require('./role');


const createRole = async () => {
    try {
        if (await RoleModel.find().count() > 0) return;

        const roles = [
            { name: "Admin" },
            { name: "Bác sĩ" },
            { name: "Lễ tân" },
            { name: "Kỹ thuật viên" },
        ];

        await RoleModel.create(roles);
        return;
    } catch (err) {
        return err;
    }
}

const getRole = async (req, res) => {
    const roles = await RoleModel.find({name: {$nin: ["Admin"]}});
    res.send({ success: 1, data: roles });
}

module.exports = {
    createRole,
    getRole,
}