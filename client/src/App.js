import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import OTP from "./pages/otp";
import Register from "./pages/register";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login/verifyUser" element={<OTP />} />
          <Route exact path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
