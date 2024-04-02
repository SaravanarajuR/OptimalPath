import React, { useState, useRef } from "react";
import { withStyles } from "@material-ui/styles";
import styles from "../jss/otp";

function OTPInput(props) {
  const { classes } = props;
  const [otp, setOTP] = useState(Array(props.length).fill(""));
  const [valueInside, setValueInside] = useState(
    Array(props.length).fill(false)
  );
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    const newOTP = [...otp];
    let setChange = valueInside;
    setChange[index] = !setChange[index];
    newOTP[index] = value;
    setOTP(newOTP);
    setValueInside(setChange);

    if (value !== "" && index < props.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className={classes.otpInputParent}>
      {otp.map((digit, index) => (
        <input
          className={`${classes.otpInput} ${
            valueInside[index] ? classes.hasValue : classes.empty
          }`}
          key={index}
          type="text"
          maxLength={1}
          pattern="[0-9]*" // Accept only numbers
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(el) => (inputRefs.current[index] = el)}
        />
      ))}
    </div>
  );
}

export default withStyles(styles)(OTPInput);
