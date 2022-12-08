import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Button from "react-bootstrap/Button";
import axios from "../../apis/api";
import customerProcessor from "../../apis/customerProcessor";

const UpdateCustomerModal = ({ closeModal, isVisible, cusId, loadData }) => {
  const [curCustomer, setCurCustomer] = useState({});
  const [birthDay, setBirthDay] = useState("");

  const getCustomer = async () => {
    const response = await axios.get(`api/customer/${cusId}`);
    setCurCustomer(response.data);
    setBirthDay(
      new Date(response.data.dateOfBirth).toISOString().split("T")[0]
    );

    setCurStatus(response.data.status);
    setCurPhone(response.data.phone);
    setCurEmail(response.data.email);
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

  const [systemMed, setSystemMed] = useState([]);
  const [dentalMed, setDentalMed] = useState([]);
  const [curStatus, setCurStatus] = useState(false);
  const [curPhone, setCurPhone] = useState("");
  const [curEmail, setCurEmail] = useState("");

  useEffect(() => {
    if (cusId) {
      getCustomer();
      loadSystemMed();
      loadDentalMed();
      // console.log("asd");
    }
  }, [cusId, isVisible]);

  const formik = useFormik({
    initialValues: {
      fullname: curCustomer.fullname,
      job: curCustomer.job,
      phone: curCustomer.phone,
      address: curCustomer.address,
      gender: curCustomer.gender,
      bloodGroup: curCustomer.bloodGroup,
      email: curCustomer.email,
      dateOfBirth: birthDay,
      note: curCustomer.note,
      systemicMedicalHistory: curCustomer.systemicMedicalHistory,
      dentalMedicalHistory: curCustomer.dentalMedicalHistory,
      status: curStatus,
      // expiredDay: new Date().toLocaleDateString("en-US"),
      // expiredDay: new Date(),
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
                .get(`http://localhost:8080/api/customer/checkPhone/${value}`)
                .then((res) => {
                  if (res.success === 1 || curPhone === value) {
                    resolve(true);
                  } else resolve(false);
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
                .get(`http://localhost:8080/api/customer/checkEmail/${value}`)
                .then((res) => {
                  if (res.success === 1 || curEmail === value) resolve(true);
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
      // formData.append("expiredDay", values.expiredDay);
      //   formData.append("expiredDay", exDay);
      // console.log(values.status);
      closeModal();
      await customerProcessor.updateService(values, cusId);
      loadData();
    },
  });

  return (
    <>
      <Modal id="customerModal" size="lg" show={isVisible} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <MedicineForm></MedicineForm> */}
          <>
            <Form onSubmit={formik.handleSubmit}>
              <Row className="mb-3">
                <Form.Label column sm={2}>
                  Mã khách hàng
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    disabled
                    id="_id"
                    value={cusId}
                    onChange={formik.handleChange}
                  />
                </Col>
              </Row>
              <Form.Group className="mb-3" as={Row}>
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
                    value={formik.values.fullname}
                  />
                  {formik.errors.fullname && (
                    <p className="errorMsg"> {formik.errors.fullname} </p>
                  )}
                </Col>

                <Form.Label column sm={2}>
                  Nghề nghiệp
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    id="job"
                    onChange={formik.handleChange}
                    value={formik.values.job}
                  />
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
                    value={formik.values.phone}
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
                    value={formik.values.address}
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
                    value={formik.values.gender}
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
                    value={formik.values.bloodGroup}
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
                {/* <DatePicker
                    selected={new Date(birthDay)}
                    dateFormat="MM/dd/yyyy"
                    onChange={(e) => {
                      setBirthDay(e);
                    }}
                  ></DatePicker> */}
                <Col sm={4}>
                  <Form.Control
                    type="date"
                    value={formik.values.dateOfBirth}
                    max={formik.values.dateOfBirth}
                    id="dateOfBirth"
                    onChange={formik.handleChange}
                  />
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
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    placeholder="Nhập email"
                  />
                  {formik.errors.email && (
                    <p className="errorMsg"> {formik.errors.email} </p>
                  )}
                </Col>
                <Form.Label column sm={2}>
                  Tổng tiền nợ
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    disabled
                    id="usage"
                    onChange={formik.handleChange}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Label column sm={2}>
                  Status
                </Form.Label>

                <Col sm={2}>
                  <Form.Check
                    name="status"
                    type="radio"
                    label="Active"
                    id="active"
                    checked={curStatus}
                    onChange={(e) => {
                      setCurStatus(e.target.checked);
                      console.log(e.target.checked);
                    }}
                  />
                </Col>
                <Col sm={2}>
                  <Form.Check
                    name="status"
                    type="radio"
                    label="Inactive"
                    id="inactive"
                    checked={!curStatus}
                    onChange={(e) => {
                      setCurStatus(!e.target.checked);
                      console.log(!e.target.checked);
                    }}
                  />
                </Col>
                <Form.Label column sm={2}>
                  Đã thanh toán
                </Form.Label>
                <Col>
                  <Form.Control
                    disabled
                    id="usage"
                    value={formik.values.usage}
                    onChange={formik.handleChange}
                    placeholder="0"
                  />
                  {formik.errors.usage && (
                    <p className="errorMsg">{formik.errors.usage}</p>
                  )}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={6}></Col>

                <Form.Label column sm={2}>
                  Tổng tiền nợ
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    disabled
                    id="usage"
                    value={formik.values.usage}
                    onChange={formik.handleChange}
                    placeholder="0"
                  />
                  {formik.errors.usage && (
                    <p className="errorMsg">{formik.errors.usage}</p>
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
                {systemMed.map((sys, index) => {
                  return (
                    <Col>
                      <Form.Check
                        id={sys._id}
                        inline
                        label={sys.name}
                        type="checkbox"
                        checked={
                          !formik.values.systemicMedicalHistory ||
                          !formik.values.systemicMedicalHistory.includes(
                            sys._id
                          )
                            ? false
                            : true
                        }
                        onChange={(e) => {
                          const targetState = e.target.checked;
                          let tempCus = { ...formik.values };
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
                          setCurCustomer({ ...tempCus });
                        }}
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
                {dentalMed.map((den) => {
                  return (
                    <Col>
                      <Form.Check
                        inline
                        name="dentalMedicalHistory"
                        label={den.name}
                        value={den._id}
                        type="checkbox"
                        checked={
                          !formik.values.dentalMedicalHistory ||
                          !formik.values.dentalMedicalHistory.includes(den._id)
                            ? false
                            : true
                        }
                        id={den._id}
                        onChange={(e) => {
                          const targetState = e.target.checked;
                          let tempCus = { ...formik.values };
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
                          setCurCustomer({ ...tempCus });
                        }}
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
                onClick={closeModal}
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

export default UpdateCustomerModal;
