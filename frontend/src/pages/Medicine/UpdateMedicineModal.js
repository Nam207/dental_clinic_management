import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaPlusCircle, FaRedoAlt, FaEdit } from "react-icons/fa";
import MedicineForm from "./MedicineForm";
import { useNavigate, useParams } from "react-router-dom";
import { addMed } from "../../apis/medicineProcessor";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getMedDetailSuccess,
  getMedicineSuccess,
} from "../../redux/reducer/medicineSlice";
import medicineProcessor from "../../apis/medicineProcessor";
import Nav from "react-bootstrap/Nav";
import UploadAndDisplayImage from "../../components/uploadImage";
import Pagination from "react-bootstrap/Pagination";
import * as Yup from "yup";
import { useFormik } from "formik";

const UpdateMedicineModal = ({ medID, isVisible, closeModal, loadData }) => {
  const dispatch = useDispatch();

  const newMedicine = useSelector((state) => state.med.medDetail);

  useEffect(() => {
    medID && medicineProcessor.getMedicineDetailObj(medID);
  }, [medID]);

  const navigate = useNavigate();

  const [exDay, setExDay] = useState(new Date().toLocaleDateString("en-US"));

  const formik = useFormik({
    initialValues: {
      name: newMedicine.name,
      imageUrl: newMedicine.imageUrl,
      quantity: newMedicine.quantity,
      price: newMedicine.price.$numberDecimal,
      purchasePrice: newMedicine.purchasePrice.$numberDecimal,
      unit: newMedicine.unit,
      usage: newMedicine.usage,
      // expiredDay: new Date().toLocaleDateString("en-US"),
      // expiredDay: new Date(),
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Required")
        .min(4, "Must be 4 characters or more"),
      imageUrl: Yup.mixed().required("Bắt buộc"),
      quantity: Yup.number()
        .required("Required")
        .positive("Phải là số dương")
        .integer("Phải là số tự nhiên"),
      price: Yup.number()
        .required("Required")
        .positive("Phải là số dương")
        .moreThan(Yup.ref("purchasePrice"), "Giá bán phải lớn hơn giá nhập"),
      purchasePrice: Yup.number()
        .required("Required")
        .positive("Phải là số dương")
        .lessThan(Yup.ref("price"), "Giá nhập phải nhỏ hơn giá bán "),
      unit: Yup.string().required("Required"),
      usage: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("name", values.name);
      formData.append("imageUrl", values.imageUrl[0]);
      formData.append("quantity", values.quantity);
      formData.append("price", values.price);
      formData.append("purchasePrice", values.purchasePrice);
      formData.append("unit", values.unit);
      formData.append("usage", values.usage);
      // formData.append("expiredDay", values.expiredDay);
      formData.append("expiredDay", exDay);
      closeModal();
      console.log(values.imageUrl[0]);
      // values.expiredDay = new Date().toLocaleDateString("en-US");
      setExDay(new Date().toLocaleDateString("en-US"));
      // await addMed(formData, navigate);
      medicineProcessor.updateMedcine(formData);
      loadData();
    },
  });

  // const handleUpdateMedicine = (e) => {
  //   e.preventDefault();
  //   new Promise((resolve) => {
  //     resolve();
  //   })
  //     .then(() => {
  //       let formData = new FormData();
  //       formData.append("name", newMedicine.name);
  //       formData.append("imageUrl", newMedicine.imageUrl[0]);
  //       formData.append("quantity", newMedicine.quantity);
  //       formData.append("price", newMedicine.price);
  //       formData.append("purchasePrice", newMedicine.purchasePrice);
  //       formData.append("unit", newMedicine.unit);
  //       formData.append("usage", newMedicine.usage);
  //       formData.append("expiredDay", newMedicine.expiredDay);

  //       console.log("name: " + newMedicine.imageUrl[0]);
  //       medicineProcessor.updateMedcine(
  //         {
  //           ...newMedicine,
  //           // formData,
  //           price: newMedicine.price?.$numberDecimal,
  //           purchasePrice: newMedicine.purchasePrice?.$numberDecimal,
  //         },
  //         navigate
  //       );
  //       closeModal();
  //     })
  //     .then(() => {
  //       setTimeout(() => {
  //         loadData();
  //       }, 100);
  //     });
  // };

  return (
    <>
      <Modal size="lg" show={isVisible} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin thuốc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <Form onSubmit={formik.handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Mã thuốc</Form.Label>
                  <Form.Control disabled type="text" value={newMedicine._id} />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group
                  className="mb-3"
                  as={Col}
                  controlId="formGroupPassword"
                >
                  <Form.Label column sm={12}>
                    Tên thuốc
                  </Form.Label>
                  <Form.Control
                    id="name"
                    value={formik.values.name}
                    // onChange={(e) => {
                    //   // setNewMedicine({ ...newMedicine, name: e.target.value });
                    //   formik.handleChange();
                    // }}
                    onChange={formik.handleChange}
                    placeholder="Nhập tên thuốc"
                  />

                  {formik.errors.name && (
                    <p className="errorMsg"> {formik.errors.name} </p>
                  )}
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label column sm={12}>
                    Hình ảnh
                  </Form.Label>
                  <UploadAndDisplayImage
                    value={formik.values.imageUrl ? formik.values.imageUrl : []}
                    onChange={(value) => {
                      if (value && value.length > 0) {
                        formik.values.imageUrl = value;
                      }
                    }}
                  />
                  {formik.errors.imageUrl && (
                    <p className="errorMsg"> {formik.errors.imageUrl} </p>
                  )}
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group className="mb-3" as={Col}>
                  <Form.Label column sm={12}>
                    Lượng/SP
                  </Form.Label>
                  <Form.Control
                    id="quantity"
                    type="text"
                    placeholder="0"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.quantity && (
                    <p className="errorMsg"> {formik.errors.quantity} </p>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" as={Col}>
                  <Form.Label column sm={12}>
                    Giá bán
                  </Form.Label>

                  <Row className="mb-3">
                    <Form.Group className="mb-3" as={Col}>
                      <Form.Control
                        id="price"
                        type="text"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        placeholder="0"
                      />
                      {formik.errors.price && (
                        <p className="errorMsg"> {formik.errors.price} </p>
                      )}
                    </Form.Group>
                  </Row>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group className="mb-3" as={Col}>
                  <Form.Label column sm={12}>
                    Đơn vị
                  </Form.Label>
                  <Form.Control
                    id="unit"
                    type="text"
                    value={formik.values.unit}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.unit && (
                    <p className="errorMsg"> {formik.errors.unit} </p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" as={Col}>
                  <Form.Label column sm={12}>
                    Giá nhập
                  </Form.Label>
                  <Row className="mb-3">
                    <Form.Group className="mb-3" as={Col}>
                      <Form.Control
                        id="purchasePrice"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.purchasePrice}
                      />
                      {formik.errors.purchasePrice && (
                        <p className="errorMsg">
                          {formik.errors.purchasePrice}
                        </p>
                      )}
                    </Form.Group>
                  </Row>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group className="mb-3" as={Col}>
                  <Form.Label column sm={12}>
                    Cách sử dụng
                  </Form.Label>
                  <Form.Control
                    id="usage"
                    value={formik.values.usage}
                    onChange={formik.handleChange}
                    as="textarea"
                    rows={3}
                  />
                  {formik.errors.usage && (
                    <p className="errorMsg">{formik.errors.usage}</p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" as={Col}>
                  <Form.Label column sm={12}>
                    Ngày hết hạn
                  </Form.Label>

                  <DatePicker
                    selected={
                      // formik.values.expiredDay === ""
                      //   ? new Date()
                      //   : new Date(formik.values.expiredDay)
                      // formik.values.expiredDay
                      new Date(exDay)
                    }
                    dateFormat="MM/dd/yyyy"
                    onChange={(e) => {
                      setExDay(e);
                    }}
                  ></DatePicker>
                </Form.Group>
              </Row>

              <Button
                variant="primary"
                type="submit"
                style={{ float: "right" }}
              >
                Lưu lại
              </Button>
              <Button
                onClick={closeModal}
                style={{
                  float: "right",
                  marginRight: "10px",
                  backgroundColor: "gray",
                }}
              >
                Hủy bỏ
              </Button>
            </Form>
          </>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateMedicineModal;
