import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { addMed } from "../../apis/medicineProcessor";
const MedicineForm = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [datee, setDatee] = useState(new Date());

  const [newMedicine, setNewMedicine] = useState({
    _id: "",
    name: "",
    imageUrl: "",
    quantity: -1,
    price: -1,
    purchasePrice: -1,
    unit: -1,
    usage: "",
    expireDay: "",
  });

  const handleAddMedicine = (e) => {
    e.preventDefault();
    const response = addMed(newMedicine, navigate);
  };

  return (
    <>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Mã thuốc</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => {
                // set_id(e.target.value)
                setNewMedicine({ ...newMedicine, _id: e.target.value });
              }}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group className="mb-3" as={Col} controlId="formGroupPassword">
            <Form.Label>Tên thuốc</Form.Label>
            <Form.Control
              onChange={(e) => {
                setNewMedicine({ ...newMedicine, name: e.target.value });
              }}
            />
          </Form.Group>
          <Form.Group as={Col}>
            Hình ảnh
            <Form.Control
              onChange={(e) => {
                setNewMedicine({ ...newMedicine, imageUrl: e.target.value });
              }}
            />
            <img src={newMedicine.imageUrl} />
            {/* <UploadAndDisplayImage></UploadAndDisplayImage> */}
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group className="mb-3" as={Col}>
            <Form.Label>Lượng/SP</Form.Label>
            <Form.Control
              onChange={(e) => {
                setNewMedicine({ ...newMedicine, quantity: e.target.value });
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" as={Col}>
            <Form.Label>Giá bán</Form.Label>

            <Row className="mb-3">
              <Form.Group className="mb-3" as={Col}>
                <Form.Control
                  onChange={(e) => {
                    setNewMedicine({ ...newMedicine, price: e.target.value });
                  }}
                  defaultValue="0"
                />
              </Form.Group>
              <Form.Group className="mb-3" as={Col}>
                <Form.Control defaultValue="0" />
              </Form.Group>
            </Row>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group className="mb-3" as={Col}>
            <Form.Label>Công dụng</Form.Label>
            <Form.Control
              onChange={(e) => {
                setNewMedicine({ ...newMedicine, unit: e.target.value });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" as={Col}>
            <Form.Label>Giá nhập</Form.Label>
            <Row className="mb-3">
              <Form.Group className="mb-3" as={Col}>
                <Form.Control
                  onChange={(e) => {
                    setNewMedicine({
                      ...newMedicine,
                      purchasePrice: e.target.value,
                    });
                  }}
                  defaultValue="0"
                />
              </Form.Group>
              <Form.Group className="mb-3" as={Col}>
                <Form.Control defaultValue="0" />
              </Form.Group>
            </Row>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group className="mb-3" as={Col}>
            <Form.Label>Cách sử dụng</Form.Label>
            <Form.Control
              onChange={(e) => {
                setNewMedicine({ ...newMedicine, usage: e.target.value });
              }}
              as="textarea"
              rows={3}
            />
          </Form.Group>
          <Form.Group className="mb-3" as={Col}>
            <Form.Label>Chống chỉ định</Form.Label>
          
            <Form.Control
              onChange={(e) => {
                setNewMedicine({ ...newMedicine, contraindication: e.target.value });
              }}
              as="textarea"
              rows={3}
            />
          </Form.Group>
        </Row>
      </Form>
    </>
  );
};

export default MedicineForm;
