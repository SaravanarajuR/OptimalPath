import { useState, useEffect } from "react";
import OTPInput from "../components/otp";
import { withStyles } from "@material-ui/styles";
import styles from "../jss/otp";
import { useNavigate } from "react-router-dom";

function OTP(props) {
  const { classes } = props;
  const [currentTime, setCurrentTime] = useState(30);
  const [expired, setExpired] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState(window.sessionStorage.getItem("email"));
  const navigate = useNavigate();

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

  useEffect(() => {
    let timeout = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return clearTimeout(timeout);
  }, [success]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setError("");
    }, 3000);

    return clearTimeout(timeout);
  }, [error]);

  function setTime() {
    setCurrentTime((prevTime) => {
      if (prevTime === 0) {
        setExpired(true);
      }
      return prevTime === 0 ? 0 : prevTime - 1;
    });
  }

  async function handleOtpReset() {
    let res = await fetch("http://localhost:9000/resetOtp", {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      setSuccess("OTP Reset Successfull");
    }
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    let res = await fetch("http://localhost:9000/verifyotp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: email,
        submittedOtp:
          evt.target[0].value +
          evt.target[1].value +
          evt.target[2].value +
          evt.target[3].value,
      }),
    });
    if (res.status === 200) {
      setSuccess("Verified Successfully, You'll be redirected Automatically");
    } else {
      let response = await res.json();
      setError(response.message);
    }
  }

  async function getRemainingTime() {
    let response = await fetch("http://localhost:9000/getOtpExpiryTime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    let responseJson = await response.json();

    return responseJson.remainingTime;
  }

  return (
    <div className={classes.parent}>
      <form className={classes.otpParent} onSubmit={handleSubmit}>
        <i className={`fa-solid fa-fingerprint ${classes.logo}`}></i>
        <p className={classes.head}>Email Verification</p>
        <p className={classes.h3}>An OTP has been send to {email}</p>
        <p className={classes.ins}>
          {expired
            ? ""
            : `Your OTP will Expire in ${Math.floor(currentTime / 60)}:
          ${currentTime % 60}`}
        </p>
        <OTPInput length={4} />
        <button
          className={`btn btn-light btn-lg ${classes.submit}`}
          type="submit"
          disabled={success !== "" || error !== ""}
        >
          submit
        </button>
        <button
          className={`btn ${classes.reset}`}
          onClick={handleOtpReset}
          disabled={success !== "" || error !== ""}
        >
          Reset OTP
        </button>
      </form>
      {success !== "" ? (
        <p className={`${classes.success} ${classes.message}`}>{success}</p>
      ) : (
        ""
      )}
      {error !== "" ? (
        <p className={`${classes.error} ${classes.message}`}>{error}</p>
      ) : (
        ""
      )}
    </div>
  );
}

export default withStyles(styles)(OTP);
