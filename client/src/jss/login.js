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
    borderRadius: "20px 0 0 20px",
    display: "flex",
    backgroundImage: `url(${image})`,
    alignItems: "center",
    backgroundRepeat: "no-repeat",
    justifyContent: "center",
    "@media(max-width:800px)": {
      display: "none",
    },
  },
  innerForm: {
    width: "70%",
    height: "80%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    "@media(max-height:500px)": {
      width: "98%",
      height: "98%",
    },
    "@media(max-width:600px)": {
      width: "90%",
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
    marginTop: "3%",
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
  merge: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    maxHeight: "160px",
    height: "14%",
    flexShrink: 0,
    width: "100%",
    "@media(max-width:800px)": {
      width: "100%",
      borderRadius: "5px",
    },
    "@media(max-height:600px)": {
      height: "11%",
    },
  },
  passLabel: {
    position: "absolute",
    left: "12px",
    top: "5px",
    color: "rgba(0,0,0,0.5)",
    fontSize: "13.3px",
  },
  label: {
    backgroundColor: "rgba(250,250,250,0.6)",
    height: "100%",
    fontWeight: "800",
    textAlign: "right",
    fontFamily: "Georgia, serif",
    width: "30%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px 20px",
    fontSize: "0.9rem",
    borderRadius: "10px 0 0 10px",
    "@media(max-width:800px)": {
      display: "none",
      borderRadius: "5px 0 0 5px",
    },
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
