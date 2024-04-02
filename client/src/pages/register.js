import { withStyles } from "@material-ui/styles";
import styles from "../jss/register";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Register(props) {
  const { classes } = props;

  const navigate = useNavigate();

  const [password, setPassword] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errorView, seterrorView] = useState(false);
  const [successView, setsuccessView] = useState(false);

  useEffect(() => {
    let interval = setTimeout(() => {
      seterrorView(0);
      setError("");
    }, 3000);
    return () => clearTimeout(interval);
  }, [error]);

  useEffect(() => {
    let interval = setTimeout(() => {
      setsuccessView(0);
      setSuccess("");
    }, 3000);
    return () => clearTimeout(interval);
  }, [success]);

  function handleInput(evt) {
    evt.preventDefault();
    setPassword(!password);
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const email = evt.target[0].value;
    const pass = evt.target[1].value;
    const confirmPassword = evt.target[2].value;
    console.log(email);
    console.log(pass);
    if (pass === confirmPassword) {
      if (pass.length >= 8) {
        try {
          window.sessionStorage.setItem("email", email);
          let res = await fetch("http://localhost:9000/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              pass: pass,
            }),
          });
          const responseJson = await res.json();
          if (res.status === 200) {
            console.log("success");
            setSuccess("Registration Successfull");
            setsuccessView(1);
            setTimeout(() => {
              navigate("/login/verifyUser", {
                state: {
                  email: responseJson.email,
                },
              });
            }, 2000);
          } else {
            throw responseJson.message;
          }
        } catch (error) {
          setError(error);
          seterrorView(1);
        }
      } else {
        setError("Password Must be 8 Characters or High");
        seterrorView(1);
      }
    } else {
      setError("Password do not match");
      seterrorView(1);
    }
  }

  return (
    <div className={classes.parent}>
      <div className={classes.imageDiv}></div>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.innerForm}>
          <p className={classes.heading}>Join Us Today!</p>
          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${classes.input}`}
              id="floatingInput email"
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className={classes.merge}>
            <label htmlFor="password" className={classes.passLabel}>
              Password
            </label>
            <input
              className={classes.pass}
              id="password"
              type={password ? "password" : "text"}
            />
            <div className={classes.viewValue} onClick={handleInput}>
              <i className="fa-solid fa-eye"></i>
            </div>
          </div>
          <div className={classes.merge}>
            <label for="password" className={classes.passLabel}>
              Confirm Password
            </label>
            <input
              className={classes.pass}
              id="confirm-password"
              type={password ? "password" : "text"}
            />
            <div className={classes.viewValue} onClick={handleInput}>
              <i className="fa-solid fa-eye"></i>
            </div>
          </div>
          <button className={`btn ${classes.button}`} disabled={errorView}>
            Register
          </button>
          <a className={classes.option} href="/login">
            Sign In Instead
          </a>
        </div>
      </form>
      {errorView ? (
        <p className={`${classes.error} ${classes.message}`}>{error}</p>
      ) : (
        ""
      )}
      {successView ? (
        <p className={`${classes.success} ${classes.message}`}>{success}</p>
      ) : (
        ""
      )}
    </div>
  );
}

export default withStyles(styles)(Register);
