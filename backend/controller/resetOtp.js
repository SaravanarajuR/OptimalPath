const express = require("express");
const Otp = require("../model/otp");

const changeOtp = function resetOtp(gmail, otp) {
  Otp.findOneAndUpdate(
    {
      mail: gmail,
    },
    {
      otp: otp,
    }
  ).then((f) => {});
};

module.exports = { changeOtp };
