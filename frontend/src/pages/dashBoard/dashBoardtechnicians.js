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
import {  FaEye } from "react-icons/fa";
import { FaRedoAlt } from "react-icons/fa";
import ModaleTech from "./modalTech";

function DashBoardTech() {
  const [offsetReExam, setOffsetReExam] = useState(0);
  const [limitReExam, setLimitReExam] = useState(5);
  const [totalReExam, setTotalReExam] = useState(0);
  const [keyWord, setkeyWord] = useState([]);

  const [table, setTable] = useState([]);

  const today = new Date();
  const dateFormat = "DD/MM/YYYY";

  const [startDate, setStartDate] = useState(
    moment(today).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment(today).format("YYYY-MM-DD"));

  const loadDataReExam = async () => {
    const response = await axios
      .get(
        `/api/medicalService?limit=${limitReExam}&offset=${offsetReExam}&keyword=${keyWord}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((response) => {
        if (response.success === 1) {
          setTable(response.data.data);
          setTotalReExam(response.data.total);
        }

        console.log(response.data.data[0].status);
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
      dataIndex: "_idPH",
      align: "center",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Mã khách hàng",
      dataIndex: "_idKH",
      align: "center",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Khách hàng",
      dataIndex: "nameKH",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mã thủ thuật",
      dataIndex: "_idTT",
      align: "center",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Thủ thuật",
      dataIndex: "nameTT",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Ngày tạo",
      dataIndex: "dateT",
      align: "center",
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      filters: [
        {
          text: "Thực hiện",
          value: `2`,
        },
        {
          text: "Đang thực hiện",
          value: `1`,
        },
        {
          text: "Chưa thực hiện",
          value: `0`,
        },
      ],
    },
    {
      title: "",
      dataIndex: "view",
      align: "center",
    },
  ];

  const dataReExam = table.map((element) => {
    return {
      _idPH: element.medicalPaperId,
      _idKH: element.customerId._id,
      nameKH: element.customerId.fullname,
      _idTT: element.serviceId._id,
      nameTT: element.serviceId.name,
      dateT: moment(element.createdAt).format("DD/MM/YYYY"),
      status:
        element.status.$numberDecimal === "0"
          ? "Chưa thực hiện"
          : element.status.$numberDecimal === "1"
          ? "Đang thực hiện"
          : "Thực hiện",
      view: (
        <FaEye
          className="mx-2"
          color="#2980b9"
          cursor={"pointer"}
          size={25}
          onClick={() => {
            openUpdateModal(element._id);
          }}
        />
      ),
    };
  });
  const [empId, setEmpId] = useState("");
  const [isShowUpdate, setIsShowUpdate] = useState(false);
  const openUpdateModal = (id) => {
    setIsShowUpdate(true);
    setEmpId(id);
  };

  const closeUpdateModal = () => {
    setEmpId("");
    setIsShowUpdate(false);
  };

  return (
    <>
    <ModaleTech
    closeModal={closeUpdateModal}
    isVisible={isShowUpdate}
    empId={empId}
    >

    </ModaleTech>
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
                  Khách hàng chờ làm thủ thuật
                </h4>
              </Nav>
              <DatePicker.RangePicker
                defaultValue={[
                  moment(today, dateFormat),
                  moment(today, dateFormat),
                ]}
                format={dateFormat}
                style={{ float: "right", marginRight: "20px" }}
              />
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
          <span style={{ fontSize: "20px", fontWeight: "500" }}>
            Tổng: {totalReExam}
          </span>

          <Table
            columns={columnsReExam}
            dataSource={dataReExam}
            pagination={false}
          />
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

export default DashBoardTech;
