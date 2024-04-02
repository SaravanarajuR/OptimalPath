const styles = {
  parent: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(88,57,39,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ins: {
    fontSize: "1.2rem",
    fontFamily: "aerial",
    margin: "0",
  },
  otpParent: {
    borderRadius: "20px",
    width: "50%",
    height: "85%",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    "@media(max-width:800px)": {
      width: "80%",
    },
    "@media(max-width:450px)": {
      width: "98%",
    },
  },

  otpInputParent: {
    height: "20%",
    width: "100%",
    gap: "2%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  otpInput: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "700",
    width: "10%",
    borderRadius: "20px",
    fontSize: "1.3rem",
    height: "70%",
    "&:focus": {
      backgroundColor: "#333333",
      color: "white",
      outline: "none",
    },
    "@media(max-width:1000px)": {
      width: "20%",
    },
  },
  head: {
    fontFamily: "aerial",
    fontSize: "1.4rem",
    margin: 0,
  },
  hasValue: {
    backgroundColor: "white",
  },
  empty: {
    backgroundColor: "grey",
  },
  reset: {
    alignSelf: "flex-end",
    marginRight: "5%",
    color: "rgba(88,57,39,0.8)",
    fontWeight: "700",
    backgroundColor: "#fff",
  },
  logo: {
    fontSize: "5rem",
    marginBottom: "10px",
  },
  submit: {
    color: "rgba(88,57,39,0.8)",
    fontWeight: "700",
  },
  h3: {
    fontSize: "15px",
    fontFamily: "aerial",
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

export default styles;
