import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SignIn from "./newComponents/loginSection/SignIn.jsx";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");  // use "token", not "accessToken"
    if (token && location.pathname !== "/dashboard") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, location]);

  return (
    <div>
      <SignIn />
    </div>
  );
};

export default App;
