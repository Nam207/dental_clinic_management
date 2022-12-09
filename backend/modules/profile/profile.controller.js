const HTTPError = require("../../common/httpError");
const ProfileModel = require("./profile");
const UserScheduleModel = require("../user_schedule/user_schedule");
const ScheduleModel = require("../schedule/schedule");
const UserModel = require("../auth/user");
const bcrypt = require("bcryptjs");
const sendEmail = require("../../common/sendEmail");
const UserRoleModel = require("../user_role/user_role");
const RoleModel = require("../role/role");

const createAdmin = async (req, res) => {
  if ((await UserModel.find().count()) > 0) return null;

  const password = process.env.PASSWORD_ADMIN;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const user = [
    { username: process.env.USERNAME_ADMIN, password: hashPassword },
  ];

  const admin = await UserModel.create(user);
  try {
    if ((await ProfileModel.find({ _id: "admin" }).count()) > 0) return null;
    const profileAdmin = {
      _id: "admin",
      fullname: "Nguyễn Thành Nam",
      phone: "0974485920",
      email: process.env.EMAIL_ADMIN,
      address: "",
      userId: admin[0]._id,
    };
    await ProfileModel.create(profileAdmin);
    return;
  } catch (err) {
    return err;
  }
};

const getDoctor = async (req, res) => {
  const role = await RoleModel.findOne({ name: "Bác sĩ" });
  const userId = await UserRoleModel.find({ roleId: role._id });
  const userIdArray = userId.map((u) => u.userId);
  const doctor = await ProfileModel.find({ userId: { $in: userIdArray } });
  res.send({ success: 1, data: doctor });
};

const getTechStaff = async (req, res) => {
  const role = await RoleModel.findOne({ name: "Kỹ thuật viên" });

  const userId = await UserRoleModel.find({ roleId: role._id });
  const userIdArray = userId.map((u) => u.userId);
  const techStaff = await ProfileModel.find({ userId: { $in: userIdArray } });
  res.send({ success: 1, data: techStaff });
};

const curProfile = async (req, res) => {
  const senderUser = req.user;
  const profile = await ProfileModel.findOne({ userId: senderUser });

  if (!profile) {
    throw new HTTPError(400, "Not found profile");
  }

  const roleId = await UserRoleModel.find({ userId: profile.userId });
  const role = await Promise.all(
    roleId.map(async (id) => await RoleModel.findById(id.roleId))
  );
  const roleArray = role.map((r) => r._id);

  const scheduleId = await UserScheduleModel.find({ userId: profile._id });
  const schedule = await Promise.all(
    scheduleId.map(async (id) => await ScheduleModel.findById(id.scheduleId))
  );
  const scheduleArray = JSON.parse(JSON.stringify(schedule));
  const fullProfile = { ...profile._doc, roleArray, scheduleArray };
  res.send({ success: 1, data: fullProfile });
};

const checkPhone = async (req, res) => {
  const { phone } = req.params;
  const customers = await ProfileModel.findOne({ phone: phone });
  if (customers != null) res.send({ success: 0, data: customers });
  res.send({ success: 1, data: customers });
};

const checkEmail = async (req, res) => {
  const { email } = req.params;
  const customers = await ProfileModel.findOne({ email: email });
  if (customers != null) res.send({ success: 0, data: customers });
  res.send({ success: 1, data: customers });
};

const getProfile = async (req, res, next) => {
  const { keyword, offset, limit } = req.query;

  const offsetNumber = offset && Number(offset) ? Number(offset) : 0;
  const limitNumber = limit && Number(limit) ? Number(limit) : 5;

  let filter = {};
  filter._id = { $nin: ["admin"] };
  if (keyword) {
    const regex = new RegExp(`${keyword}`, "i");
    const regexCond = { $regex: regex };
    filter["$or"] = [{ _id: regexCond }, { fullname: regexCond }];
  }

  let [profile, totalProfile] = await Promise.all([
    ProfileModel.find(filter)
      .skip(offsetNumber * limitNumber)
      .limit(limitNumber),
    ProfileModel.countDocuments(filter),
  ]);

  let fullProfile = [];
  await Promise.all(
    profile.map(async (element) => {
      const roleid = await UserRoleModel.find({ userId: element.userId });
      const role = await RoleModel.find({
        _id: {
          $in: roleid.map((el) => {
            return el.roleId;
          }),
        },
      });
      element = { ...element._doc, role };
      fullProfile.push(element);
    })
  );

  res.send({ success: 1, data: { data: fullProfile, total: totalProfile } });
};

const createProfile = async (req, res) => {
  const senderUser = req.user;
  const {
    fullname,
    phone,
    email,
    address,
    workingDays,
    salary,
    status,
    role,
    schedule,
  } = req.body;
  const _id = await getNext();

  const password = generatePassword();
  const username = await generateUsername(fullname);
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await UserModel.create({
    username,
    password: hashPassword,
  });

  const newProfile = await ProfileModel.create({
    _id: _id,
    fullname,
    phone,
    email,
    address,
    workingDays,
    salary,
    status,
    userId: newUser._id,
    createBy: senderUser._id,
  });

  var roleArray;
  if (role != null) {
    roleArray = JSON.parse(JSON.stringify(role));
    await Promise.all(
      roleArray.map(async (element) => {
        await UserRoleModel.create({
          userId: newUser._id,
          roleId: element,
        });
      })
    );
  }

  var scheduleArray;
  if (schedule != null) {
    scheduleArray = JSON.parse(JSON.stringify(schedule));
    await Promise.all(
      scheduleArray.map(async (element) => {
        const existSchedule = await ScheduleModel.find({
          start_time_hours: element.start_time_hours,
          start_time_minutes: element.start_time_minutes,
          end_time_hours: element.end_time_hours,
          end_time_minutes: element.end_time_minutes,
          weekday: element.weekday,
        });
        if (existSchedule) {
          const newSchedule = await ScheduleModel.create({
            start_time_hours: element.start_time_hours,
            start_time_minutes: element.start_time_minutes,
            end_time_hours: element.end_time_hours,
            end_time_minutes: element.end_time_minutes,
            weekday: element.weekday,
          });
          await UserScheduleModel.create({
            userId: _id,
            scheduleId: newSchedule._id,
          });
        } else {
          await UserScheduleModel.create({
            userId: _id,
            scheduleId: existSchedule._id,
          });
        }
      })
    );
  }

  await sendEmail(
    email,
    "[DCManagement] Tài khoản và mật khẩu của bạn",
    "Chào mừng bạn đến với Dentail Clinic Management! \n Tài khoản của bạn là " +
      username +
      "\n Mật khẩu của bạn là " +
      password
  );

  const fullProfile = { ...newProfile._doc, roleArray, scheduleArray };
  res.send({ success: 1, data: fullProfile });
};

const updateProfile = async (req, res) => {
  const senderUser = req.user;
  const { staffId } = req.params;
  const {
    fullname,
    phone,
    email,
    role,
    address,
    workingDays,
    salary,
    status,
    schedule,
  } = req.body;
  const existUser = await ProfileModel.findOne({ _id: staffId });
  if (!existUser) {
    throw new HTTPError(400, "Not found staff");
  }

  const updatedProfile = await ProfileModel.findByIdAndUpdate(
    staffId,
    {
      fullname,
      phone,
      email,
      address,
      workingDays,
      salary,
      status,
      modifyBy: senderUser._id,
    },
    { new: true }
  );

  await UserRoleModel.deleteMany({ userId: existUser.userId });
  var roleArray;
  if (role != null) {
    roleArray = JSON.parse(JSON.stringify(role));
    await Promise.all(
      roleArray.map(async (element) => {
        await UserRoleModel.create({
          userId: existUser.userId,
          roleId: element,
        });
      })
    );
  }

  await UserScheduleModel.deleteMany({ userId: staffId });
  var scheduleArray;
  if (schedule != null) {
    scheduleArray = JSON.parse(JSON.stringify(schedule));
    await Promise.all(
      scheduleArray.map(async (element) => {
        const existSchedule = await ScheduleModel.find({
          start_time_hours: element.start_time_hours,
          start_time_minutes: element.start_time_minutes,
          end_time_hours: element.end_time_hours,
          end_time_minutes: element.end_time_minutes,
          weekday: element.weekday,
        });
        if (existSchedule) {
          const newSchedule = await ScheduleModel.create({
            start_time_hours: element.start_time_hours,
            start_time_minutes: element.start_time_minutes,
            end_time_hours: element.end_time_hours,
            end_time_minutes: element.end_time_minutes,
            weekday: element.weekday,
          });
          await UserScheduleModel.create({
            userId: existUser._id,
            scheduleId: newSchedule._id,
          });
        } else {
          await UserScheduleModel.create({
            userId: existUser._id,
            scheduleId: existSchedule._id,
          });
        }
      })
    );
  }

  const fullProfile = { ...updatedProfile._doc, roleArray, scheduleArray };
  res.send({ success: 1, data: fullProfile });
};

const getProfileById = async (req, res) => {
  const { profileId } = req.params;

  const profile = await ProfileModel.findById(profileId);

  if (!profile) {
    throw new HTTPError(400, "Not found profile");
  }

  const roleId = await UserRoleModel.find({ userId: profile.userId });
  const role = await Promise.all(
    roleId.map(async (id) => await RoleModel.findById(id.roleId))
  );
  const roleArray = role.map((r) => r._id);

  const scheduleId = await UserScheduleModel.find({ userId: profileId });
  const schedule = await Promise.all(
    scheduleId.map(async (id) => await ScheduleModel.findById(id.scheduleId))
  );
  const scheduleArray = JSON.parse(JSON.stringify(schedule));
  const fullProfile = { ...profile._doc, roleArray, scheduleArray };
  res.send({ success: 1, data: fullProfile });
};

const updateStatus = async (req, res) => {
  const senderUser = req.user;
  const { staffId, status } = req.params;

  const existStaff = await ProfileModel.findOne({ _id: staffId });
  if (!existStaff) {
    throw new HTTPError(400, "Not found staff");
  }

  await UserModel.findByIdAndUpdate(
    existStaff.userId,
    {
      status,
      modifyBy: senderUser._id,
    },
    { new: true }
  );

  const updatedStaff = await ProfileModel.findByIdAndUpdate(
    staffId,
    {
      status,
      modifyBy: senderUser._id,
    },
    { new: true }
  );

  res.send({ success: 1, data: updatedStaff });
};

const getNext = async () => {
  const count = await ProfileModel.find().count();
  if (count <= 1) return "NV_0000000001";

  const lastService = await ProfileModel.find({ _id: { $nin: ["admin"] } })
    .sort({ _id: -1 })
    .limit(1);
  const nextId = lastService[0]._id;
  const idNumber = parseInt(nextId.split("_")[1]) + 1 + "";
  var temp = "";
  for (let i = 0; i < 10 - idNumber.length; i++) {
    temp += "0";
  }
  temp += idNumber;
  return "NV_" + temp;
};

const generatePassword = () => {
  const hasNumber = /\d/;
  var test = false;
  var randomstring = "";
  while (!test) {
    randomstring = Math.random().toString(36).slice(-8);
    test = hasNumber.test(randomstring);
  }
  return randomstring;
};

const generateUsername = async (fullname) => {
  const temp = fullname.split(" ");
  var username = temp[temp.length - 1];
  for (var i = 0; i < temp.length - 1; i++) {
    username += temp[i].charAt(0);
  }
  username = username.toLowerCase();
  var count = 0;
  var tempUsername = username;
  while (true) {
    const existUser = await UserModel.findOne({ username: tempUsername });
    if (existUser) {
      count++;
      tempUsername = username + count;
      continue;
    }
    return removeVietnameseTones(tempUsername);
  }
};

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  str = str.replace(/ + /g," ");
  str = str.trim();
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
  return str;
}

module.exports = {
  createAdmin,
  getProfile,
  createProfile,
  updateProfile,
  updateStatus,
  getProfileById,
  checkEmail,
  checkPhone,
  curProfile,
  getDoctor,
  getTechStaff,
};
