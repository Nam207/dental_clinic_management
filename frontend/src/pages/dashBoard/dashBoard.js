import React, { useState, useEffect, Component } from "react";
import "./dashBoard.css";
import {
  SnippetsOutlined,
  UserOutlined,
  BarChartOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import axios from "../../apis/api";
import Button from "react-bootstrap/Button";
import { FaRedoAlt } from "react-icons/fa";
import { Pagination, Table, DatePicker } from "antd";
import moment from 'moment';
const DashBoard = () => {

  const [offsetReExam, setOffsetReExam] = useState(0);
  const [limitReExam, setLimitReExam] = useState(5);
  const [totalReExam, setTotalReExam] = useState(0);
  const [reExamination, setReExamination] = useState([]);
  const [offsetBirthday, setOffsetBirthday] = useState(0);
  const [limitBirthday, setLimitBirthday] = useState(5);
  const [totalBirthday, setTotalBirthday] = useState(0);
  const [birthday, setBirthday] = useState([]);
  const today = new Date();
  const dateFormat = 'DD/MM/YYYY';
  const [startDate, setStartDate] = useState(moment(today).format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment(today).format("YYYY-MM-DD"));

  const loadDataReExam = async () => {
      const response = await axios
          .get(
              `/api/medicalPaper/reExam?offset=${offsetReExam}&limit=${limitReExam}&startDate=${startDate}&endDate=${endDate}`
          )
          .then((response) => {
              if (response.success === 1) {
                  setReExamination(response.data.data);
                  setTotalReExam(response.data.total);
              }
          });
  };
  const loadDataBirthday = async () => {
      const response = await axios
          .get(
              `/api/customer/birthday?offset=${offsetBirthday}&limit=${limitBirthday}`
          )
          .then((response) => {
              if (response.success === 1) {
                  setBirthday(response.data.data);
                  setTotalBirthday(response.data.total);
              }
          });
  };

  useEffect(() => {
      loadDataReExam();
      loadDataBirthday();
  }, [offsetReExam, limitReExam, totalReExam, offsetBirthday, limitBirthday, totalBirthday]);

  const onChangePageReExam = (current, pageSize) => {
      setOffsetReExam(current - 1);
      setLimitReExam(pageSize);
  };

  const onChangePageBirthday = (current, pageSize) => {
      setOffsetBirthday(current - 1);
      setLimitBirthday(pageSize);
  };

  const columnsReExam = [
      {
          title: "Mã khách hàng",
          dataIndex: "_id",
          align: "center",
          sorter: (a, b) => a._id.localeCompare(b._id),
      },
      {
          title: "Khách hàng",
          dataIndex: "name",
          align: "center",
          sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
          title: "Ngày",
          dataIndex: "date",
          align: "center",
          sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      },
      {
          title: "Phiếu khám",
          dataIndex: "medicalPaper",
          align: "center",
          sorter: (a, b) => a.medicalPaper.localeCompare(b.medicalPaper),
      },
      {
          title: "Số điện thoại",
          dataIndex: "phone",
          align: "center",
      },
  ];

  const columnsBirthday = [
      {
          title: "Mã khách hàng",
          dataIndex: "_id",
          align: "center",
          sorter: (a, b) => a._id.localeCompare(b._id),
      },
      {
          title: "Tên khách hàng",
          dataIndex: "name",
          align: "center",
          sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
          title: "Số điện thoại",
          dataIndex: "phone",
          align: "center",
      },
  ];

  // const dataReExam = reExamination.map((element) => {
  //     return {
  //         key: element._id,
  //         _id: element.customerId,
  //         name: element.fullname,
  //         date: element.reExamination,
  //         medicalPaper: element._id,
  //         phone: element.phone
  //     };
  // });

  const dataBirthday = birthday.map((element)  => {
     return  {
          key: element._id,
          _id: element._id,
          name: element.fullname,
          phone: element.phone,
      };
  });
  return (
    <section className="vh-100" style={{ marginTop: "10px" }}>
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-start h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <div className="right__main" style={{ marginTop: "0px" }}>
              <div className="row row-cols-2 mb-4">
                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient1 text-shadow relative"
                    href=""
                  >
                    <i className="h3 fa fa-book">
                      <SnippetsOutlined />
                    </i>
                    <div className="text font-weight-bold text-shadow">
                      Phiếu khám
                    </div>
                  </a>
                </div>

                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient2 text-shadow relative"
                    href="/medicine"
                  >
                    <i className="h3 fa fa-book">
                      <MedicineBoxOutlined />
                    </i>
                    <div className="text font-weight-bold">Đăng ký thuốc</div>
                  </a>
                </div>

                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient3 text-shadow relative"
                    href="/service"
                  >
                    <i className="h3 fa fa-book">
                      <ReconciliationOutlined />
                    </i>
                    <div className="text font-weight-bold">
                      Đăng ký thủ thuật
                    </div>
                  </a>
                </div>
                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient4 text-shadow relative"
                    href="/customer"
                  >
                    <i className="h3 fa fa-book text-shadow">
                      <UserOutlined />
                    </i>
                    <div className="text font-weight-bold text-shadow">
                      Khách Hàng
                    </div>
                  </a>
                </div>
              </div>
              <div className="row row-cols-2 mb-4">
                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient5 text-shadow relative"
                    href=""
                  >
                    <i className="h3 fa fa-book">
                      <BarChartOutlined />
                    </i>
                    <div className="text font-weight-bold">Doanh thu</div>
                  </a>
                </div>

                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient6 text-shadow relative"
                    href="/staff"
                  >
                    <i className="h3 fa fa-book">
                      <TeamOutlined />
                    </i>
                    <div className="text font-weight-bold">Nhân viên</div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-lg-6 col-xl-6 offset-xl">
            <div className="col-md-12 col-lg-12 col-xl-12">
              <div className="col-md-12 col-lg-8 col-xl-9 left__main">
                <div className="">
                <Navbar>
                    <Container fluid>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: "100px" }}
                                navbarScroll
                            >
                                <h4 style={{ display: "inline-block", margin: "10px" }}>
                                    Tái khám
                                </h4>
                            </Nav>
                            <Form className="d-flex">
                                <Button
                                    variant="primary"
                                    style={{ marginRight: "20px" }}
                                    onClick={loadDataReExam}
                                >
                                    <FaRedoAlt /> Tải lại
                                </Button>
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <div style={{ marginLeft: "80px", marginRight: "80px", marginTop: "5px" }}>
                    <span>Tổng: {totalReExam}</span>
                    <DatePicker.RangePicker
                        defaultValue={[moment(today, dateFormat), moment(today, dateFormat)]}
                        format={dateFormat}
                        style={{ float: "right" }}
                    />
                    <Table columns={columnsReExam}  pagination={false} />
                </div>
                  

                <div id="pagin" style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <Pagination
                        showSizeChanger
                        current={offsetReExam + 1}
                        total={totalReExam}
                        onChange={onChangePageReExam}
                        defaultPageSize={5}
                        pageSizeOptions={[5, 10, 20, 50]}
                    />
                </div>
                </div>
                <div className="" style={{ marginTop: "20px" }}>
                <Navbar>
                    <Container fluid>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: "100px" }}
                                navbarScroll
                            >
                                <h4 style={{ display: "inline-block", margin: "10px" }}>
                                    Sinh nhật hôm nay
                                </h4>
                            </Nav>
                            <Form className="d-flex">
                                <Button
                                    variant="primary"
                                    style={{ marginRight: "20px" }}
                                    onClick={loadDataBirthday}
                                >
                                    <FaRedoAlt /> Tải lại
                                </Button>
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <div style={{ marginLeft: "80px", marginRight: "80px", marginTop: "5px" }}>
                    <span>Tổng: {totalBirthday}</span>
                    <Table columns={columnsBirthday} dataSource={dataBirthday} pagination={false} />
                </div>
                <div id="pagin" style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <Pagination
                        showSizeChanger
                        current={offsetBirthday + 1}
                        total={totalBirthday}
                        onChange={onChangePageBirthday}
                        defaultPageSize={5}
                        pageSizeOptions={[5, 10, 20, 50]}
                    />
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default DashBoard;
