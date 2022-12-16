const PerrmissionModel = require("./permission");
const RoleModel = require("../role/role");
const FunctionsModel = require("../function/function");

const createPermission = async () => {
  try {
    if ((await PerrmissionModel.find().count()) > 0) return;

    const doctorId = await RoleModel.findOne({ name: "Bác sĩ" });
    const techStaffId = await RoleModel.findOne({ name: "Kỹ thuật viên" });
    const receptionistId = await RoleModel.findOne({ name: "Lễ tân" });

    const functionArray = await FunctionsModel.find();
    let doctorArray = [];
    let techStaffArray = [];
    let receptionistArray = [];

    await Promise.all(
      functionArray.map((element) => {
        switch (element.name) {
          case "Quản lý nhân viên":
            doctorArray.push({
              functionId: element._id,
              add: false,
              edit: false,
              delete: false,
              view: false,
            });
            techStaffArray.push({
              functionId: element._id,
              add: false,
              edit: false,
              delete: false,
              view: false,
            });
            receptionistArray.push({
              functionId: element._id,
              add: false,
              edit: false,
              delete: false,
              view: false,
            });
            break;

          case "Quản lý khách hàng":
            doctorArray.push({
              functionId: element._id,
              add: true,
              edit: true,
              delete: true,
              view: true,
            });
            techStaffArray.push({
              functionId: element._id,
              add: true,
              edit: true,
              delete: true,
              view: true,
            });
            receptionistArray.push({
              functionId: element._id,
              add: true,
              edit: true,
              delete: true,
              view: true,
            });
            break;

          case "Quản lý thuốc":
            doctorArray.push({
              functionId: element._id,
              add: true,
              edit: true,
              delete: true,
              view: true,
            });
            techStaffArray.push({
              functionId: element._id,
              add: false,
              edit: false,
              delete: false,
              view: false,
            });
            receptionistArray.push({
              functionId: element._id,
              add: false,
              edit: false,
              delete: false,
              view: false,
            });
            break;

          case "Quản lý dịch vụ":
            doctorArray.push({
              functionId: element._id,
              add: true,
              edit: true,
              delete: true,
              view: true,
            });
            techStaffArray.push({
              functionId: element._id,
              add: true,
              edit: true,
              delete: true,
              view: true,
            });
            receptionistArray.push({
              functionId: element._id,
              add: false,
              edit: false,
              delete: false,
              view: true,
            });
            break;

          case "Quản lý phiếu khám":
            doctorArray.push({
              functionId: element._id,
              add: true,
              edit: true,
              delete: false,
              view: true,
            });
            techStaffArray.push({
              functionId: element._id,
              add: false,
              edit: true,
              delete: false,
              view: true,
            });
            receptionistArray.push({
              functionId: element._id,
              add: true,
              edit: true,
              delete: false,
              view: true,
            });
            break;

          case "Quản lý phòng khám":
            doctorArray.push({
              functionId: element._id,
              add: false,
              edit: false,
              delete: false,
              view: false,
            });
            techStaffArray.push({
              functionId: element._id,
              add: false,
              edit: false,
              delete: false,
              view: false,
            });
            receptionistArray.push({
              functionId: element._id,
              add: false,
              edit: false,
              delete: false,
              view: false,
            });
            break;

          default:
            break;
        }
      })
    );
    const permission = [
      {
        roleId: doctorId._id,
        permissionArray: doctorArray,
      },
      {
        roleId: techStaffId._id,
        permissionArray: techStaffArray,
      },
      {
        roleId: receptionistId._id,
        permissionArray: receptionistArray,
      },
    ];
    await PerrmissionModel.create(permission);
    return;
  } catch (err) {
    return err;
  }
};

const getPermission = async(req, res) => {
    const permission = await PerrmissionModel.find();
    res.send({success: 1, data: permission});
};

const updatePermission = async(req, res) => {
    const {permission} = req.body;
    let newPermission = [];
    await Promise.all(permission.map(async (element)=>{
      const updatePermission = await PerrmissionModel.findByIdAndUpdate(element._id, {
        permissionArray: element.permissionArray,
      },{ new: true });
      newPermission.push(updatePermission)
    }))
    res.send({success: 1, data: newPermission});
};

module.exports = {
  createPermission,
  getPermission,
  updatePermission,
};
