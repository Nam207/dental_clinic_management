import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaPlusCircle } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useFormik, Field } from "formik";
import * as Yup from "yup";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import customerProcessor from "../../apis/customerProcessor";
import axios from "../../apis/api";
import moment from "moment";
import { DatePicker } from "antd";
const CustomerModal = ({
  loadData,
  lbl,
  widthh,
  closeMedPaper,
  openMedPaper,
  userA,
}) => {
  const [show, setShow] = useState(false);
  const [temp, setTemp] = useState(false);
  const handleClose = () => {
    setShow(false);
    openMedPaper();
  };
  const handleShow = () => {
    setShow(true);
    closeMedPaper();
    // if(){

    // console.log(systemMed);
    // }
  };

  const [birthDay, setBirthDay] = useState(
    new Date().toLocaleDateString("en-US")
  );

  const [systemMed, setSystemMed] = useState([]);
  const [dentalMed, setDentalMed] = useState([]);

  const loadSystemMed = async () => {
    const response = await axios
      .get("/api/systemicMedicalHistory")
      .catch((err) => {
        console.log(err);
      });
    setSystemMed(response.data);
    // setSystemMed((systemMed) => [...systemMed, response.data]);
  };

  const loadDentalMed = async () => {
    const response = await axios
      .get("/api/dentalMedicalHistory")
      .catch((err) => {
        console.log(err);
      });
    setDentalMed(response.data);
  };

  useEffect(() => {
    loadDentalMed();
    loadSystemMed();
    getPermission("Quản lý khách hàng");
  }, []);

  const formik = useFormik({
    initialValues: {
      fullname: "",
      job: "",
      phone: "",
      address: "",
      gender: 0,
      bloodGroup: "unknown",
      email: "",
      dateOfBirth: null,
      note: "",
      systemicMedicalHistory: [],
      dentalMedicalHistory: [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      fullname: Yup.string().required("Nhập tên").min(4, "Tối thiểu 4 kí tự"),
      phone: Yup.string()
        .required("Nhập số điện thoại")
        .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Điền đúng số điện thoại")
        .test(
          "Số điện thoại độc nhất",
          "Số điện thoại đang được sử dụng", // <- key, message
          function (value) {
            return new Promise((resolve, reject) => {
              axios
                .get(`/api/customer/checkPhone/${value}`)
                .then((res) => {
                  if (res.success === 1) resolve(true);
                  else resolve(false);
                })
                .catch((error) => {
                  if (
                    error.response.data.content === "Số điện thoại đã bị lấy"
                  ) {
                    resolve(false);
                  }
                });
            });
          }
        ),
      email: Yup.string()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Điền đúng dạng email")
        .test(
          "Email độc nhất",
          "Email đang được sử dụng", // <- key, message
          function (value) {
            return new Promise((resolve, reject) => {
              axios
                .get(`http://localhost:9000/api/customer/checkEmail/${value}`)
                .then((res) => {
                  if (res.success === 1) resolve(true);
                  else resolve(false);
                })
                .catch((error) => {
                  if (error.response.data.content === "Email đã bị lấy") {
                    resolve(false);
                  }
                });
            });
          }
        ),
    }),
    onSubmit: async (values) => {
      await customerProcessor.addCustomer(values);
      values.fullname = "";
      values.job = "";
      values.phone = "";
      values.address = "";
      values.gender = 0;
      values.bloodGroup = "unknown";
      values.email = "";
      values.dateOfBirth = null;
      values.note = "";
      values.systemicMedicalHistory = [];
      values.dentalMedicalHistory = [];
      loadData();
      handleClose();
    },
  });

  const handleOnClick = () => {
    handleShow();
    closeMedPaper();
  };

  function findIndexByProperty(data, key, value) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][key] === value) {
        return i;
      }
    }
    return -1;
  }

  const getPermission = async (functionName) => {
    if (userA.role[0].name === "Admin") {
      setTemp(true);
      return;
    }
    const functionArray = await axios({
      url: `/api/function`,
      method: "get",
    });
    const index = findIndexByProperty(functionArray.data, "name", functionName);

    await Promise.all(
      userA.role.map(async (element) => {
        const permission = await axios({
          url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
          method: "get",
        });
        console.log(permission);
        if (permission.success === 0 || !permission.data) return;
        if (permission.data[0].add === true) {
          setTemp(true);
          return;
        }
      })
    );
    return;
  };
  return (
    <>
      {temp === true ? (
        <Button
          variant="success"
          onClick={handleShow}
          style={{ marginRight: "20px", width: `${widthh}` }}
        >
          <FaPlusCircle></FaPlusCircle> {lbl}
        </Button>
      ) : null}

      <Modal id="customerModal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nhập thông tin khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <MedicineForm></MedicineForm> */}
          <>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group
                className="mb-3"
                as={Row}
                controlId="formGroupPassword"
              >
                <Form.Label column sm={2}>
                  Tên khách hàng
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
                <Col sm={4}>
                  <Form.Control
                    id="fullname"
                    onChange={formik.handleChange}
                    placeholder="Nhập tên khách hàng"
                  />
                  {formik.errors.fullname && (
                    <p className="errorMsg"> {formik.errors.fullname} </p>
                  )}
                </Col>

                <Form.Label column sm={2}>
                  Nghề nghiệp
                </Form.Label>
                <Col sm={4}>
                  <Form.Control id="job" onChange={formik.handleChange} />
                </Col>
              </Form.Group>

              <Row className="mb-3">
                <Form.Label column sm={2}>
                  Số điện thoại
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
                <Col sm={4}>
                  <Form.Control
                    id="phone"
                    type="text"
                    placeholder="0"
                    onChange={formik.handleChange}
                  />
                  {formik.errors.phone && (
                    <p className="errorMsg"> {formik.errors.phone} </p>
                  )}
                </Col>
                <Form.Label column sm={2}>
                  Địa chỉ
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    id="address"
                    type="text"
                    onChange={formik.handleChange}
                    placeholder="Nhập địa chỉ"
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label column sm={2}>
                  Giới tính
                </Form.Label>
                <Col sm={4}>
                  <Form.Select
                    id="gender"
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  >
                    <option value="0">Không xác định</option>
                    <option value="1">Nam</option>
                    <option value="2">Nữ</option>
                  </Form.Select>
                </Col>

                <Form.Label column sm={2}>
                  Nhóm máu
                </Form.Label>
                <Col sm={4}>
                  <Form.Select
                    id="bloodGroup"
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  >
                    <option value="unknown">Không biết</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </Form.Select>
                </Col>
              </Row>

              <Row className="mb-3">
                <Form.Label column sm={2}>
                  Ngày sinh
                </Form.Label>

                <Col sm={4}>
                  <Form.Control
                    type="date"
                    value={formik.values.dateOfBirth}
                    // value="2018-06-22"
                    max={formik.values.dateOfBirth}
                    id="dateOfBirth"
                    onChange={formik.handleChange}
                  />
                  {/* <DatePicker
                    name="dateOfBirth"
                    onChange={formik.handleChange}
                  /> */}
                </Col>
                <Form.Label column sm={2}>
                  Ghi chú
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    id="note"
                    value={formik.values.note}
                    onChange={formik.handleChange}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Label column sm={2}>
                  Email
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    id="email"
                    onChange={formik.handleChange}
                    placeholder="Nhập email"
                  />
                  {formik.errors.email && (
                    <p className="errorMsg"> {formik.errors.email} </p>
                  )}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Label>
                    <b> Tiền sử bệnh toàn thân:</b>
                  </Form.Label>
                </Col>
              </Row>
              <Row className="mb-3">
                {systemMed.map((sys, inde) => {
                  return (
                    <Col sm={2}>
                      <Form.Check
                        inline
                        name="systemicMedicalHistory"
                        label={sys.name}
                        value={sys._id}
                        type="checkbox"
                        id={inde + 1}
                        onChange={formik.handleChange}
                      />
                    </Col>
                  );
                })}
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Label>
                    <b> Tiền sử bệnh răng miệng:</b>
                  </Form.Label>
                </Col>
              </Row>
              <Row className="mb-3">
                {dentalMed.map((den, index) => {
                  return (
                    <Col>
                      <Form.Check
                        inline
                        name="dentalMedicalHistory"
                        label={den.name}
                        value={den._id}
                        type="checkbox"
                        id={den._id}
                        onChange={formik.handleChange}
                      />
                    </Col>
                  );
                })}
              </Row>

              <Button
                type="submit"
                variant="primary"
                style={{ float: "right" }}
              >
                Lưu lại
              </Button>
              <Button
                style={{
                  float: "right",
                  marginRight: "10px",
                  backgroundColor: "gray",
                }}
                onClick={handleClose}
              >
                Hủy bỏ
              </Button>
            </Form>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomerModal;
