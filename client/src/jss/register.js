import image from "../images/map.jpg";

const style = {
  parent: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(88,57,39,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageDiv: {
    width: "38%",
    backgroundSize: "cover",
    height: "65%",
    display: "flex",
    backgroundImage: `url(${image})`,
    alignItems: "center",
    backgroundRepeat: "no-repeat",
    justifyContent: "center",
    borderRadius: "20px 0 0 20px",
    "@media(max-width:800px)": {
      display: "none",
    },
  },
  innerForm: {
    width: "70%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: "0 20px 20px 0",
    "@media(max-width:600px)": {
      width: "90%",
    },
  },
  passLabel: {
    position: "absolute",
    left: "12px",
    top: "5px",
    color: "rgba(0,0,0,0.5)",
    fontSize: "13.3px",
  },
  merge: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    maxHeight: "160px",
    height: "10%",
    marginBottom: "3%",
    flexShrink: 0,
    width: "100%",
    "@media(max-width:800px)": {
      width: "100%",
      borderRadius: "5px",
      height: "9%",
    },
    "@media(max-height:600px)": {
      height: "10%",
    },
  },
  form: {
    width: "50%",
    height: "65%",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0 20px 20px 0",
    "@media(max-width:800px)": {
      width: "80%",
      height: "80%",
      borderRadius: "20px",
    },
    "@media(max-width:600px)": {
      width: "90%",
      height: "80%",
      borderRadius: "20px",
    },
    "@media(max-height:500px)": {
      width: "98%",
      height: "98%",
    },
  },
  input: {
    flexShrink: 0,
    width: "100%",
    height: "10%",
  },
  button: {
    width: "40%",
    height: "10%",
    backgroundColor: "white",
    alignSelf: "center",
    "&:hover": {
      backgroundColor: "#BEBEBE",
    },
    "&:active": {
      backgroundColor: "#BEBEBE",
      color: "white",
    },
    "&:active:after": {
      backgroundColor: "#BEBEBE",
    },
    "@media(max-width:600px)": {
      height: "8%",
    },
  },
  option: {
    color: "white",
    alignSelf: "flex-end",
    margin: "10px 0",
  },
  heading: {
    color: "white",
    alignSelf: "center",
    fontSize: "1.8rem",
    fontFamily: "aerial",
    fontWeight: "700",
  },
  completePassword: {
    width: "100%",
    display: "flex",
    height: "10%",
    margin: "0",
  },
  eye: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "10%",
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: "0 10px 10px 0",
    height: "100%",
    fontSize: "1.7rem",
    margin: "0",
    "&:hover": {
      backgroundColor: "black",
      color: "#fff",
    },
  },
  passInput: {
    height: "100%",
    width: "100%",
  },
  viewValue: {
    height: "100%",
    width: "10%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: "0 10px 10px 0",
    "&:hover": {
      backgroundColor: "black",
      color: "#fff",
    },
  },
  pass: {
    width: "90%",
    padding: "10px 0 0 10px",
    maxHeight: "150px",
    borderRadius: "7px 0 0 7px",
    fontSize: "13px",
    border: "none",
    "&:focus": {
      outline: "none",
    },
  },
  message: {
    padding: "10px",
    position: "absolute",
    top: "10px",
    right: "10px",
    color: "white",
    fontSize: "1.2rem",
    fontFamily: "aerial",
  },
  error: {
    backgroundColor: "rgba(237,67,55)",
  },
  success: {
    backgroundColor: "rgba(0,200,0,0.5)",
  },
};

export default style;
