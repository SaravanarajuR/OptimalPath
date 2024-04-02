const express = require("express");
const Otp = require("../model/otp");

function resetOtp(gmail, otp) {
  Otp.findOneAndUpdate(
    {
      email: gmail,
    },
    {
      otp: otp,
    }
  ).then((f) => {});
  return;
}

module.exports = resetOtp;
