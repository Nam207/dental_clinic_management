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

  let fullProfile=[];
  await Promise.all(
    profile.map(async (element) => {
      const roleid = await UserRoleModel.find({ userId: element.userId });
      const role = await RoleModel.find({
        _id: {
          "$in": roleid.map((el) => {
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
    validate,
  } = req.body;
  console.log(req.body);
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
      scheduleArray.forEach(async (element) => {
        const temp = JSON.parse(element);

        const existSchedule = await ScheduleModel.find({
          start_time_hours: temp.start_time_hours,
          start_time_minutes: temp.start_time_minutes,
          start_time_session: temp.start_time_session,
          end_time_hours: temp.end_time_hours,
          end_time_minutes: temp.end_time_minutes,
          end_time_session: temp.end_time_session,
          weekday: temp.weekday,
        });

        if (!existSchedule) {
          const newSchedule = await ScheduleModel.create({
            start_time_hours: temp.start_time_hours,
            start_time_minutes: temp.start_time_minutes,
            start_time_session: temp.start_time_session,
            end_time_hours: temp.end_time_hours,
            end_time_minutes: temp.end_time_minutes,
            end_time_session: temp.end_time_session,
            weekday: temp.weekday,
          });

          await UserScheduleModel.create({
            userId: _id,
            scheduleId: newSchedule[0]._id,
          });
        } else {
          await UserScheduleModel.create({
            userId: _id,
            scheduleId: existSchedule[0].medicineId,
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
    address,
    workingDays,
    salary,
    status,
    schedule,
  } = req.body;
  const existUser = await ServiceModel.findOne({ _id: staffId });
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
          userId: newUser._id,
          roleId: element,
        });
      })
    );
  }

  await UserScheduleModel.deleteMany({ userId: staffId });
  var scheduleArray;
  if (schedule != null) {
    scheduleArray = JSON.parse(JSON.stringify(schedule));
    scheduleArray.forEach(async (element) => {
      const temp = JSON.parse(element);

      const existSchedule = await ScheduleModel.find({
        start_time_hours: temp.start_time_hours,
        start_time_minutes: temp.start_time_minutes,
        start_time_session: temp.start_time_session,
        end_time_hours: temp.end_time_hours,
        end_time_minutes: temp.end_time_minutes,
        end_time_session: temp.end_time_session,
        weekday: temp.weekday,
      });

      if (!existSchedule) {
        const newSchedule = await ScheduleModel.create({
          start_time_hours: temp.start_time_hours,
          start_time_minutes: temp.start_time_minutes,
          start_time_session: temp.start_time_session,
          end_time_hours: temp.end_time_hours,
          end_time_minutes: temp.end_time_minutes,
          end_time_session: temp.end_time_session,
          weekday: temp.weekday,
        });

        await UserScheduleModel.create({
          userId: staffId,
          scheduleId: newSchedule[0]._id,
        });
      } else {
        await UserScheduleModel.create({
          userId: staffId,
          scheduleId: existSchedule[0].medicineId,
        });
      }
    });
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
  const role = roleId.map(async (id) => await RoleModel.findById(id));
  const roleArray = JSON.parse(JSON.stringify(role));

  const scheduleId = await UserScheduleModel.find({ userId: profileId });
  const schedule = scheduleId.map(
    async (id) => await ScheduleModel.findById(id)
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
  if (count <= 0) return "NV_0000000001";

  const lastService = await ProfileModel.find().sort({ _id: -1 }).limit(1);
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
    return tempUsername;
  }
};

module.exports = {
  createAdmin,
  getProfile,
  createProfile,
  updateProfile,
  updateStatus,
  getProfileById,
  checkEmail,
  checkPhone,
};
