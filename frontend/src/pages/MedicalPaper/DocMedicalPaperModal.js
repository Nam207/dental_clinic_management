import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaPlusCircle, FaRegEye } from "react-icons/fa";
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
import Swal from "sweetalert2";

// import "antd/dist/antd.css";
import { Select, Pagination, Table as TableAntd, Form as FormAntd } from "antd";
// import "react-bootstrap-typeahead/css/Typeahead.css";
import { Typeahead } from "react-bootstrap-typeahead";
import AdCusSearch from "./AdCusSearch";
import MedListPaper from "./MedListPaper";
import Payment from "./Payment";
const DocMedicalPaperModal = ({
  PKID,
  closeModal,
  closeMedpaper,
  isVisible,
  loadData,
  opac,
  openMedPaper,
  role,
  user,
}) => {
  const [tempDate, setTempDate] = useState([]);
  const [pk, setPK] = useState({});

  const [note, setNote] = useState();

  //Tái khám - default k de gi: null || empty string
  const [birthDay, setBirthDay] = useState(null);

  //ngay hien tai cua phieu kham
  const [nt, setNt] = useState(new Date());

  const op = [
    { id: 0, label: "Chưa thực hiện" },
    { id: 1, label: "Đang thực hiện" },
    { id: 2, label: "Hoàn thành" },
  ];

  const [totalPrice, setTotalPrice] = useState(0);
  const [cusPayment, setCusPayment] = useState(0);
  const [changeMoney, setChangeMoney] = useState(totalPrice - cusPayment);

  const [serListID, setSerListID] = useState([]);

  const [customerId, setCustomerId] = useState([]);
  const [docList, setDocList] = useState([]);
  const [techStaff, setTechStaff] = useState([]);

  // const [options, setOptions] = useState(["jack", "lucy", "david"]);
  const [singleSelections, setSingleSelections] = useState([]);
  const [singleSelectionsDoc, setSingleSelectionsDoc] = useState([]);
  const [singleSelectionsStatus, setSingleSelectionsStatus] = useState([]);
  const [singleSelectionsKTV, setSingleSelectionsKTV] = useState([]);

  const [systemMed, setSystemMed] = useState([]);
  const [dentalMed, setDentalMed] = useState([]);
  // const [opac, setOpac] = useState(1);

  const [disBtn, setDisBtn] = useState(false);
  const loadCurPK = async () => {
    try {
      const res = await axios({
        url: `/api/medicalPaper/${PKID}`,
        method: "get",
      });
      console.log(res.data);
      if (res.data.status.$numberDecimal === "2") {
        setDisBtn(true);
      } else {
        setDisBtn(false);
      }
      setPK(res.data);
      //chuyen danh sach thu thuat
      setTempDate([
        ...res.data.medicalService.map((i) => [
          new Date(i.createdAt).toLocaleDateString("en-GB"),
        ]),
      ]);
      setCurrentItemList([
        ...res.data.medicalService.map((i) => [
          new Date(i.createdAt).toLocaleDateString("en-GB"),
          i.serviceName,
          i.servicePrice.$numberDecimal,
          [{ name: i.techStaff, id: i.techStaffId }],
          [{ id: 0, label: "Chưa thực hiện" }],
          i.serviceId,
        ]),
      ]);
      setTotalPrice(Number(res.data.totalAmount.$numberDecimal));
      setCusPayment(Number(res.data.customerPayment.$numberDecimal));
      setSingleSelectionsDoc([
        { id: res.data.doctorId, name: res.data.doctor },
      ]);

      if (res.data.reExamination !== null) {
        setBirthDay(new Date(res.data.reExamination));
      } else setBirthDay(null);
    } catch (error) {
      console.log(error);
    }
  };

  const addPk = async () => {
    try {
      const res = await axios({
        url: "/api/customer/updateCustomerWithMedical",
        method: "put",
        data: {
          customerId: pk.customerId,
          dentalMedicalHistory: pk.dentalMedicalHistory,
          systemicMedicalHistory: pk.systemicMedicalHistory,
        },
      });
      const ress = await axios({
        url: `/api/medicalPaper/${pk._id}`,
        method: "put",
        data: {
          doctorId: pk.doctorId,
          customerId: pk.customerId,
          reExamination: pk.reExamination,
          medicalService: pk.medicalService,
          note: pk.note,
          totalAmount: totalPrice,
        },
      });
    } catch (error) {
      console.log(error);
    }

    handleClose();
    loadData();
    //reset data after submit
    setCurrentItemList([]);
    setSingleSelectionsDoc([]);
    setSingleSelections([]);
    setBirthDay(null);
  };

  const loadTechStaffData = () => {
    axios
      .get("/api/profile/getTechStaffToday")
      .then((response) => {
        setTechStaff([
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

  const loadDocData = () => {
    axios
      .get("/api/profile/getDoctorToday")
      .then((response) => {
        setDocList([
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

  const loadCustomerData = () => {
    axios
      .get("/api/customer/allCustomer")
      .then((response) => {
        setCustomerId([
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

  const handleClose = () => {
    closeModal();
    closeMedpaper();
  };

  const [services, setServices] = useState([]);

  const [searchMeds, setSearchMeds] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  const getSerListIDFT = async () => {
    try {
      const res = await axios({
        url: `/api/medicalPaper/${PKID}`,
        method: "get",
      });
      setSerListID([]);
      let listTemp = [];
      res.data.medicalService.map((i) => {
        // console.log(1);
        let temp = 0;
        listTemp.map((e) => {
          if (e.serID === i.serviceId) temp++;
        });
        if (temp === 0) {
          listTemp.push({ serID: i.serviceId, count: 1 });
        } else {
          let t = listTemp.find((obj) => {
            return obj.serID === i.serviceId;
          });
          t.count += 1;
        }
      });

      setSerListID([...serListID, ...listTemp]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (PKID) {
      // loadCurPK();
      loadServiceTable();
      // loadSystemMed();
      // loadDentalMed();
      // loadCustomerData();
      // loadDocData();
      // loadTechStaffData();
      // getSerListIDFT();
    }
  }, [offset, searchMeds, PKID]);

  useEffect(() => {
    if (PKID) {
      loadCurPK();
      getSerListIDFT();
      loadSystemMed();
      loadDentalMed();
      loadCustomerData();
      loadDocData();
      loadTechStaffData();
    }
  }, [isVisible]);

  const onChangePage = (current, pageSize) => {
    // console.log(current, pageSize);
    setOffset(current - 1);
    setLimit(pageSize);
  };

  const onPrintInvoice = async () => {
    const response = await axios
      .get(`/api/invoice?medicalPaperId=${PKID}`, {
        responseType: "arraybuffer",
        headers: {
          Accept: "application/pdf",
        },
      })
      .then(async (response) => {
        const pdfBlod = new Blob([response], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlod);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "prescription.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
        const pdfWindow = window.open();
        pdfWindow.location.href = url;
      });
  };
  const loadServiceTable = async () => {
    await axios
      .get(
        `/api/service/activeService?keyword=${searchMeds}&offset=${offset}&limit=${limit}`
      )
      .then((response) => {
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
  };
  const loadDentalMed = async () => {
    const response = await axios
      .get("/api/dentalMedicalHistory")
      .catch((err) => {
        console.log(err);
      });
    setDentalMed(response.data);
  };

  //PAGINATION
  // We start with an empty list of items.

  //fill Data from chonsen SingleSelection - chưa xoá được
  const fillCusDataByName = async (e) => {
    // console.log("????");
    // console.log(e[0].id);
    const response = await axios.get(`api/customer/${e[0].id}`);
    //fill Data
    // setSelectedCus(response.data);
    // console.log(response.data);

    setPK({
      ...pk,
      customerId: e[0].id,
      systemicMedicalHistory: response.data.systemicMedicalHistory,
      dentalMedicalHistory: response.data.dentalMedicalHistory,
    });
  };

  const [currentItemList, setCurrentItemList] = useState([]);

  useEffect(() => {
    setPK({
      ...pk,
      medicalService: [
        ...currentItemList.map((item, index) => {
          return {
            serviceId: item[5],
            ktvId: item[3] && item[3][0] ? item[3][0].id : "",
            status: item[4] && item[4][0] ? item[4][0].id : "",
          };
        }),
      ],
    });
  }, [currentItemList]);

  const [curDate, setCurDate] = useState(new Date());

  const addCurrentItems = (id, name, price) => {
    console.log(serListID);
    let curDate = new Date().toLocaleDateString("en-GB");
    setTotalPrice(totalPrice + Number(price));
    setCurrentItemList([
      ...currentItemList,
      [curDate, name, price, [], op.slice(0, 1), id],
    ]);

    let temp = [];
    serListID.map((i) => {
      temp.push(i.serID);
    });
    // console.log(temp);

    //get id of service when add service to list - can lay serID cua ca chuoi so sanh
    // if () {
    if (!temp.includes(id)) {
      //add moi
      setSerListID([...serListID, { serID: id, count: 1 }]);
    } else {
      //neu co roi thi count+1
      let t = serListID.find((obj) => {
        return obj.serID === id;
      });
      t.count += 1;
    }

    console.log(serListID);
  };

  const deleteCurrentItems = (rowIndex, price, id) => {
    let temp = currentItemList;
    temp.splice(rowIndex, 1);
    setCurrentItemList([...temp]);
    setTotalPrice(totalPrice - price);

    //xoa id khoi serListID
    let tID = [];
    serListID.map((i) => {
      tID.push(i.serID);
    });
    if (tID.includes(id)) {
      let t = serListID.find((obj) => {
        return obj.serID === id;
      });
      // if (t.count > 1) {
      t.count -= 1;
      // }
      if (t.count === 0) {
        let pos = tID.indexOf(id);
        serListID.splice(pos, 1);
      }
    }

    setPK({ ...pk, medicalService: currentItemList });
  };

  // const calPayment = (payment) => {
  //   setChangeMoney(payment - totalPrice);
  // };

  return (
    <>
      {/* <Button
        variant="success"
        onClick={handleShow}
        style={{ marginRight: "20px" }}
      >
        
      </Button> */}
      {/* <div onClick={handleShow}>
        <FaRegEye></FaRegEye>
      </div> */}

      <Modal
        id="medPaperModal"
        show={isVisible}
        onHide={handleClose}
        style={{ opacity: `${opac}` }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ marginRight: "30px" }}>
            Thêm thông tin Phiếu khám - DOC
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormAntd name="basic" onFinish={addPk}>
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
                          if (role) {
                            addCurrentItems(
                              ser._id,
                              ser.name,
                              ser.price.$numberDecimal
                            );
                          }
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
                    id="phone"
                    type="number"
                    placeholder={new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalPrice)}
                  />
                </Col>
              </Row>

              <Row>
                <Form.Label column style={{ marginLeft: "5px" }}>
                  <b>Tiền khách trả</b>
                </Form.Label>
                <Col>
                  <Form.Control
                    // style={{ backgroundColor: "#ecf0f1" }}
                    plaintext
                    readOnly
                    // id="phone"
                    type="number"
                    placeholder={new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "VND",
                    }).format(cusPayment)}
                    onChange={(e) => {
                      // calPayment(e.target.value);
                      // setPayment(e.target.value)
                      // console.log(payment.toLocaleString("en-US"));
                    }}
                  />
                </Col>
              </Row>

              <Row>
                <Form.Label column style={{ marginLeft: "5px" }}>
                  <b>Còn nợ</b>
                </Form.Label>
                <Col>
                  <Form.Control
                    plaintext
                    readOnly
                    id="phone"
                    type="number"
                    placeholder={
                      totalPrice - cusPayment > 0
                        ? new Intl.NumberFormat("de-DE", {
                            style: "currency",
                            currency: "VND",
                          }).format(totalPrice - cusPayment)
                        : new Intl.NumberFormat("de-DE", {
                            style: "currency",
                            currency: "VND",
                          }).format(0)
                    }
                  />
                </Col>
              </Row>

              <hr style={{ marginTop: "8px", marginBottom: "4px" }} />
              <div
                style={{
                  textAlign: "center",
                  // alignItems: "center",
                  // justifyContent: "center",
                }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  // onClick={handleShow}
                  style={{
                    width: "50%",
                    marginBottom: "8px",
                    display: "inline-block",
                    // marginLeft: "auto",
                    // marginRight: "auto",
                  }}
                >
                  Lưu lại
                </Button>
              </div>

              {!role && (
                <>
                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {/* thay doi bang Payment modal */}
                    <Payment
                      PKID={pk._id}
                      // changeMoney={changeMoney}
                      // setChangeMoney={setChangeMoney}
                      setCusPayment={setCusPayment}
                      cusPayment={cusPayment}
                      totalPrice={totalPrice}
                      closeMedPaper={closeMedpaper}
                      openMedPaper={openMedPaper}
                      loadDataFilterByDate={loadData}
                      dis={disBtn}
                    />
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <Button
                      style={{
                        backgroundColor: "#2ecc71",
                        width: "50%",
                        marginBottom: "8px",
                        display: "inline",
                      }}
                      onClick={onPrintInvoice}
                    >
                      In Phiếu thu
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div id="serviceMiddle">
              <Row
                className="mb-3"
                style={{
                  margin: "auto",
                  padding: "5px",
                  backgroundColor: "#ecf0f1",
                }}
              >
                <Form.Label column sm={1}>
                  <b>Ngày</b>
                </Form.Label>
                <Col sm={2}>
                  <div style={{ marginTop: "5px" }}>
                    <DatePicker
                      selected={nt}
                      dateFormat="dd/MM/yyyy"
                      disabled
                    />
                  </div>
                </Col>
                <Col sm={1}></Col>

                <Form.Label column sm={1} style={{ width: "12%" }}>
                  <b>Tái khám</b>
                </Form.Label>
                <Col sm={2}>
                  <div style={{ marginTop: "5px" }}>
                    <DatePicker
                      selected={birthDay}
                      dateFormat="dd/MM/yyyy"
                      onChange={(e) => {
                        setPK({
                          ...pk,
                          reExamination: e,
                        });
                        setBirthDay(e);
                      }}
                      minDate={new Date()}
                    />
                  </div>
                </Col>
              </Row>

              <Row
                className="mb-3"
                style={{
                  margin: "5px",
                }}
              >
                <Form.Label column sm={4}>
                  Mã Phiếu khám
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
                    value={`${pk._id}`}
                  />
                </Col>
              </Row>

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
                    value={`${pk.staff}`}
                  />
                </Col>
              </Row>
              <Row className="mb-3" style={{ margin: "5px" }}>
                <Form.Label column sm={4}>
                  Bác sỹ
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
                    id="BS"
                    type="text"
                    disabled
                    value={`${pk.doctor}`}
                  />
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
                  <Form.Control
                    id="KH"
                    type="text"
                    disabled
                    value={`${pk.customer}`}
                  />
                </Col>
              </Row>
              <Row className="mb-3" style={{ margin: "5px" }}>
                <Col sm={4}></Col>

                <Col sm={4}>
                  {/* Đơn thuốc */}

                  {role && (
                    <MedListPaper
                      PKID={pk._id}
                      closeMedPaper={closeMedpaper}
                      openMedPaper={openMedPaper}
                      singleSelectionsDoc={singleSelectionsDoc}
                      serListID={serListID}
                    />
                  )}
                </Col>
              </Row>
              <hr style={{ marginTop: "8px", marginBottom: "4px" }} />
              <Table striped hover style={{ textAlign: "center" }}>
                <thead>
                  <tr>
                    <th>
                      <b>Ngày</b>
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
                          <td style={{ width: "1%" }}>{row[0]}</td>
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
                              initialValue={row[3]}
                            >
                              <Typeahead
                                disabled={role ? false : true}
                                style={{ width: "100%", margin: "auto" }}
                                id="basic-typeahead-single"
                                labelKey="name"
                                onChange={(e) => {
                                  row[3] = e;

                                  setPK({
                                    ...pk,
                                    medicalService: [
                                      ...currentItemList.map((item, index) => {
                                        return {
                                          serviceId: item[5],
                                          ktvId:
                                            item[3] && item[3][0]
                                              ? item[3][0].id
                                              : "",
                                          status:
                                            item[4] && item[4][0]
                                              ? item[4][0].id
                                              : "",
                                        };
                                      }),
                                    ],
                                  });
                                }}
                                options={techStaff}
                                placeholder="Chọn kĩ thuật viên"
                                selected={row[3]}
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
                              initialValue={row[4]}
                            >
                              <Typeahead
                                disabled
                                style={{ width: "100%", margin: "auto" }}
                                id="basic-typeahead-single"
                                onChange={(e) => {
                                  row[4] = e;

                                  setPK({
                                    ...pk,
                                    medicalService: [
                                      ...currentItemList.map((item, index) => {
                                        return {
                                          serviceId: item[5],
                                          ktvId:
                                            item[3] && item[3][0]
                                              ? item[3][0].id
                                              : "",
                                          status:
                                            item[4] && item[4][0]
                                              ? item[4][0].id
                                              : "",
                                        };
                                      }),
                                    ],
                                  });

                                  let tempSelect = singleSelectionsStatus;
                                  tempSelect[rowIndex] = e;
                                  setSingleSelectionsStatus([...tempSelect]);
                                }}
                                options={op}
                                placeholder="Chọn Trạng thái"
                                selected={row[4]}
                              />
                            </FormAntd.Item>
                          </td>

                          <td
                            onClick={() => {
                              if (role) {
                                Swal.fire({
                                  title: "Bạn có chắc chắn muốn xoá",
                                  showDenyButton: true,
                                  // showCancelButton: true,
                                  confirmButtonText: "Xoá",
                                  denyButtonText: `Huỷ`,
                                }).then((result) => {
                                  /* Read more about isConfirmed, isDenied below */
                                  if (result.isConfirmed) {
                                    // Swal.fire('Saved!', '', 'success')
                                    deleteCurrentItems(
                                      rowIndex,
                                      row[2],
                                      row[5]
                                    );
                                  } else if (result.isDenied) {
                                    // Swal.fire('Changes are not saved', '', 'info')
                                  }
                                });
                              }
                            }}
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
                          pk.systemicMedicalHistory &&
                          pk.systemicMedicalHistory.includes(sys._id)
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          const targetState = e.target.checked;
                          let tempCus = { ...pk };
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
                          setPK({
                            ...pk,
                            systemicMedicalHistory:
                              tempCus.systemicMedicalHistory,
                          });
                          // setSelectedCus({ ...tempCus });
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
                    <>
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
                            pk.dentalMedicalHistory &&
                            pk.dentalMedicalHistory.includes(den._id)
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            const targetState = e.target.checked;
                            let tempCus = { ...pk };
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
                                tempCus.dentalMedicalHistory.splice(
                                  deletePos,
                                  1
                                );
                            }
                            setPK({
                              ...pk,
                              dentalMedicalHistory:
                                tempCus.dentalMedicalHistory,
                            });
                            // setSelectedCus({ ...tempCus });
                          }}
                          // onChange={formik.handleChange}
                          style={{ width: "162px" }}
                          // style={{ width: "200%" }}
                        />
                      </Col>
                    </>
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
                  <Form.Control
                    value={pk.note}
                    id="gc"
                    type="text"
                    as="textarea"
                    rows={3}
                    onChange={(e) => {
                      setPK({ ...pk, note: e.target.value });
                      setNote(e.target.value);
                    }}
                  />
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

export default DocMedicalPaperModal;
