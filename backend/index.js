const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bp = require("body-parser");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const { error } = require("console");
const fs = require("fs");

// models

const User = require("./model/user");
const OTP = require("./model/otp");

//controllers

const sendOtp = require("../backend/controller/otp");
const resetOtp = require("./controller/resetOtp");

app.use(express.json());

mongoose.connect(
  `mongodb+srv://saravana1:${process.env.mongopass}@cluster0.gdr7v46.mongodb.net/waywise?retryWrites=true&w=majority`
);

app.use(cors(["http://localhost:3000"]));

// Static files serving middleware
app.use(express.static(path.join(__dirname, "../", "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "client", "build", "index.html"));
});

app.post("/register", async (req, res) => {
  let userCheck = await User.find({ email: req.body.email });
  if (userCheck.length >= 1) {
    res.status(400).send({ message: "User Already Exists" });
  } else {
    try {
      const encryptedPass = await bcrypt.hash(req.body.pass, 10);
      const user = new User({
        email: req.body.email,
        password: encryptedPass,
        verified: false,
      });
      user.save();
      sendOtp(req.body.email);
      res.status(200).send({ message: "OTP Sent Successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "Incorrect Password" });
    }
  }
});

app.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    let userVerify = await bcrypt.compare(req.body.pass, user.password);
    if (userVerify) {
      if (user.verified) {
      } else {
        await sendOtp(req.body.email);
      }
    } else {
      res.status(500).send({ message: "Incorrect Password" });
    }
  } else {
    res.status(500).send({ message: "User Does Not Exists" });
  }
});

app.post("/getOtpExpiryTime", async (req, res) => {
  try {
    const otp = await OTP.findOne({ email: req.body.email });

    if (!otp) {
      return res.status(404).send({ message: "OTP not found" });
    }

    const currentTime = new Date();
    const createdAt = new Date(otp.createdAt);
    const expiryTime = otp.expiryTime;

    const elapsedTime = currentTime - createdAt;
    const remainingTime = String(expiryTime - elapsedTime);

    if (remainingTime <= 0) {
      return res.status(200).send({ message: "OTP has expired" });
    }

    return res.status(200).send({ message: remainingTime });
  } catch (error) {
    console.error("Error while calculating OTP expiry time:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

app.post("/resetOtp", async (req, res) => {
  await sendOtp(req.body.email);
  res.status(200).send({ message: "OTP has been reset Successfully" });
});

app.post("/verifyotp", async (req, res) => {
  let mail = req.body.mail;
  let otp = await OTP.findOne({ email: mail });
  if (Number(req.body.submittedOtp) === otp["otp"]) {
    await User.findByIdAndUpdate({ email: mail }, { verified: true });
    res.status(200).send();
  } else {
    res.status(300).send({ message: "Invalid OTP try again" });
  }
});

app.post("/getPath", async (req, res) => {
  const paths = [];
  const source = req.body.sourceCoordinates;
  let relation;
  fs.readFile(
    path.join(__dirname, "../", "data", "network", "relationsData.json"),
    "utf8",
    (err, data) => {
      relation = data;
      data["elements"]["members"];
      res.sendStatus(200);
    }
  );
});

app.listen(9000, () => {
  console.log("server running");
});
