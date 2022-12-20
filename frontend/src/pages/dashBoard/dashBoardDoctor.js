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
import { FaEdit } from "react-icons/fa";
import { FaRedoAlt } from "react-icons/fa";
import DocMedicalPaperModal from "../MedicalPaper/DocMedicalPaperModal";

function DashBoardDoctor({user}) {
  const [offsetReExam, setOffsetReExam] = useState(0);
  const [limitReExam, setLimitReExam] = useState(5);
  const [totalReExam, setTotalReExam] = useState(0);
  const [keyWord, setkeyWord] = useState([]);
  const [medicalPaper, setMedicalPaper] = useState([]);
  const today = new Date();
  const dateFormat = "DD/MM/YYYY";
  const [pkID, setPKID] = useState();
  const [opac, setOpac] = useState(1);
  const openMedPaper = () => {
    setOpac(1);
  };
  const closeMedpaper = () => {
    setOpac(0);
  };

  const [startDate, setStartDate] = useState(
    moment(today).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment(today).format("YYYY-MM-DD"));

  const loadDataReExam = async () => {
    const response = await axios
      .get(
        `/api/medicalPaper/getMedicalForDoctor?offset=${offsetReExam}&limit=${limitReExam}&startDate=${startDate}&endDate=${endDate}&keyword=${keyWord}`
      )
      .then((response) => {
        if (response.success === 1) {
          setMedicalPaper(response.data.data);
          setTotalReExam(response.data.total);
        }
      });
  };

  useEffect(() => {
    let temp = 0;
    user.role.forEach(element => {
      if (element.name === "Bác sĩ" || element.name === "Admin") temp++;
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
      dataIndex: "_id",
      align: "center",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      align: "center",
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: "Mã khách hàng",
      dataIndex: "customerId",
      align: "center",
      sorter: (a, b) => a.customerId.localeCompare(b.customerId),
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "",
      dataIndex: "action",
      align: "center",
    },
  ];

  const [empId, setEmpId] = useState("");
  const [isShowUpdate, setIsShowUpdate] = useState(false);
  const openUpdateModal = (id) => {
    setPKID(id);
    setIsShowUpdate(true);
    openMedPaper();
  };

  const closeUpdateModal = () => {
    setIsShowUpdate(false);
  };

  const dataReExam = medicalPaper.map((element) => {
    return {
      key: element._id,
      _id: element._id,
      date: moment(element.createdAt).format("DD/MM/YYYY"),
      customerId: element.customerId._id,
      name: element.customerId.fullname,
      action: (
        <FaEdit
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

  return (
    <>
      <DocMedicalPaperModal
        opac={opac}
        closeMedpaper={closeMedpaper}
        PKID={pkID}
        closeModal={closeUpdateModal}
        isVisible={isShowUpdate}
        loadData={loadDataReExam}
        openMedPaper={openMedPaper}
        role={"doctor"}

      />
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
                  Danh sách khách hàng chờ khám
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

export default DashBoardDoctor;
