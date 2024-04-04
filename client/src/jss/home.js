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
    width: "98%",
    height: "98%",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  form: {
    width: "30%",
    position: "absolute",
    left: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    top: "10px",
    borderRadius: "20px",
    zIndex: "1000",
    "@media(max-width:900px)": {
      width: "60%",
    },
  },
  input: {
    width: "100%",
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
    borderRadius: "10px",
    padding: "15px",
    height: "5%",
    border: "1px solid #BEBEBE",
    "&:focus": {
      outline: "1px solid green",
    },
  },
  recommendations: {
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
    cursor: "pointer",
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
  selectedArea: {
    height: "100%",
    zIndex: "999",
  },
};

export default styles;
