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
import { FaEye } from "react-icons/fa";
import { FaRedoAlt } from "react-icons/fa";
import ModaleTech from "./modalTech";
import Swal from "sweetalert2";

function DashBoardTech({ user }) {
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
          console.log(response.data.data);
          setTable(response.data.data);
          setTotalReExam(response.data.total);
        }
      });
  };

  const changeStatus = async (id, status) => {
    const response = await axios
      .put(`/api/medicalService/updateStatus/${id}/${status}`)
      .then((response) => {});
  };

  useEffect(() => {
    let temp = 0;
    user.role.forEach((element) => {
      if (element.name === "Kỹ thuật viên" || element.name === "Admin") temp++;
    });
    if (temp === 0) window.location.href = "/Page404";
    loadDataReExam();
  }, [offsetReExam, limitReExam, startDate, endDate, keyWord]);

  const onChangePageReExam = (current, pageSize) => {
    setOffsetReExam(current - 1);
    setLimitReExam(pageSize);
  };

  const hangleChangeDate = (e) => {
    setStartDate(moment(e[0]).format("YYYY-MM-DD"));
    setEndDate(moment(e[1]).format("YYYY-MM-DD"));
  };

  const handleSearch = (e) => {
    setkeyWord(e.target.value);
  };

  const columnsReExam = [
    {
      title: "Mã phiếu khám",
      dataIndex: "_idPH",
      align: "center",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a._idPH.localeCompare(b._idPH),
    },
    {
      title: "Mã khách hàng",
      dataIndex: "_idKH",
      align: "center",
      sorter: (a, b) => a._idKH.localeCompare(b._idKH),
    },
    {
      title: "Khách hàng",
      dataIndex: "nameKH",
      align: "center",
      sorter: (a, b) => a.nameKH.localeCompare(b.nameKH),
    },
    {
      title: "Mã thủ thuật",
      dataIndex: "_idTT",
      align: "center",
      sorter: (a, b) => a._idTT.localeCompare(b._idTT),
    },
    {
      title: "Thủ thuật",
      dataIndex: "nameTT",
      align: "center",
      sorter: (a, b) => a.nameTT.localeCompare(b.nameTT),
    },
    {
      title: "Ngày tạo",
      dataIndex: "dateT",
      align: "center",
      sorter: (a, b) =>
        moment(a.dateT, "DD/MM/YYYY").toDate() -
        moment(b.dateT, "DD/MM/YYYY").toDate(),
      // sorter: (a, b) => moment(a.dateT).valueOf() - moment(b.dateT).valueOf(),
      // sorter: (a, b) => console.log(moment(a.dateT).unix()),
      // sorter: (a, b) => a.dateT.localeCompare(b.dateT),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      filters: [
        {
          text: "Hoàn thành",
          value: `Hoàn thành`,
        },
        {
          text: "Đang thực hiện",
          value: `Đang thực hiện`,
        },
        {
          text: "Chưa thực hiện",
          value: `Chưa thực hiện`,
        },
      ],
      onFilter: (value, record) => record.status.props.children === value,
      // filters: console.log();
    },
    {
      title: "Hành động",
      dataIndex: "view",
      align: "center",
    },
  ];

  const dataReExam = table.map((element) => {
    return {
      _idPH: element.medicalPaperId._id,
      _idKH: element.customerId._id,
      nameKH: element.customerId.fullname,
      _idTT: element.serviceId._id,
      nameTT: element.serviceId.name,
      dateT: moment(element.createdAt).format("DD/MM/YYYY"),

      status:
        element.status.$numberDecimal === "0" ? (
          <Button
            variant="danger"
            onClick={async () => {
              Swal.fire({
                title: "Bạn có chắc chắn muốn đổi",
                showDenyButton: true,
                confirmButtonText: "Đổi",
                denyButtonText: `Huỷ`,
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await changeStatus(element._id, 1);
                  loadDataReExam();
                } else if (result.isDenied) {
                }
              });
            }}
          >
            Chưa thực hiện
          </Button>
        ) : element.status.$numberDecimal === "1" ? (
          <Button
            variant="warning"
            onClick={async () => {
              Swal.fire({
                title: "Bạn có chắc chắn muốn đổi",
                showDenyButton: true,
                confirmButtonText: "Đổi",
                denyButtonText: `Huỷ`,
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await changeStatus(element._id, 2);
                  loadDataReExam();
                } else if (result.isDenied) {
                }
              });
            }}
          >
            Đang thực hiện
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={async () => {
              Swal.fire({
                title: "Bạn có chắc chắn muốn đổi",
                showDenyButton: true,
                confirmButtonText: "Đổi",
                denyButtonText: `Huỷ`,
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await changeStatus(element._id, 0);
                  loadDataReExam();
                } else if (result.isDenied) {
                }
              });
            }}
          >
            Hoàn thành
          </Button>
        ),
      view: (
        <FaEye
          className="mx-2"
          color="#2980b9"
          cursor={"pointer"}
          size={25}
          onClick={() => {
            openUpdateModal(element.customerId._id);
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
        cusId={empId}
      ></ModaleTech>
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
                onChange={hangleChangeDate}
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
                onChange={handleSearch}
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
