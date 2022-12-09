const UserModel = require('./user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HTTPError = require('../../common/httpError');
const sendEmail = require('../../common/sendEmail');
const ProfileModel = require('../profile/profile');

const generatePassword = () => {
    const hasNumber = /\d/;
    var test = false;
    var randomstring = '';
    while (!test) {
        randomstring = Math.random().toString(36).slice(-8);
        test = hasNumber.test(randomstring); 
    }
    return randomstring;
}

// const generateUsername = async (fullname) => {
//     const temp = fullname.split(' ');
//     var username = temp[temp.length - 1];
//     for (var i = 0; i < temp.length - 1; i++) {
//         username += temp[i].charAt(0);
//     }
//     username = username.toLowerCase();
//     var count = 0;
//     var tempUsername = username;
//     while (true) {
//         const existUser = await UserModel.findOne({ username: tempUsername });
//         if (existUser) {
//             count++;
//             tempUsername = username + count;
//             continue;
//         }
//         return tempUsername;
//     }
// }

// const register = async (req, res) => {
//     const email = "namnguyenluk@gmail.com";
//     const password = generatePassword();
//     const username = await generateUsername("Nguyen Van A");
//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(password, salt);

//     // const newUser = await UserModel.create({
//     //     username,
//     //     password: hashPassword
//     // });

//     await sendEmail(
//         email, 
//         '[DCManagement] Tài khoản và mật khẩu của bạn', 
//         `<h3>Chào mừng bạn đến với Dentail Clinic Management!</h3> <p>Tài khoản của bạn là ${username}</p> <p>Mật khẩu của bạn là ${password}</p>`
//     );
    
//     res.send("OK");
// }

const forgotPassword = async(req, res) => {
    const {email} = req.body;
    const existUser = await ProfileModel.findOne({email: email});

    if(!existUser){
        throw new HTTPError(400, 'Do not have this user');
    }

    const userId = existUser.userId;
    const password = generatePassword();
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const updatedUser = await UserModel.findByIdAndUpdate(userId, {password: hashPassword});

    await sendEmail(
        email, 
        '[DCManagement] Mật khẩu mới của bạn', 
        `<h3>Chào mừng bạn đến với Dentail Clinic Management!</h3> </p> <p>Mật khẩu mới của bạn là ${password}</p>`
    );

    res.send({
        success: 1, data: {
            _id: userId,
        }
    });
}

const login = async (req, res) => {
    const { username, password } = req.body;
    const existUser = await UserModel.findOne({
        username,
    });

    if (!existUser) {
        throw new HTTPError(400, 'Username or Password incorrect');
    }

    const matchPassword = await bcrypt.compare(password, existUser.password);

    if (!matchPassword) {
        throw new HTTPError(400, 'Username or Password incorrect');
    }

    if (existUser.status == false) {
        throw new HTTPError(400, 'Tài khoản của bạn đã hết hạn');
    }

    const userId = existUser._id;
    const token = jwt.sign({
        userId,
    }, process.env.SECRET_KEY, {
        expiresIn: 60 * 60
    })

    res.send({
        success: 1, data: {
            _id: userId,
            token
        }
    });
}

const changePassword = async (req, res) => {
    const senderUser = req.user;
    const {password, newPassword} = req.body;

    const existUser = await UserModel.findById(senderUser._id);
    if (!existUser) {
        throw new HTTPError(400, 'Bạn k có quyền');
    }

    const matchPassword = await bcrypt.compare(password, existUser.password);

    if (!matchPassword) {
        throw new HTTPError(400, 'Username or Password incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await UserModel.findByIdAndUpdate(existUser._id, {password: hashPassword});

    res.send({
        success: 1, data: {
            _id: existUser._id,
        }
    });
}

const verify = async (req, res) => {
    const { user } = req;

    res.send({ success: 1, data: user });
};

module.exports = {
    //register,
    login,
    verify,
    forgotPassword,
}
