import { useState, useEffect } from "react";
import OTPInput from "../components/otp";
import { withStyles } from "@material-ui/styles";
import styles from "../jss/otp";

function OTP(props) {
  const { classes } = props;
  const [currentTime, setCurrentTime] = useState(30);
  const [expired, setExpired] = useState(false);
  const [email, setEmail] = useState("");

  function setTime() {
    setCurrentTime((prevTime) => {
      if (prevTime === 0) {
        setExpired(true);
      }
      return prevTime === 0 ? 0 : prevTime - 1;
    });
  }

  async function getRemainingTime() {
    let response = await fetch("http://localhost:9000/getOtpExpiryTime", {
      method: "POST",
      body: JSON.stringify({ email: email }),
    });
    let responseJson = await response.json();

    return responseJson.remainingTime;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime();
    }, 1000);
    if (currentTime === 0) {
      setExpired(false);
    }

    let time = getRemainingTime();
    setCurrentTime(time);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.parent}>
      <div className={classes.otpParent}>
        <i className={`fa-solid fa-fingerprint ${classes.logo}`}></i>
        <p className={classes.head}>Email Verification</p>
        <p className={classes.h3}>
          An OTP has been send to your registered gmail{" "}
        </p>
        <p className={classes.ins}>
          {expired
            ? ""
            : `Your OTP will Expire in ${Math.floor(currentTime / 60)}:
          ${currentTime % 60}`}
        </p>
        <OTPInput length={4} />
        <button className={`btn btn-light btn-lg ${classes.submit}`}>
          submit
        </button>
        <button className={`btn ${classes.reset}`}>Reset OTP</button>
        {expired ? <p className={classes.error}>OTP Expired</p> : ""}
      </div>
    </div>
  );
}

export default withStyles(styles)(OTP);
