import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "../../apis/api";
import moment from 'moment';

const ModalTech = ({
  closeModal,
  isVisible,
  cusId,
}) => {
  const [curCustomer, setCurCustomer] = useState({});

  const getCustomer = async () => {
    const response = await axios.get(`api/customer/${cusId}`);
    setCurCustomer(response.data);
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

  useEffect(() => {
    if (cusId) {
      getCustomer();
      loadSystemMed();
      loadDentalMed();
    }
  }, [cusId, isVisible]);

  return (
    <>
      <Modal id="customerModal" size="lg" show={isVisible} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <MedicineForm></MedicineForm> */}
          <>
            <Form>
              <Row className="mb-3">
                <Form.Label column sm={2}>
                  Mã khách hàng
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    disabled
                    id="_id"
                    value={curCustomer._id}
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
                    readOnly
                    value={curCustomer.fullname}
                  />
                </Col>

                <Form.Label column sm={2}>
                  Nghề nghiệp
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    id="job"
                    readOnly
                    value={curCustomer.job}
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
                    aria-readonly
                    value={curCustomer.phone}
                  />
                </Col>
                <Form.Label column sm={2}>
                  Địa chỉ
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    id="address"
                    readOnly
                    type="text"
                    value={curCustomer.address}
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
                    disabled
                    value={curCustomer.gender}
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
                    disabled
                    id="bloodGroup"
                    value={curCustomer.bloodGroup}
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
                    disabled
                    value={moment(curCustomer.dateOfBirth).format("YYYY-MM-DD")}
                    id="dateOfBirth"
                  />
                </Col>
                <Form.Label column sm={2}>
                  Ghi chú
                </Form.Label>
                <Col sm={4}>
                  <Form.Control
                    id="note"
                    readOnly
                    value={curCustomer.note}
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
                    readOnly
                    value={curCustomer.email}
                    placeholder="Nhập email"
                  />
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
                    <Col sm={2}>
                      <Form.Check
                        id={sys._id}
                        inline
                        label={sys.name}
                        type="checkbox"
                        checked={
                          !curCustomer.systemicMedicalHistory ||
                          !curCustomer.systemicMedicalHistory.includes(
                            sys._id
                          )
                            ? false
                            : true
                        }
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
                          !curCustomer.dentalMedicalHistory ||
                          !curCustomer.dentalMedicalHistory.includes(den._id)
                            ? false
                            : true
                        }
                      />
                    </Col>
                  );
                })}
              </Row>
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

export default ModalTech;
