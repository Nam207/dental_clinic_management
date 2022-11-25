const nodemailer = require('nodemailer');
const { google } = require("googleapis");
// const OAuth2Client = google.auth.OAuth2;
//const { OAuth2Client } = require('google-auth-library');

// const myOAuth2Client = new OAuth2Client(
//     process.env.GOOGLE_MAILER_CLIENT_ID,
//     process.env.GOOGLE_MAILER_CLIENT_SECRET,
//     "https://developers.google.com/oauthplayground"
// )

// myOAuth2Client.setCredentials({
//     refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN
// })

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_ADMIN_PASSWORD
    }
});

const sendEmail = async (email, subject, text) => {
    // const myAccessTokenObject = await myOAuth2Client.getAccessToken();

    // console.log(myAccessTokenObject.token);

    // const transport = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         type: 'OAuth2',
    //         user: process.env.EMAIL_ADMIN,
    //         clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
    //         clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
    //         refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
    //         accessToken: myAccessTokenObject.token,
    //     }
    // })

    const mailOptions = {
        from: process.env.EMAIL_ADMIN,
        to: email,
        subject: subject, // Tiêu đề email
        html: `${text}` // Nội dung email
    }

    await transporter.sendMail(mailOptions,(err,res)=>{
        if(err){
            console.log(err);
        }
        else {
            console.log('The email was sent successfully');
        }
    });
}

module.exports = sendEmail;