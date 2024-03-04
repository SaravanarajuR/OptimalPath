let Otp = require("../model/otp");
let resetOtp = require("../controller/resetOtp");
const nodemailer = require("nodemailer");

function sendOtp(mail) {
  console.log(`from send otp ${mail}`);
  const createdOtp = Math.floor(1000 + Math.random() * 9999);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.mail,
      pass: process.env.mailpass,
    },
  });

  let info = transporter.sendMail({
    from: "FindIt@gmail.com",
    to: mail,
    subject: "FindIt Registration",
    html: `<h1> ${createdOtp} is your OTP for registering</h1><h4>Please do not share</h4>`,
  });

  Otp.find({
    mail: mail,
  }).then((foundOtp) => {
    if (foundOtp.length === 0) {
      const ver = new Otp({
        mail: mail,
        otp: createdOtp,
        created: Date.now(),
      });
      ver.save();
      return true;
    } else {
      resetOtp(mail, createdOtp);
    }
  });
}

module.exports = sendOtp;
