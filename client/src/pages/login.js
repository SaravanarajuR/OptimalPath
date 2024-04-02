import { withStyles } from "@material-ui/styles";
import styles from "../jss/login";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const { classes } = props;

  const [password, setPassword] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errorView, seterrorView] = useState(false);
  const [successView, setsuccessView] = useState(false);

  const navigate = useNavigate();

  function handleInput(evt) {
    evt.preventDefault();
    setPassword(!password);
  }

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

  async function handleSubmit(evt) {
    evt.preventDefault();
    let email = evt.target[0].value;
    let pass = evt.target[1].value;
    let res = await fetch("http://localhost:9000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        pass: pass,
      }),
    });
    let response = await res.json();
    if (res.status === 200) {
      window.sessionStorage.setItem("email", email);
      navigate("/login/verifyUser", {
        state: {
          email: response.email,
        },
      });
    } else {
      setError(response.message);
      seterrorView(1);
    }
  }

  return (
    <div className={classes.parent}>
      <div className={classes.imageDiv}></div>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.innerForm}>
          <p className={classes.heading}>Welcome Back!</p>
          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${classes.input}`}
              id="floatingInput"
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className={classes.merge}>
            <label htmlFor="password" className={classes.passLabel}>
              Password
            </label>
            <input
              className={classes.pass}
              type={password ? "password" : "text"}
            />
            <div className={classes.viewValue} onClick={handleInput}>
              <i className="fa-solid fa-eye"></i>
            </div>
          </div>
          <button className={`btn ${classes.button}`}>Sign In</button>
          <a className={classes.option} href="/register">
            Register Instead
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

export default withStyles(styles)(Login);
