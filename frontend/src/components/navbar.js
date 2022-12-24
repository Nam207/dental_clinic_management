import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.css";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "../../src/apis/api";
import React, { useState, useEffect, Component } from "react";

// import ModalD from "../Modal/Modal";

const Navbarr = ({ user }) => {
  const [tempStaff, setTempStaff] = useState(false);
  const [tempService, setTempService] = useState(false);
  const [tempMedicine, setTempMedicine] = useState(false);
  const [tempRoom, setTempRoom] = useState(false);
  const [tempDoctor, setTempDoctor] = useState(false);
  const [tempLT, setTempLT] = useState(false);
  const [tempKTV, setTempKTV] = useState(false);
  const logout = () => {
    localStorage.removeItem("token");
  };

  function findIndexByProperty(data, key, value) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][key] === value) {
        return i;
      }
    }
    return -1;
  }

  const [linkURL, setLinkUrl] = useState("");
  const getRole = () => {
    if (user.role[0].name === "Admin") {
      setTempDoctor(true);
      setTempLT(true);
      setTempKTV(true);
      return;
    }
    let countBs = 0;
    let countLT = 0;
    user.role.map((element) => {
      switch (element.name) {
        case "Bác sĩ":
          setTempDoctor(true);
          countBs++;
          break;
        case "Lễ tân":
          setTempLT(true);
          countLT++;
          break;
        case "Kỹ thuật viên":
          setTempKTV(true);
          break;
        default:
          break;
      }
    });
    if (countLT > 0) {
      setLinkUrl("/Receptionist");
      return;
    }
    if (countBs > 0) {
      setLinkUrl("/DashboardDoctor");
      return;
    }
    setLinkUrl("/DashBoardTech");
    return;
  };

  useEffect(() => {
    getPermission("Quản lý nhân viên");
    getPermissionService("Quản lý dịch vụ");
    getPermissionMedicine("Quản lý thuốc");
    getPermissionRoom("Quản lý phòng khám");
    getRole();
  }, [user]);

  const getPermissionRoom = async (functionName) => {
    if (user.role[0].name === "Admin") {
      setTempRoom(true);
      return;
    }
    const functionArray = await axios({
      url: `/api/function`,
      method: "get",
    });
    const index = findIndexByProperty(functionArray.data, "name", functionName);
    await Promise.all(
      user.role.map(async (element) => {
        const permission = await axios({
          url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
          method: "get",
        });
        if (permission.success === 0 || !permission.data) return;

        if (permission.data[0].view === true) {
          setTempRoom(true);
          return;
        }
      })
    );
  };

  const getPermissionMedicine = async (functionName) => {
    if (user.role[0].name === "Admin") {
      setTempMedicine(true);
      return;
    }
    const functionArray = await axios({
      url: `/api/function`,
      method: "get",
    });
    const index = findIndexByProperty(functionArray.data, "name", functionName);
    await Promise.all(
      user.role.map(async (element) => {
        const permission = await axios({
          url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
          method: "get",
        });
        if (permission.success === 0 || !permission.data) return;

        if (permission.data[0].view === true) {
          setTempMedicine(true);
          return;
        }
      })
    );
  };

  const getPermissionService = async (functionName) => {
    if (user.role[0].name === "Admin") {
      setTempService(true);
      return;
    }
    const functionArray = await axios({
      url: `/api/function`,
      method: "get",
    });
    const index = findIndexByProperty(functionArray.data, "name", functionName);
    await Promise.all(
      user.role.map(async (element) => {
        const permission = await axios({
          url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
          method: "get",
        });
        if (permission.success === 0 || !permission.data) return;

        if (permission.data[0].view === true) {
          setTempService(true);
          return;
        }
      })
    );
  };

  const getPermission = async (functionName) => {
    if (user.role[0].name === "Admin") {
      setTempStaff(true);
      return;
    }
    const functionArray = await axios({
      url: `/api/function`,
      method: "get",
    });
    const index = findIndexByProperty(functionArray.data, "name", functionName);
    await Promise.all(
      user.role.map(async (element) => {
        const permission = await axios({
          url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
          method: "get",
        });
        if (permission.success === 0 || !permission.data) return;

        if (permission.data[0].view === true) {
          setTempStaff(true);
          return;
        }
      })
    );
  };

  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <NavDropdown.Divider />
        {user.role[0].name === "Admin" ? (
          <Navbar.Brand href="/Dashboard" style={{fontSize:"28px"}}>Dental Clinic</Navbar.Brand>
        ) : (
          <Navbar.Brand href={linkURL}style={{fontSize:"25px"}} >Dental Clinic</Navbar.Brand>
        )}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Danh sách" style={{fontSize:"20px"}} id="basic-nav-dropdown">
              {tempLT === true ? (
                <NavDropdown.Item href="/Receptionist" style={{fontSize:"20px"}}>
                  Danh sách tái khám
                </NavDropdown.Item>
              ) : null}

              {tempDoctor === true ? (
                <NavDropdown.Item href="/DashboardDoctor" style={{fontSize:"20px"}} >
                  Danh sách khách hàng chờ khám
                </NavDropdown.Item>
              ) : null}

              {tempKTV === true ? (
                <NavDropdown.Item href="/DashBoardTech" style={{fontSize:"20px"}}>
                  Danh sách khách hàng chờ thực hiện thủ thuật
                </NavDropdown.Item>
              ) : null}
            </NavDropdown>

            <Nav.Link href="/MedicalPaper"style={{fontSize:"20px"}}>Phiếu khám</Nav.Link>
            <Nav.Link href="/Customer"style={{fontSize:"20px"}}>Khách hàng</Nav.Link>
            {user.role[0].name === "Admin" ? (
              <Nav.Link href="/Statistical"style={{fontSize:"20px"}}>Thống kê</Nav.Link>
            ) : null}

            <NavDropdown title="Thiết lập" id="basic-nav-dropdown" style={{fontSize:"20px"}}>
              {tempMedicine === true ? (
                <NavDropdown.Item href="/medicine" style={{fontSize:"20px"}}>
                  Quản lý thuốc
                </NavDropdown.Item>
              ) : null}

              {tempService === true ? (
                <NavDropdown.Item href="/service" style={{fontSize:"20px"}}>
                  Quản lý thủ thuật
                </NavDropdown.Item>
              ) : null}

              {tempStaff === true ? (
                <NavDropdown.Item href="/staff" style={{fontSize:"20px"}}>
                  Quản lý nhân viên
                </NavDropdown.Item>
              ) : null}

              <NavDropdown.Divider />
              {user.role[0].name === "Admin" ? (
                <NavDropdown.Item href="/Decentralization" style={{fontSize:"20px"}}>
                  Phân quyền người dùng
                </NavDropdown.Item>
              ) : (
                <></>
              )}

              {tempRoom === true ? (
                <NavDropdown.Item href="/clinic" style={{fontSize:"20px"}}>
                  Thông tin phòng khám
                </NavDropdown.Item>
              ) : (
                <></>
              )}
            </NavDropdown>
          </Nav>

          <Nav>
            <NavDropdown title={user.username} id="basic-nav-dropdown" style={{fontSize:"20px"}}>
              <NavDropdown.Item href="/pathological1" style={{fontSize:"20px"}}>Ghi chú</NavDropdown.Item>
              <NavDropdown.Item href="/Profile" style={{fontSize:"20px"}}>
                Thông tin chung
              </NavDropdown.Item>
              <NavDropdown.Item href="/Changepassword" style={{fontSize:"20px"}}>
                Đổi mật khẩu
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/login" style={{fontSize:"20px"}} onClick={logout}>
                Đăng xuất
              </NavDropdown.Item>

              
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbarr;
