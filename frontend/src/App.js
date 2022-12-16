import Navbarr from "./components/navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
  Navigate,
} from "react-router-dom";
import ReactDOM from 'react-dom';
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
import Clinic from "./pages/Clinic/Clinic";
import axios from "../src/apis/api";
import React from "react";
import Staff from "./pages/Staff/Staff";
import MedicalPaper from "./pages/MedicalPaper/ListMedicalPaper"
import Decentralization from "./pages/decentralization/Decentralization";
import Receptionist from "./pages/Receptionist/Receptionist";
import Pdf from "./components/exportPdf";
import DashBoard from "./pages/dashBoard/dashBoard";
import MedicalPaper from "./pages/MedicalPaper/ListMedicalPaper";

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
        <Router>
          {userInfo.data ? <Navbarr user={userInfo.data} /> : <></>}
          <Routes>
            <Route element={<GuestRoute user={userInfo.data} />}>
              <Route path="/Login" element={<Login />} />
              <Route path="/Forgotpassword" element={<Forgotpassword />} />
            </Route>

            <Route element={<PrivateRoute user={userInfo.data} />}>
              <Route path="/DashBoard" element={<DashBoard />} />
              <Route path="/Decentralization" element={<Decentralization />} />
              <Route path="/clinic" element={<Clinic />} />
              <Route path="/ChangePassword" element={<Changepassword />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Medicine" element={<Medicine />}></Route>
              <Route path="/Service" element={<Service />}></Route>
              <Route path="/Customer" element={<Customer />}></Route>
              <Route path="/Receptionist" element={<Receptionist />}></Route>
              <Route path="/Invoice" element={<Pdf />}></Route>
              <Route
                path="/Staff"
                element={<Staff user={userInfo.data} />}
              ></Route>
              <Route
                path="/MedicalPaper"
                element={<MedicalPaper user={userInfo.data} />}
              ></Route>
            </Route>
          </Routes>
        </Router>
      </AuthContext.Provider>
    </>
  );
}

export default App;
