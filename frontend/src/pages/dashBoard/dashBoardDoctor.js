import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import axios from "../../apis/api";
import { Pagination, Table, DatePicker } from "antd";
import moment from "moment";
import { FaRedoAlt } from "react-icons/fa";
function DashBoardDoctor() {
  const [offsetReExam, setOffsetReExam] = useState(0);
  const [limitReExam, setLimitReExam] = useState(5);
  const [totalReExam, setTotalReExam] = useState(0);
  const [reExamination, setReExamination] = useState([]);

  const [offsetBirthday, setOffsetBirthday] = useState(0);
  const [limitBirthday, setLimitBirthday] = useState(5);
  const [totalBirthday, setTotalBirthday] = useState(0);
  const [birthday, setBirthday] = useState([]);

  const today = new Date();
  const dateFormat = "DD/MM/YYYY";

  const [startDate, setStartDate] = useState(
    moment(today).format("YYYY-MM-DD")
  );
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

  useEffect(() => {
    loadDataReExam();
  }, [offsetReExam, limitReExam, startDate, endDate]);

  const onChangePageReExam = (current, pageSize) => {
    setOffsetReExam(current - 1);
    setLimitReExam(pageSize);
  };

  const columnsReExam = [
    {
      title: "Mã phiếu khám",
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
      title: "Ngày tạo",
      dataIndex: "date",
      align: "center",
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
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

  return (
    <>
      <div
        style={{
          margin: "auto",
          width: "90%",
          display: "block",
          marginTop: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
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
                  Phiếu Khám
                </h4>
              </Nav>
              {/* <DatePicker.RangePicker
                defaultValue={[
                  moment(today, dateFormat),
                  moment(today, dateFormat),
                ]}
                format={dateFormat}
                style={{ float: "right", marginRight: "20px" }}
              /> */}
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
        <div style={{ marginLeft: "80px", marginRight: "80px" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                style={{ marginTop: "20px" }}
                placeholder="Tìm kiếm"
                autoFocus
              />
            </Form.Group>
          </Form>
        </div>
        <div
          style={{ marginLeft: "80px", marginRight: "80px", marginTop: "5px" }}
        >
          {/* <span style={{ fontSize: "20px", fontWeight: "500" }}>
            Tổng: {totalReExam}
          </span> */}

          <Table columns={columnsReExam} pagination={false} />
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
    </>
  );
}

export default DashBoardDoctor;
