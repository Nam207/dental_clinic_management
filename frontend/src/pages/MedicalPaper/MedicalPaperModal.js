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
import { Select, Pagination, Table as TableAntd, Form as FormAntd } from "antd";
// import "react-bootstrap-typeahead/css/Typeahead.css";
import { Typeahead } from "react-bootstrap-typeahead";
import AdCusSearch from "./AdCusSearch";
import MedListPaper from "./MedListPaper";
const MedicalPaperModal = () => {
  // const options = [];
  const [customerId, setCustomerId] = useState([]);

  // const [options, setOptions] = useState(["jack", "lucy", "david"]);
  const [singleSelections, setSingleSelections] = useState([]);
  const [singleSelectionsDoc, setSingleSelectionsDoc] = useState([]);
  const [singleSelectionsStatus, setSingleSelectionsStatus] = useState([]);
  const [singleSelectionsKTV, setSingleSelectionsKTV] = useState([]);

  const [systemMed, setSystemMed] = useState([]);
  const [dentalMed, setDentalMed] = useState([]);
  const [opac, setOpac] = useState(1);

  const loadCustomerData = () => {
    axios
      .get("/api/customer/allCustomer")
      .then((response) => {
        // console.log(response.data);
        setCustomerId([
          // ...customerId,
          ...response.data.map((item) => ({
            name: item.fullname,
            id: item._id,
          })),
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [curUser, setCurUser] = useState({});
  const loadCurProfile = () => {
    axios
      .get("/api/profile/curProfile")
      .then((response) => {
        // console.log(response.data);
        setCurUser(response.data[0]);
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

  const [searchMeds, setSearchMeds] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // console.log(options);
    loadServiceTable();
    loadSystemMed();
    loadDentalMed();
    loadCustomerData();
    loadCurProfile();
    // setTimeout(() => {
    //   console.log(customerId);
    // }, 1000);
  }, [offset, total, searchMeds, limit]);

  const onChangePage = (current, pageSize) => {
    // console.log(current, pageSize);
    setOffset(current - 1);
    setLimit(pageSize);
  };

  const loadServiceTable = async () => {
    await axios
      .get(
        `/api/service/activeService?keyword=${searchMeds}&offset=${offset}&limit=${limit}`
      )
      .then((response) => {
        // setServices(response.data);
        //get service which status = true;
        // var temp = response.data.data.filter((item) => item.status === true);
        // setServices(temp);
        if (response.success === 1) {
          setServices(response.data.data);
          setTotal(response.data.total);
        }
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
    // setDentalMed([...dentalMed, ...response.data]);
    setDentalMed(response.data);
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

  const [currentItems, setCurrentItems] = useState([]);

  const [selectedCus, setSelectedCus] = useState({});

  //fill Data from chonsen SingleSelection - chưa xoá được
  const fillCusDataByName = async (e) => {
    // console.log(e[0].name);
    // setSingleSelections(e);
    const response = await axios.get(`api/customer/${e[0].id}`);

    console.log(response.data);
    //fill Data
    setSelectedCus(response.data);
  };

  const [currentItemList, setCurrentItemList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Add currentItems/Service
  const [curDate, setCurDate] = useState(new Date());
  const addCurrentItems = (id, name, price) => {
    // console.log(typeof price);
    // console.log(new Date().toISOString().split("T")[0]);
    let curDate = new Date().toLocaleDateString("en-US");
    setTotalPrice(totalPrice + Number(price));
    setCurrentItemList([...currentItemList, [curDate, name, price, "", ""]]);
  };

  const deleteCurrentItems = (rowIndex, price) => {
    console.log(price);
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
          <Modal.Title style={{ marginRight: "30px" }}>
            Thêm thông tin Phiếu khám
          </Modal.Title>
          {/* Ngày tạo */}
          <Modal.Title>
            {/* <Form.Control
              style={{ width: "50%" }}
              type="text"
              value={new Date().toLocaleDateString("en-US")}
              // readOnly
              disabled
            ></Form.Control> */}
            Ngày tạo: <span>{new Date().toLocaleDateString("en-US")}</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormAntd name="basic">
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
                  {services.map((ser) => {
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
              <div id="pagin">
                <Pagination
                  size="small"
                  showSizeChanger={false}
                  current={offset + 1}
                  total={total}
                  onChange={onChangePage}
                  defaultPageSize={5}
                  // pageSizeOptions={[5, 10, 20, 50]}
                />
              </div>

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
              <div
                style={{
                  // textAlign: "center",
                  display: "flex",
                  // marginRight: "15px",
                  // width: "auto",
                  // height: "auto",
                  // alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  // onClick={handleShow}
                  style={{
                    marginBottom: "8px",
                    display: "inline",
                    marginLeft: "auto",
                    // marginRight: "auto",
                  }}
                >
                  Lưu lại
                </Button>
                <Button
                  variant="primary"
                  // onClick={handleShow}
                  style={{
                    marginBottom: "8px",
                    display: "inline",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  In
                </Button>

                <Button
                  variant="primary"
                  // onClick={handleShow}
                  style={{
                    marginBottom: "8px",
                    display: "inline",
                    // marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  Thanh toán
                </Button>
              </div>
            </div>

            <div id="serviceMiddle">
              {/* <Form
              // onSubmit={formik.handleSubmit}
              style={{ border: "1px solid #dee2e6" }}
            > */}
              <Row
                className="mb-3"
                style={{
                  margin: "5px",
                }}
              >
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
                    placeholder="Tên - Mã nhân viên"
                    disabled
                    value={`${curUser.fullname} - ${curUser._id}`}
                    // onChange={formik.handleChange}
                  />
                  {/* {formik.errors.phone && (
                    <p className="errorMsg"> {formik.errors.phone} </p>
                  )} */}
                </Col>
              </Row>
              <Row
                className="mb-3"
                style={{ margin: "5px", marginTop: "39px" }}
              >
                <Form.Label column sm={4}>
                  Tên Bác sỹ
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
                  <FormAntd.Item
                    name="BS"
                    rules={[
                      {
                        required: true,
                        message: "Nhập tên bác sỹ",
                      },
                    ]}
                  >
                    <Typeahead
                      id="basic-typeahead-single"
                      labelKey="name"
                      onChange={(e) => {
                        // fillCusDataByName(e);
                        // console.log(e);
                        setSingleSelectionsDoc(e);
                      }}
                      options={customerId}
                      placeholder="Chọn tên bác sỹ..."
                      selected={singleSelectionsDoc}
                      renderMenuItemChildren={(option) => (
                        <div>
                          {option.name}
                          <div>
                            <small>ID: {option.id}</small>
                          </div>
                        </div>
                      )}
                    />
                  </FormAntd.Item>
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
                <Col sm={8}>
                  <FormAntd.Item
                    name="KH"
                    rules={[
                      {
                        required: true,
                        message: "Nhập tên khách hàng",
                      },
                    ]}
                  >
                    <Typeahead
                      id="basic-typeahead-single"
                      labelKey="name"
                      onChange={(e) => {
                        console.log(e);
                        fillCusDataByName(e);
                        setSingleSelections(e);
                      }}
                      options={customerId}
                      placeholder="Chọn tên khách hàng..."
                      selected={singleSelections}
                    />
                  </FormAntd.Item>
                </Col>
              </Row>
              <Row className="mb-3" style={{ margin: "5px" }}>
                <Col sm={4}>
                  {/* Advenced Customer Search */}
                  <AdCusSearch
                    closeMedPaper={closeMedpaper}
                    openMedPaper={openMedPaper}
                    setSingleSelections={setSingleSelections}
                    fillCusDataByName={fillCusDataByName}
                  />
                </Col>
                <Col sm={4}>
                  <CustomerModal
                    lbl={"Thêm KH"}
                    // loadData={loadData}
                    widthh="200px"
                    closeMedPaper={closeMedpaper}
                    openMedPaper={openMedPaper}
                  />
                </Col>
                <Col sm={4}>
                  {/* Đơn thuốc */}
                  <MedListPaper
                    closeMedPaper={closeMedpaper}
                    openMedPaper={openMedPaper}
                    singleSelectionsDoc={singleSelectionsDoc}
                  />
                </Col>
              </Row>
              <hr style={{ marginTop: "8px", marginBottom: "4px" }} />
              <Table striped hover style={{ textAlign: "center" }}>
                <thead>
                  <tr>
                    <th>
                      <b>Ngày chuẩn đoán</b>
                    </th>
                    <th>
                      <b>Thủ thuật</b>
                    </th>
                    <th>
                      <b>Đơn giá</b>
                    </th>
                    <th>
                      <b>Kĩ thuật viên</b>
                    </th>
                    <th>
                      <b>Trạng thái</b>
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
                          <td style={{ textAlign: "center" }}>
                            <FormAntd.Item
                              name={`KTV${rowIndex}`}
                              rules={[
                                {
                                  required: true,
                                  message: "Nhập kĩ thuật viên",
                                },
                              ]}
                            >
                              <Typeahead
                                style={{ width: "155px", margin: "auto" }}
                                id="basic-typeahead-single"
                                labelKey="name"
                                onChange={(e) => {
                                  // fillCusDataByName(e);
                                  console.log(e);

                                  let tempSelect = singleSelectionsKTV;
                                  tempSelect[rowIndex] = e;
                                  setSingleSelectionsKTV([...tempSelect]);
                                }}
                                options={customerId}
                                placeholder="Chọn kĩ thuật viên"
                                selected={singleSelectionsKTV[rowIndex]}
                                renderMenuItemChildren={(option) => (
                                  <div>
                                    {option.name}
                                    <div>
                                      <small>ID: {option.id}</small>
                                    </div>
                                  </div>
                                )}
                              />
                            </FormAntd.Item>
                          </td>
                          <td>
                            <FormAntd.Item
                              name={`TT${rowIndex}`}
                              rules={[
                                {
                                  required: true,
                                  message: "Nhập trạng thái",
                                },
                              ]}
                            >
                              <Typeahead
                                style={{ width: "155px", margin: "auto" }}
                                id="basic-typeahead-single"
                                onChange={(e) => {
                                  // fillCusDataByName(e);
                                  let tempSelect = singleSelectionsStatus;
                                  tempSelect[rowIndex] = e;
                                  setSingleSelectionsStatus([...tempSelect]);
                                }}
                                options={[
                                  { id: 0, label: "Chưa thực hiện" },
                                  { id: 1, label: "Đang thực hiện" },
                                  { id: 2, label: "Hoàn thành" },
                                ]}
                                placeholder="  Chọn Trạng thái"
                                selected={singleSelectionsStatus[rowIndex]}
                                // defaultSelected={[
                                //   {
                                //     id: 0,
                                //     label: "Chưa thực hiện",
                                //   },
                                // ]}
                              />
                            </FormAntd.Item>
                          </td>

                          <td
                            onClick={() => deleteCurrentItems(rowIndex, row[2])}
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
                        style={{ width: "162px" }}
                      />
                    </Col>
                  );
                })}
              </Row>
              <Row
                className="mb-3"
                style={{
                  margin: "5px",
                }}
              >
                <Form.Label column sm={2}>
                  <b>Ghi chú</b>
                </Form.Label>
                <Col sm={10}>
                  <Form.Control id="gc" type="text" as="textarea" rows={3} />
                </Col>
              </Row>

              {/* </Form> */}
            </div>
          </FormAntd>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MedicalPaperModal;
