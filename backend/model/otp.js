const mongoose = require("mongoose");

const otpSchema = {
  email: {
    type: String,
    unique: true,
  },
  otp: Number,
};

module.exports = mongoose.model("OTP", otpSchema);
