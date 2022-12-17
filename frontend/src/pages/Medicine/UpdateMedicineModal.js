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
import axios from "../../apis/api";
import * as Yup from "yup";
import { useFormik } from "formik";

const UpdateMedicineModal = ({ userU,medID, isVisible, closeModal, loadData }) => {
  const dispatch = useDispatch();
  console.log(userU)
  const [temp, setTemp] = useState(false);
  const newMedicine = useSelector((state) => state.med.medDetail);
  // const [newMedicine, setNewMedicine] = useState({});

  useEffect(() => {
    medID && medicineProcessor.getMedicineDetailObj(medID);
    if (medID) {
      getNewMedicine();
    }
  }, [medID]);

  const getNewMedicine = () => {
    const response = axios
      .get(`api/medicine/${medID}`)
      .then((response) => {
        // store.dispatch(getMedDetailSuccess(response.data));
        // console.log(response.data);
        // setNewMedicine(response.data);
      })
      .catch((err) => {
        console.log("Err: ", err);
      });
  };

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: newMedicine.name,
      imageUrl: newMedicine.imageUrl,
      quantity: newMedicine.quantity,
      price: newMedicine.price.$numberDecimal,
      purchasePrice: newMedicine.purchasePrice.$numberDecimal,
      effect: newMedicine.effect,
      usage: newMedicine.usage,
      contraindication: newMedicine.contraindication,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Bắt buộc")
        .min(4, "Tên phải lớn hơn 4 kí tự"),
      imageUrl: Yup.mixed().required("Bắt buộc"),
      quantity: Yup.number()
        .required("Bắt buộc")
        .positive("Phải là số dương")
        .integer("Phải là số tự nhiên"),
      price: Yup.number()
        .required("Bắt buộc")
        .positive("Phải là số dương")
        .moreThan(Yup.ref("purchasePrice"), "Giá bán phải lớn hơn giá nhập"),
      purchasePrice: Yup.number()
        .required("Bắt buộc")
        .positive("Phải là số dương")
        .lessThan(Yup.ref("price"), "Giá nhập phải nhỏ hơn giá bán "),
      effect: Yup.string().required("Bắt buộc"),
      usage: Yup.string().required("Bắt buộc"),
      contraindication: Yup.string().required("Bắt buộc"),
    }),
    onSubmit: async (values) => {
      let formData = new FormData();
      //string || object

      formData.append("name", values.name);
      formData.append("imageUrl", values.imageUrl[0]);
      formData.append("quantity", values.quantity);
      formData.append("price", values.price);
      formData.append("purchasePrice", values.purchasePrice);
      formData.append("effect", values.effect);
      formData.append("usage", values.usage);
      formData.append("contraindication", values.contraindication);
      closeModal();
      await medicineProcessor.updateMedcine(formData, medID);
      loadData();
    },
  });

  function findIndexByProperty(data, key, value) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][key] === value) {
        return i;
      }
    }
    return -1;
  }

  const getPermission = async (functionName) => {
    const functionArray = await axios({
      url: `/api/function`,
      method: "get",
    });
    const index = findIndexByProperty(functionArray.data, "name", functionName)

    await Promise.all(userU.role.map(async (element) => {
      const permission = await axios({
        url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
        method: "get",
      })
      if(permission.success === 0 || !permission.data) return;
      if(permission.data[0].edit === true ) {
        setTemp(true);
        return;
      }
    }))
    return;
  }

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
                    disabled
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
                  <UploadAndDisplayImage
                    value={formik.values.imageUrl ? formik.values.imageUrl : []}
                    onChange={(value) => {
                      if (value && value.length > 0) {
                        formik.values.imageUrl = value;
                      }
                      // console.log(value);
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
                  <Form.Control
                    id="quantity"
                    type="text"
                    readOnly={!temp}
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

                  <Row className="mb-3">
                    <Form.Group className="mb-3" as={Col}>
                      <Form.Control
                        id="price"
                        type="text"
                        readOnly={!temp}
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
                    Công dụng
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
                  <Form.Control
                    id="effect"
                    readOnly={!temp}
                    type="text"
                    value={formik.values.effect}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.effect && (
                    <p className="errorMsg"> {formik.errors.effect} </p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" as={Col}>
                  <Form.Label column sm={12}>
                    Giá nhập
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
                  <Row className="mb-3">
                    <Form.Group className="mb-3" as={Col}>
                      <Form.Control
                        id="purchasePrice"
                        type="text"
                        readOnly={!temp}
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
                  <Form.Control
                    id="usage"
                    readOnly={!temp}
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
                    Chống chỉ định
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
                  <Form.Control
                    id="contraindication"
                    readOnly={!temp}
                    value={formik.values.contraindication}
                    onChange={formik.handleChange}
                    as="textarea"
                    rows={3}
                  />
                  {formik.errors.contraindication && (
                    <p className="errorMsg">{formik.errors.contraindication}</p>
                  )}
                </Form.Group>
              </Row>
               {temp === true ? (
                <Button
                variant="primary"
                type="submit"
                style={{ float: "right" }}
              >
                Lưu lại
              </Button>
               ):null}
              {temp === true ? (
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
               ):null}
             
            </Form>
          </>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateMedicineModal;
