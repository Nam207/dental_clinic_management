import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import axios from "../../apis/api";
import { DatePicker } from "antd";
import { FaRedoAlt } from "react-icons/fa";
import "./statistical.css";
import { Typeahead } from "react-bootstrap-typeahead";
import { Select, Pagination, Table as TableAntd, Form as FormAntd } from "antd";
import customerProcessor from "../../apis/customerProcessor";
import TableCustomer from "../../components/tableCustomer";
import TableDate from "../../components/tableDate";
import TablePayment from "../../components/tablePayment";
import TableStaff from "../../components/tableStaff";
import TableTechnical from "../../components/tableTechnical";
import moment from "moment";

function Statistical({user}) {
  const today = new Date();
  const dateFormat = "DD/MM/YYYY";

  const [show, setShow] = React.useState(true);
  const [showTable, setShowTable] = useState(false);

  const [selectTK, setSelectTK] = useState("1");

  let [startCustomer, setStartCustomer] = useState([]);
  let [endCustomer, setEndCustomer] = useState([]);

  let [startEmployee, setStartEmployee] = useState([]);
  let [endEmployee, setEndEmployee] = useState([]);

  const [startDate, setStartDate] = useState(
    moment(today).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment(today).format("YYYY-MM-DD"));

  const [startService, setStartService] = useState([]);
  const [endService, setEndService] = useState([]);

  const [customerList, setCustomerList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [serviceList, setServiceList] = useState([]);

  const loadCustomer = () => {
    axios
      .get("/api/customer/allCustomer")
      .then((response) => {
        setCustomerList([
          ...response.data.map((item) => ({
            name: `${item.fullname}`,
            id: item._id,
          })),
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadEmployee = () => {
    axios
      .get("/api/profile/allEmployee")
      .then((response) => {
        setEmployeeList([
          ...response.data.map((item) => ({
            name: `${item.fullname}`,
            id: item._id,
          })),
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadService = () => {
    axios
      .get("/api/service/allService")
      .then((response) => {
        setServiceList([
          ...response.data.map((item) => ({
            name: item.name,
            id: item._id,
          })),
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    console.log(user.role[0]);
    if(user.role[0].name !== "Admin") window.location.href = "/Page404";
    loadCustomer();
    loadEmployee();
    loadService();
  }, []);

  const [tableData, setTableData] = useState();

  useEffect(() => {
    console.log(tableData);
  }, [tableData]);

  useEffect(() => {
    setShowTable(false);
  }, [selectTK]);

  const onSubmitStatic = async () => {
    if (endEmployee.length === 0) {
      endEmployee = startEmployee;
    }
    if (startEmployee.length === 0) {
      startEmployee = endEmployee;
    }

    let tempData = {};
    tempData.startCustomer = startCustomer[0]?.id;
    tempData.endCustomer = endCustomer[0]?.id;
    tempData.startEmployee = startEmployee[0]?.id;
    tempData.endEmployee = endEmployee[0]?.id;
    tempData.startService = startService[0]?.id;
    tempData.endService = endService[0]?.id;
    tempData.startDate = startDate;
    tempData.endDate = endDate;

    if (selectTK === "1") {
      try {
        const ress = await axios({
          url: "/api/staticstial/byCustomer",
          method: "post",
          data: tempData,
        });
        console.log(ress.data);
        //neu co thi sẽ là selectTK === "2" ? de check
        setTableData([
          ...ress.data.map((i) => ({
            id: i._id.customerId,
            name: i.customerName,
            totalAmount: i.totalAmount.$numberDecimal,
            customerPayment: i.customerPayment.$numberDecimal,
            debt:
              Number(i.totalAmount.$numberDecimal) -
              Number(i.customerPayment.$numberDecimal),
            count: i.count,
          })),
        ]);
      } catch (error) {
        console.log(error);
      }
    }
    if (selectTK === "2") {
      try {
        const ress = await axios({
          url: "/api/staticstial/byDate",
          method: "post",
          data: tempData,
        });

        setTableData([
          ...ress.data.map((i) => ({
            id: i._id,
            totalAmount: i.totalAmount.$numberDecimal,
            customerPayment: i.customerPayment.$numberDecimal,
            debt:
              Number(i.totalAmount.$numberDecimal) -
              Number(i.customerPayment.$numberDecimal),
            count: i.count,
          })),
        ]);
      } catch (error) {
        console.log(error);
      }
    }
    if (selectTK === "3") {
      try {
        const ress = await axios({
          url: "/api/staticstial/byPayment",
          method: "post",
          data: tempData,
        });
        console.log(ress.data);
        setTableData([
          ...ress.data.map((i) => ({
            id: i._id.serviceId,
            serviceName: i.serviceName,
            price: Number(i.price.$numberDecimal),
            count: i.count,
          })),
        ]);
      } catch (error) {
        console.log(error);
      }
    }

    if (selectTK === "4") {
      try {
        const ress = await axios({
          url: "/api/staticstial/byService",
          method: "post",
          data: tempData,
        });
        console.log(ress.data);
        setTableData([
          ...ress.data.map((i) => ({
            id: i._id.serviceId,
            serviceName: i.serviceName,
            price: Number(i.price.$numberDecimal),
            count: i.count,
          })),
        ]);
      } catch (error) {
        console.log(error);
      }
    }
    if (selectTK === "5") {
      console.log(5);
      try {
        const ress = await axios({
          url: "/api/staticstial/byEmployee",
          method: "post",
          data: tempData,
        });
        console.log(ress.data);
        setTableData([
          ...ress.data.map((i) => ({
            id: i._id.createBy,
            employeeName: i.employeeName,
            customerPayment: Number(i.customerPayment.$numberDecimal),
            count: i.count,
          })),
        ]);
      } catch (error) {
        console.log(error);
      }
    }

    setShowTable(true);
  };

  return (
    <>
      <div
        style={{
          marginLeft: "80px",
          marginRight: "80px",
          marginTop: "20px",
          border: "1px solid #E9ECEF",
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
                  Thống kê doanh thu
                </h4>
              </Nav>

              <Form className="d-flex">
                <Button
                  variant="primary"
                  style={{ marginRight: "20px" }}
                  onClick={() => setShow(!show)}
                >
                  {show ? "Ẩn điều kiện" : "Hiện điều kiện"}
                </Button>
                <Button
                  variant="primary"
                  style={{ marginRight: "20px" }}
                  onClick={() => {
                    onSubmitStatic();
                  }}
                >
                  Thống Kê
                </Button>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      {show && (
        <div
          className="card-body collapse show"
          style={{
            marginLeft: "80px",
            marginRight: "80px",
            border: "1px solid #E9ECEF",
          }}
        >
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="form-group row">
                <label className="col-2 col-form-label form-control-label">
                  {" "}
                  Loại thống kê{" "}
                </label>
                <div className="col-10">
                  <select
                    className="form-control"
                    onChange={(e) => {
                      // console.log(e.target.value);
                      setSelectTK(e.target.value);
                    }}
                  >
                    <option selected="selected" value="1">
                      Khách hàng
                    </option>
                    <option value="2">Ngày</option>
                    <option value="3">Hình thức thanh toán</option>
                    <option value="4">Thủ thuật</option>
                    <option value="5">Nhân viên</option>
                  </select>
                </div>
              </div>

              <div className="form-group row" style={{ marginTop: "24px" }}>
                <label class="col-2 col-form-label form-control-label">
                  {" "}
                  Nhân viên{" "}
                </label>

                <div class="col-5">
                  <FormAntd.Item
                    name="BS"
                    rules={[
                      {
                        required: true,
                        message: "Nhập tên nhân viên",
                      },
                    ]}
                  >
                    <Typeahead
                      id="basic-typeahead-single"
                      labelKey="id"
                      placeholder="Từ nhân viên"
                      options={employeeList}
                      onChange={(e) => {
                        if (endEmployee.length === 0) {
                          setEndEmployee(e);
                        }

                        setStartEmployee(e);
                      }}
                      selected={startEmployee}
                      renderMenuItemChildren={(option) => (
                        <div>
                          {option.id}
                          <div>
                            <small>Name: {option.name}</small>
                          </div>
                        </div>
                      )}
                    />
                  </FormAntd.Item>
                </div>
                <div class="col-5">
                  <FormAntd.Item
                    name="BS"
                    rules={[
                      {
                        required: true,
                        message: "Nhập tên nhân viên",
                      },
                    ]}
                  >
                    <Typeahead
                      id="basic-typeahead-single"
                      labelKey="id"
                      placeholder="Đến nhân viên"
                      options={employeeList}
                      onChange={(e) => {
                        setEndEmployee(e);
                      }}
                      selected={endEmployee}
                      renderMenuItemChildren={(option) => (
                        <div>
                          {option.id}
                          <div>
                            <small>Name: {option.name}</small>
                          </div>
                        </div>
                      )}
                    />
                  </FormAntd.Item>
                </div>
              </div>
              <div className="form-group row">
                <label class="col-2 col-form-label form-control-label">
                  {" "}
                  Khách hàng{" "}
                </label>

                <div class="col-5">
                  <FormAntd.Item
                    name="BS"
                    rules={[
                      {
                        required: true,
                        message: "Nhập tên khách hàng",
                      },
                    ]}
                  >
                    <Typeahead
                      id="basic-typeahead-single"
                      labelKey="id"
                      placeholder="Từ khách hàng"
                      options={customerList}
                      onChange={(e) => {
                        setStartCustomer(e);
                      }}
                      selected={startCustomer}
                      renderMenuItemChildren={(option) => (
                        <div>
                          {option.id}
                          <div>
                            <small>Name: {option.name}</small>
                          </div>
                        </div>
                      )}
                    />
                  </FormAntd.Item>
                </div>
                <div class="col-5">
                  <FormAntd.Item
                    name="BS"
                    rules={[
                      {
                        required: true,
                        message: "Nhập tên khách hàng",
                      },
                    ]}
                  >
                    <Typeahead
                      id="basic-typeahead-single"
                      labelKey="id"
                      placeholder="Từ khách hàng"
                      onChange={(e) => {
                        setEndCustomer(e);
                      }}
                      selected={endCustomer}
                      options={customerList}
                      renderMenuItemChildren={(option) => (
                        <div>
                          {option.id}
                          <div>
                            <small>Name: {option.name}</small>
                          </div>
                        </div>
                      )}
                    />
                  </FormAntd.Item>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-sm-12">
              <div className="form-group row">
                <label class="col-2 col-form-label form-control-label">
                  {" "}
                  Ngày thống kê{" "}
                </label>

                <div class="col-10" style={{ display: "flex" }}>
                  <DatePicker.RangePicker
                    style={{ textAlign: "center" }}
                    defaultValue={[
                      moment(today, dateFormat),
                      moment(today, dateFormat),
                    ]}
                    format={dateFormat}
                    onChange={(e) => {
                      setStartDate(moment(e[0]).format("YYYY-MM-DD"));
                      setEndDate(moment(e[1]).format("YYYY-MM-DD"));
                    }}
                  />
                </div>
              </div>

              <div className="form-group row" style={{ marginTop: "24px" }}>
                <label class="col-2 col-form-label form-control-label">
                  {" "}
                  Thủ thuật{" "}
                </label>

                <div class="col-5">
                  <FormAntd.Item
                    name="BS"
                    rules={[
                      {
                        required: true,
                        message: "Nhập tên nhân viên",
                      },
                    ]}
                  >
                    <Typeahead
                      id="basic-typeahead-single"
                      labelKey="id"
                      placeholder="Từ thủ thuật"
                      onChange={(e) => {
                        setStartService(e);
                      }}
                      selected={startService}
                      options={serviceList}
                      renderMenuItemChildren={(option) => (
                        <div>
                          {option.id}
                          <div>
                            <small>Name: {option.name}</small>
                          </div>
                        </div>
                      )}
                    />
                  </FormAntd.Item>
                </div>
                <div class="col-5">
                  <FormAntd.Item
                    name="BS"
                    rules={[
                      {
                        required: true,
                        message: "Nhập tên nhân viên",
                      },
                    ]}
                  >
                    <Typeahead
                      id="basic-typeahead-single"
                      labelKey="id"
                      placeholder="Đến thủ thuật"
                      onChange={(e) => {
                        setEndService(e);
                      }}
                      selected={endService}
                      options={serviceList}
                      renderMenuItemChildren={(option) => (
                        <div>
                          {option.id}
                          <div>
                            <small>Name: {option.name}</small>
                          </div>
                        </div>
                      )}
                    />
                  </FormAntd.Item>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* đây là nơi hiện bảng thống kê */}
      {/* <TableCustomer /> */}
      {showTable &&
        (selectTK === "2" ? (
          <TableDate customers={tableData} />
        ) : selectTK === "3" ? (
          <TablePayment customers={tableData} />
        ) : selectTK === "4" ? (
          <TableTechnical customers={tableData} />
        ) : selectTK === "5" ? (
          <TableStaff customers={tableData} />
        ) : (
          <TableCustomer customers={tableData} />
        ))}
    </>
  );
}

export default Statistical;
