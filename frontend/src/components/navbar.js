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
  console.log(user);
  const [tempStaff, setTempStaff] = useState(false);
  const [tempService, setTempService] = useState(false);
  const [tempMedicine, setTempMedicine] = useState(false);
  const [tempRoom, setTempRoom] = useState(false);
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

  useEffect(() => {
    getPermission("Quản lý nhân viên");
    getPermissionService("Quản lý dịch vụ");
    getPermissionMedicine("Quản lý thuốc");
    getPermissionRoom("Quản lý phòng khám");
    
  }, []);

  const getPermissionRoom = async (functionName) => {
    const functionArray = await axios({
      url: `/api/function`,
      method: "get",
    });
    const index = findIndexByProperty(functionArray.data, "name", functionName);
    let tempView = 0;
    await Promise.all(
      user.role.map(async (element) => {
        const permission = await axios({
          url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
          method: "get",
        });
        if (permission.success === 0 || !permission.data) return;

        if (permission.data[0].view === true) {
          setTempRoom(true);
        }
       
      })
    );
  };

  const getPermissionMedicine = async (functionName) => {
    const functionArray = await axios({
      url: `/api/function`,
      method: "get",
    });
    const index = findIndexByProperty(functionArray.data, "name", functionName);
    let tempView = 0;
    await Promise.all(
      user.role.map(async (element) => {
        const permission = await axios({
          url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
          method: "get",
        });
        if (permission.success === 0 || !permission.data) return;

        if (permission.data[0].view === true) {
          setTempMedicine(true);
        }
       
      })
    );
  };

  const getPermissionService = async (functionName) => {
    const functionArray = await axios({
      url: `/api/function`,
      method: "get",
    });
    const index = findIndexByProperty(functionArray.data, "name", functionName);
    let tempView = 0;
    await Promise.all(
      user.role.map(async (element) => {
        const permission = await axios({
          url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
          method: "get",
        });
        if (permission.success === 0 || !permission.data) return;

        if (permission.data[0].view === true) {
          setTempService(true);
        }
       
      })
    );
  };

  const getPermission = async (functionName) => {
    const functionArray = await axios({
      url: `/api/function`,
      method: "get",
    });
    const index = findIndexByProperty(functionArray.data, "name", functionName);
    let tempView = 0;
    await Promise.all(
      user.role.map(async (element) => {
        const permission = await axios({
          url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
          method: "get",
        });
        if (permission.success === 0 || !permission.data) return;

        if (permission.data[0].view === true) {
          setTempStaff(true);
        }
       
      })
    );
  };

  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="/Dashboard">Dental Clinic</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/MedicalPaper">Phiếu khám</Nav.Link>
            <Nav.Link href="/Customer">Khách hàng</Nav.Link>

            <NavDropdown title="Thiết lập" id="basic-nav-dropdown">
            {tempMedicine === true ? (
                
                <NavDropdown.Item href="/medicine">
                Quản lý thuốc
              </NavDropdown.Item>
              ) : null}
             
              {tempService === true ? (
                
                <NavDropdown.Item href="/service">
                Quản lý thủ thuật
              </NavDropdown.Item>
              ) : null}
             
           
              <NavDropdown.Divider />
              {tempStaff === true ? (
                
                <NavDropdown.Item href="/staff">
                  Quản lý nhân viên
                </NavDropdown.Item>
              ) : null}

              <NavDropdown.Divider />
              {tempRoom === true ? (         
                <NavDropdown.Item href="/clinic">
                Thông tin phòng khám
              </NavDropdown.Item>
              ) : null}
              
            </NavDropdown>
          </Nav>

          <Nav>
            <NavDropdown title={user.username} id="basic-nav-dropdown">
              <NavDropdown.Item href="/pathological1">Ghi chú</NavDropdown.Item>
              <NavDropdown.Item href="/Profile">
                Thông tin chung
              </NavDropdown.Item>
              <NavDropdown.Item href="/Changepassword">
                Đổi mật khẩu
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/login" onClick={logout}>
                Đăng xuất
              </NavDropdown.Item>

              <NavDropdown.Item href="/pathological1">
                Thông tin phần mềm
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbarr;
