const nodemailer = require('nodemailer');
//const { options } = require('../routes/tourRoutes');
const sendEmail = async (options) => {
  //1- create transportr
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //Activate in gmail "less secure app" options
  });
  //2- define the email options
  const mailOptions = {
    from: 'Ramratan Jakhar <ramratan@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3- actually send the mail
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
