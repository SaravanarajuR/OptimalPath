const styles = {
  App: {
    textAlign: "center",
  },
  "leaflet-container": {
    height: "100%",
    width: "100%",
  },
  parent: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(88,57,39,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  form: {
    width: "30%",
    position: "absolute",
    left: "20px",
    height: "auto",
    display: "flex",
    maxHeight: "90%",
    flexDirection: "column",
    gap: "5px",
    top: "10px",
    borderRadius: "20px",
    zIndex: "1000",
    "@media(max-width:900px)": {
      width: "60%",
      height: "90%",
    },
  },
  input: {
    width: "100%",
    boxShadow: "rgba(99, 99, 99, 0.2) 15px 15px 15px 0px;",
    borderRadius: "10px",
    padding: "15px",
    height: "5%",
    minHeight: "50px",
    border: "1px solid #BEBEBE",
    "&:focus": {
      outline: "1px solid green",
    },
  },
  recommendations: {
    backgroundColor: "white",
    top: "17%",
    borderRadius: "15px",
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
    cursor: "pointer",
    height: "auto",
    overflowY: "auto",
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(255,255,255,0.5)",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar": {
      backgroundColor: "black",
      borderRadius: "10px",
      width: "10px",
    },
  },
  node: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    padding: "10px 10px 10px 20px",
    display: "flex",
    gap: "20px",
    cursor: "pointer",
    fontWeight: "700",
    "&:hover": {
      backgroundColor: "#BEBEBE",
    },
  },
  location: {
    height: "100%",
    margin: "auto 0",
    cursor: "pointer",
  },
  popupDiv: {
    display: "flex",
    gap: "10px",
  },
  submit: {
    position: "absolute",
    left: "2%",
    bottom: "2%",
    zIndex: "1001",
    width: "150px",
  },
};

export default styles;
