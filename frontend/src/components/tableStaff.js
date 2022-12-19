import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import axios from "../apis/api";
import { Pagination, Table, Typography } from "antd";
import moment from "moment";
import { FaRedoAlt } from "react-icons/fa";
import CSV from "../components/ExportCSV";

export const TableStaff = ({ customers }) => {
  const { Text } = Typography;

  const [offsetReExam, setOffsetReExam] = useState(0);
  const [limitReExam, setLimitReExam] = useState(5);
  const [totalReExam, setTotalReExam] = useState(0);
  const [reExamination, setReExamination] = useState([]);

  const today = new Date();

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
  const [cusExcel, setCusExcel] = useState([]);

  useEffect(() => {
    setCusExcel([
      ...customers?.map((i, rowIndex) => {
        return {
          "Mã nhân viên": i.id,
          "Tên nhân viên": i.employeeName,
          "Doanh thu": i.customerPayment,
          "Số phiếu": i.count,
        };
      }),
    ]);
  }, []);

  useEffect(() => {
    loadDataReExam();
  }, [offsetReExam, limitReExam, startDate, endDate]);

  const onChangePageReExam = (current, pageSize) => {
    setOffsetReExam(current - 1);
    setLimitReExam(pageSize);
  };

  const columnsReExam = [
    {
      title: "STT",
      dataIndex: "stt",
      align: "center",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Mã nhân viên",
      dataIndex: "id",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Tên nhân viên ",
      dataIndex: "employeeName",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Doanh thu",
      dataIndex: "customerPayment",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Số phiếu",
      dataIndex: "count",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
  ];

  const dataSource = customers?.map((i, rowIndex) => {
    return {
      stt: rowIndex + 1,
      id: i.id,
      employeeName: i.employeeName,
      customerPayment: i.customerPayment,
      count: i.count,
    };
  });
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
                  Thống kê nhân viên
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
                <CSV csvData={cusExcel} fileName={"Staff report"} />
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
          <Table
            columns={columnsReExam}
            dataSource={dataSource}
            pagination={false}
            summary={(pageData) => {
              let totalCustomerPayment = 0;

              let totalCount = 0;

              pageData.forEach(({ customerPayment, count }) => {
                totalCustomerPayment += customerPayment;

                totalCount += count;
              });

              return (
                <>
                  {/* <div> */}
                  <Table.Summary.Row style={{ textAlign: "center" }}>
                    <Table.Summary.Cell>
                      <b>Tổng:{pageData.length}</b>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text type="danger">{Number(totalCustomerPayment)}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text type="danger">{Number(totalCount)}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TableStaff;
