import Navbarr from "./components/navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login_UI/login";
import Medicine from "./pages/Medicine/Medicine";
import { useSelector } from "react-redux";
import "./components/css/App.scss";
import LoadingComponent from "./components/loadingComponent";
import UpdateMedicineModal from "./pages/Medicine/UpdateMedicineModal";
import Test from "./components/test";
import Service from "./pages/Services/Service";
import Profile from "./pages/profile/profile";
import Changepassword from "./pages/profile/changpassword";
import Forgotpassword from "./pages/login_UI/forgotpassword";
import Customer from "./pages/customer/listCustomer";
import PrivateRoute from "./components/Route/PrivateRoute";
import GuestRoute from "./components/Route/GuestRoute";
import axios from "../src/apis/api";
import React from "react";
import Staff from "./pages/Staff/Staff";

import Editstaff from "./pages/Staff/EditStaff";

import ListMedicalPaper from "./pages/MedicalPaper/ListMedicalPaper";

export const AuthContext = React.createContext();
function App() {
  const isLoading = useSelector((state) => state.loading);
  const [userInfo, setUserInfo] = React.useState({
    status: "idle",
    data: null,
  });
  const verifyUserInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserInfo({ status: "success", data: null });
      return;
    }

    try {
      const res = await axios.get("/api/auth/verify");
      if (res.success) {
        setUserInfo({ status: "success", data: res.data });
      } else {
        setUserInfo({ status: "success", data: null });
      }
    } catch (err) {
      setUserInfo({ status: "success", data: null });
    }
  };

  const login = ({ username, _id, token }) => {
    localStorage.setItem("token", token);
    setUserInfo({ status: "success", data: { username, _id } });
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUserInfo({ status: "success", data: null });
  };

  React.useEffect(() => {
    verifyUserInfo();
  }, []);

  if (userInfo.status === "idle" || userInfo.status === "loading")
    return <div>Loading...</div>;

  if (userInfo.status === "error") return <div>Error</div>;

  return (
    <>
      <AuthContext.Provider value={{ user: userInfo.data, login, logout }}>
        {/* <LoadingComponent isLoading={isLoading} /> */}
        <Router>
          {userInfo.data ? <Navbarr /> : <></>}

          <Routes>
            <Route element={<GuestRoute user={userInfo.data} />}>
              <Route path="/Login" element={<Login />} />
              <Route path="/Forgotpassword" element={<Forgotpassword />} />
            </Route>

            <Route element={<PrivateRoute user={userInfo.data} />}>
              <Route path="/medicine" element={<Medicine />}></Route>
              <Route path="/ChangePassword" element={<Changepassword />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Editstaff" element={<Editstaff />} />
              <Route path="/medicine" element={<Medicine />}></Route>
              {/* <Route path="/service" element={<Service />}></Route> */}
              <Route path="/Customer" element={<Customer />}></Route>
              <Route path="/Staff" element={<Staff />}></Route>
              <Route
                path="/MedicalPaper"
                element={<ListMedicalPaper />}
              ></Route>
            </Route>
          </Routes>
        </Router>
      </AuthContext.Provider>
    </>
  );
}

export default App;
