let Otp = require("../model/otp");
const nodemailer = require("nodemailer");

async function sendOtp(mail) {
  const resetOtp = require("../controller/resetOtp");
  const createdOtp = Math.floor(1000 + Math.random() * 9999);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.mail,
      pass: process.env.mailpass,
    },
  });

  let info = await transporter.sendMail({
    from: process.env.mail,
    to: mail,
    subject: "WayWise Registration",
    html: `<img src="https://images.pexels.com/photos/21014/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" width=500px height=300px/><h3> ${createdOtp} is your OTP for registering in Way Wise</h3><h5>Find Your Optimal path to travel</h5><h5>Have a Safe Ride</h5><h5>Please do not share</h5>`,
  });

  let foundOtp = await Otp.find({
    email: mail,
  });
  if (foundOtp.length === 0) {
    const ver = new Otp({
      email: mail,
      otp: createdOtp,
      created: Date.now(),
    });
    ver.save();
    return;
  } else {
    await resetOtp(mail, createdOtp);
    return;
  }
}

module.exports = sendOtp;
