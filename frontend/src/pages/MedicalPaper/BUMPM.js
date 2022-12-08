import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { addMed } from "../../apis/medicineProcessor";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../apis/api";
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";
import CustomerModal from "../customer/CustomerModal";
import { FaTrashAlt } from "react-icons/fa";

// import "antd/dist/antd.css";
import { Select, Pagination, Table as TableAntd } from "antd";
// import "react-bootstrap-typeahead/css/Typeahead.css";
import { Typeahead } from "react-bootstrap-typeahead";

//Back up 2/12

const MedicalPaperModal = () => {
  // const options = [];
  const [customerId, setCustomerId] = useState([]);

  // const [options, setOptions] = useState(["jack", "lucy", "david"]);
  const [singleSelections, setSingleSelections] = useState([]);
  const [systemMed, setSystemMed] = useState([]);
  const [dentalMed, setDentalMed] = useState([]);
  const [opac, setOpac] = useState(1);

  const loadCustomerData = () => {
    axios
      .get("/api/customer")
      .then((response) => {
        console.log(response.data.data);
        setCustomerId([
          // ...customerId,
          ...response.data.data.map((item) => item._id),
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const openMedPaper = () => {
    setOpac(1);
  };
  const closeMedpaper = () => {
    setOpac(0);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    closeMedpaper();
  };
  const handleShow = () => {
    setShow(true);
    openMedPaper();
    // console.log(formik.values.expiredDay);
  };
  const [services, setServices] = useState([]);

  useEffect(() => {
    // console.log(options);
    loadServiceTable();
    loadSystemMed();
    loadDentalMed();
    loadCustomerData();
    // setTimeout(() => {
    //   console.log(customerId);
    // }, 1000);
  }, []);

  const loadServiceTable = async () => {
    await axios
      .get("/api/service")
      .then((response) => {
        // setServices(response.data);
        //get service which status = true;
        var temp = response.data.data.filter((item) => item.status === true);
        setServices(temp);
      })
      .catch((err) => {
        console.log("Err: ", err);
      });

    // console.log(services);
  };

  const loadSystemMed = async () => {
    const response = await axios
      .get("/api/systemicMedicalHistory")
      .catch((err) => {
        console.log(err);
      });
    setSystemMed(response.data);
    // setSystemMed((systemMed) => [...systemMed, response.data]);
    // console.log(response.data);
  };
  const loadDentalMed = async () => {
    const response = await axios
      .get("/api/dentalMedicalHistory")
      .catch((err) => {
        console.log(err);
      });
    setDentalMed([...dentalMed, ...response.data]);
  };

  const onChangeSelect = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const onClickSelect = () => {
    console.log("Clickkk:");
  };

  //PAGINATION
  // We start with an empty list of items.
  const [searchMeds, setSearchMeds] = useState("");

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    if (services.length > 0) {
      let tempMeds = services.filter(
        (item) =>
          item._id?.includes(searchMeds) || item.name?.includes(searchMeds)
      );
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(tempMeds.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(tempMeds.length / itemsPerPage));
    } else {
      loadServiceTable();
    }
  }, [itemOffset, itemsPerPage, searchMeds, services]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % services.length;
    // console.log(
    //   `User requested page number ${event.selected}, which is offset ${newOffset}`
    // );
    setItemOffset(newOffset);
  };

  const [selectedCus, setSelectedCus] = useState({});

  //fill Data from chonsen SingleSelection
  const fillCusDataByName = async (e) => {
    console.log("Name: " + e);
    setSingleSelections(e);
    const response = await axios.get(`api/customer/${e}`);

    //fill Data
    setSelectedCus(response.data);
    console.log(response.data);
  };

  const [currentItemList, setCurrentItemList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  // Add currentItems/Service
  const addCurrentItems = (id, name, price) => {
    console.log(typeof price);
    setTotalPrice(totalPrice + Number(price));
    setCurrentItemList([...currentItemList, [id, name, "Bac sy o day", price]]);
  };

  const deleteCurrentItems = (rowIndex, price) => {
    let temp = currentItemList;
    temp.splice(rowIndex, 1);
    setCurrentItemList([...temp]);
    setTotalPrice(totalPrice - price);
  };

  const [changeMoney, setChangeMoney] = useState(0);
  // const [payment,setPayment] = useState(0);

  const calPayment = (payment) => {
    setChangeMoney(payment - totalPrice);
  };

  return (
    <>
      <Button
        variant="success"
        onClick={handleShow}
        style={{ marginRight: "20px" }}
      >
        <FaPlusCircle></FaPlusCircle> Thêm Phiếu khám
      </Button>

      <Modal
        id="medPaperModal"
        show={show}
        onHide={handleClose}
        style={{ opacity: `${opac}` }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin Phiếu khám</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="serviceLeft">
            <Form.Group className="mb-3">
              <Form.Control
                placeholder="Tìm kiếm"
                autoFocus
                value={searchMeds}
                onChange={(e) => {
                  setSearchMeds(e.target.value);
                }}
              />
            </Form.Group>
            <Table striped bordered hover>
              <tbody>
                {currentItems.map((ser) => {
                  return (
                    <tr
                      onClick={() => {
                        addCurrentItems(
                          ser._id,
                          ser.name,
                          ser.price.$numberDecimal
                        );
                      }}
                    >
                      <td
                        style={{
                          border: "1px solid #dee2e6",
                          borderRight: "0px",
                        }}
                      >
                        <img src={ser.imageUrl} width="90px" alt="true" />
                      </td>
                      <td
                        style={{
                          border: "1px solid #dee2e6",
                          borderLeft: "0px",
                        }}
                      >
                        <span style={{ padding: "0px", display: "block" }}>
                          {ser._id}
                        </span>
                        <span style={{ padding: "0px", display: "block" }}>
                          {ser.name}
                        </span>
                        <span style={{ padding: "0px", display: "block" }}>
                          Giá: {ser.price.$numberDecimal}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            {/* <ReactPaginate
              id="Paginate"
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={pageCount}
              previousLabel="<"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
            /> */}
          </div>

          <div id="serviceRight" style={{ border: "1px solid #dee2e6" }}>
            <div style={{ backgroundColor: "#0984e3" }}>
              <h4
                style={{
                  margin: "0px",
                  color: "white",
                  padding: "10px",
                  fontFamily: "Times New Roman",
                }}
              >
                Phiếu khám
              </h4>
            </div>
            {/* <div>
              <h6
                style={{
                  margin: "0px",
                  padding: "5px",
                  fontFamily: "Times New Roman",
                  display: "inline-block",
                }}
              >
                Tổng tiền:
              </h6>
              <h6
                style={{
                  // marginLeft:"110px",
                  float: "right",
                  padding: "5px",
                  fontFamily: "Times New Roman",
                  display: "inline-block",
                }}
              >
                {totalPrice}
              </h6>
            </div> */}
            <Row>
              <Form.Label column style={{ marginLeft: "5px" }}>
                <b>Tổng tiền</b>
              </Form.Label>
              <Col>
                <Form.Control
                  plaintext
                  readOnly
                  // style={{ marginLeft: "14px" }}
                  id="phone"
                  type="number"
                  placeholder={totalPrice.toLocaleString("en-US")}

                  // onChange={formik.handleChange}
                />
              </Col>
            </Row>

            {/* <hr style={{ marginTop: "8px", marginBottom: "4px" }} /> */}
            <Row>
              {/* <div> */}
              {/* <h6
                  style={{
                    margin: "0px",
                    padding: "5px",
                    fontFamily: "Times New Roman",
                    display: "inline-block",
                  }}
                >
                  Tiền khách trả:
                </h6> */}
              {/* <h6
                style={{
                  // marginLeft:"110px",
                  float: "right",
                  padding: "5px",
                  fontFamily: "Times New Roman",
                  display: "inline-block",
                }}
              >
                2,000
              </h6> */}
              <Form.Label column style={{ marginLeft: "5px" }}>
                <b>Tiền khách trả</b>
              </Form.Label>
              <Col>
                <Form.Control
                  style={{ backgroundColor: "#ecf0f1" }}
                  plaintext
                  // id="phone"
                  type="number"
                  // value = {payment.toLocaleString("en-US")}
                  placeholder="Nhập số tiền"
                  onChange={(e) => {
                    calPayment(e.target.value);
                    // setPayment(e.target.value)
                    // console.log(payment.toLocaleString("en-US"));
                  }}
                />
              </Col>
              {/* </div> */}
            </Row>
            {/* <hr style={{ marginTop: "8px", marginBottom: "4px" }} /> */}
            {/* <div>
              <h6
                style={{
                  margin: "0px",
                  padding: "5px",
                  fontFamily: "Times New Roman",
                  display: "inline-block",
                }}
              >
                Tiền thừa:
              </h6>
              <h6
                style={{
                  // marginLeft:"110px",
                  float: "right",
                  padding: "5px",
                  fontFamily: "Times New Roman",
                  display: "inline-block",
                }}
              >
                2,000
              </h6>
            </div> */}
            <Row>
              <Form.Label column style={{ marginLeft: "5px" }}>
                <b>Tiền thừa</b>
              </Form.Label>
              <Col>
                <Form.Control
                  plaintext
                  readOnly
                  id="phone"
                  type="number"
                  placeholder={changeMoney.toLocaleString("en-US")}
                />
              </Col>
            </Row>
            <hr style={{ marginTop: "8px", marginBottom: "4px" }} />
            <div style={{ textAlign: "center" }}>
              <Button
                variant="primary"
                // onClick={handleShow}
                style={{ marginBottom: "8px" }}
              >
                Lưu lại
              </Button>
            </div>
          </div>

          <div id="serviceMiddle">
            <Form
              // onSubmit={formik.handleSubmit}
              style={{ border: "1px solid #dee2e6" }}
            >
              <Row className="mb-3" style={{ margin: "5px" }}>
                <Form.Label column sm={4}>
                  Nhân viên
                  <span
                    style={{
                      display: "inline",
                      marginBottom: "0px",
                      color: "red",
                    }}
                  >
                    {" "}
                    *
                  </span>
                </Form.Label>
                <Col sm={8}>
                  <Form.Control
                    id="phone"
                    type="text"
                    placeholder="0"
                    // onChange={formik.handleChange}
                  />
                  {/* {formik.errors.phone && (
                    <p className="errorMsg"> {formik.errors.phone} </p>
                  )} */}
                </Col>
              </Row>
              <Row className="mb-3" style={{ margin: "5px" }}>
                <Form.Label column sm={4}>
                  Khách hàng
                  <span
                    style={{
                      display: "inline",
                      marginBottom: "0px",
                      color: "red",
                    }}
                  >
                    {" "}
                    *
                  </span>
                </Form.Label>
                <Col>
                  {/* <Form.Control
                    id="phone"
                    type="text"
                    placeholder="0"
                    onChange={formik.handleChange}
                  /> */}
                  {/* {formik.errors.phone && (
                    <p className="errorMsg"> {formik.errors.phone} </p>
                  )} */}

                  <Typeahead
                    id="basic-typeahead-single"
                    labelKey="name"
                    onChange={(e) => {
                      fillCusDataByName(e);
                    }}
                    options={customerId}
                    placeholder="Chọn ID khách hàng..."
                    selected={singleSelections}
                  />

                  {/* <Select
                    showSearch
                    placeholder="Chọn 1 khách hàng"
                    // optionFilterProp="children"
                    onChange={onChangeSelect}
                    onSearch={onSearch}
                    allowClear
                    onClick={onClickSelect}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                      {
                        value: "tom",
                        label: "Tom",
                      },
                    ]}
                  /> */}
                </Col>
                <Col sm={3}>
                  <CustomerModal
                    lbl={"Thêm KH"}
                    // loadData={loadData}
                    widthh="200px"
                    closeMedPaper={closeMedpaper}
                    openMedPaper={openMedPaper}
                  />
                </Col>
              </Row>
              <hr style={{ marginTop: "8px", marginBottom: "4px" }} />

              <Table striped hover style={{ textAlign: "center" }}>
                <thead>
                  <tr>
                    <th>
                      <b>ID</b>
                    </th>
                    <th>
                      <b>Thủ thuật</b>
                    </th>
                    <th>
                      <b>Bác sỹ</b>
                    </th>
                    <th>
                      <b>Đơn giá</b>
                    </th>
                    <th>
                      <b></b>
                    </th>
                  </tr>
                </thead>
                {currentItemList.length > 0 && (
                  <tbody>
                    {currentItemList.map((row, rowIndex) => {
                      return (
                        <tr>
                          <td>{row[0]}</td>
                          <td>{row[1]}</td>
                          <td>{row[2]}</td>
                          <td>{row[3]}</td>
                          <td
                            onClick={() => deleteCurrentItems(rowIndex, row[3])}
                          >
                            <FaTrashAlt cursor="pointer" color="#e74c3c" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </Table>
              {/* <hr style={{ marginTop: "8px", marginBottom: "4px" }} /> */}

              <Row className="mb-3" style={{ margin: "5px" }}>
                <Col>
                  <Form.Label>
                    <b> Tiền sử bệnh toàn thân:</b>
                  </Form.Label>
                </Col>
              </Row>

              <Row className="mb-3" style={{ margin: "5px" }}>
                {systemMed.map((sys, inde) => {
                  return (
                    <Col>
                      <Form.Check
                        inline
                        name="systemicMedicalHistory"
                        label={sys.name}
                        value={sys._id}
                        type="checkbox"
                        id={inde + 1}
                        style={{ width: "160px" }}
                        checked={
                          selectedCus.systemicMedicalHistory &&
                          selectedCus.systemicMedicalHistory.includes(sys._id)
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          const targetState = e.target.checked;
                          let tempCus = { ...selectedCus };
                          if (targetState) {
                            tempCus = {
                              ...tempCus,
                              systemicMedicalHistory: [
                                ...tempCus.systemicMedicalHistory,
                                sys._id,
                              ],
                            };
                          } else {
                            const deletePos =
                              tempCus.systemicMedicalHistory.indexOf(sys._id);
                            deletePos !== -1 &&
                              tempCus.systemicMedicalHistory.splice(
                                deletePos,
                                1
                              );
                          }
                          setSelectedCus({ ...tempCus });
                        }}
                      />
                    </Col>
                  );
                })}
              </Row>

              <Row className="mb-3" style={{ margin: "5px" }}>
                <Col>
                  <Form.Label>
                    <b> Tiền sử bệnh răng miệng:</b>
                  </Form.Label>
                </Col>
              </Row>

              <Row className="mb-3" style={{ margin: "5px" }}>
                {dentalMed.map((den, index) => {
                  return (
                    <Col>
                      <Form.Check
                        inline
                        name="dentalMedicalHistory"
                        label={den.name}
                        // label={`${den.name}`}
                        value={den._id}
                        type="checkbox"
                        id={den._id}
                        checked={
                          selectedCus.dentalMedicalHistory &&
                          selectedCus.dentalMedicalHistory.includes(den._id)
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          const targetState = e.target.checked;
                          let tempCus = { ...selectedCus };
                          if (targetState) {
                            tempCus = {
                              ...tempCus,
                              dentalMedicalHistory: [
                                ...tempCus.dentalMedicalHistory,
                                den._id,
                              ],
                            };
                          } else {
                            const deletePos =
                              tempCus.dentalMedicalHistory.indexOf(den._id);
                            deletePos !== -1 &&
                              tempCus.dentalMedicalHistory.splice(deletePos, 1);
                          }
                          setSelectedCus({ ...tempCus });
                        }}
                        // onChange={formik.handleChange}
                        style={{ width: "160px" }}
                      />
                    </Col>
                  );
                })}
              </Row>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MedicalPaperModal;
