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
import UploadAndDisplayImage from "../../components/uploadImage";
import axios from "../../apis/api";

const MedicineModal = ({ userA }, prop) => {
  const { loadData } = prop;
  const [show, setShow] = useState(false);
  const [temp, setTemp] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      imageUrl: null,
      quantity: 0,
      price: 0,
      purchasePrice: 0,
      effect: "",
      usage: "",
      contraindication: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Bắt buộc")
        .min(4, "Tên phải lớn hơn 4 kí tự")
        .test(
          "Tên độc nhất",
          "Tên đang được sử dụng", // <- key, message
          function (value) {
            return new Promise((resolve, reject) => {
              axios
                .get(`/api/medicine/checkName/${value}`)
                .then((res) => {
                  if (res.success === 1) resolve(true);
                  else resolve(false);
                })
                .catch((error) => {
                  if (error.response.data.content === "Tên đã bị lấy") {
                    resolve(false);
                  }
                });
            });
          }
        ),
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
      formData.append("name", values.name);
      formData.append("imageUrl", values.imageUrl[0]);
      formData.append("quantity", values.quantity);
      formData.append("price", values.price);
      formData.append("purchasePrice", values.purchasePrice);
      formData.append("effect", values.effect);
      formData.append("usage", values.usage);
      formData.append("contraindication", values.contraindication);
      handleClose();
      values.name = "";
      values.imageUrl = "";
      values.quantity = 0;
      values.price = 0;
      values.purchasePrice = 0;
      values.effect = "";
      values.usage = "";
      values.contraindication = "";
      await addMed(formData, navigate);
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
  useEffect(() => {
    getPermission("Quản lý thuốc");
  }, []);

  const getPermission = async (functionName) => {
    if (userA.role[0].name === "Admin") {
      setTemp(true);
      return;
    }
    const functionArray = await axios({
      url: `/api/function`,
      method: "get",
    });
    const index = findIndexByProperty(functionArray.data, "name", functionName)

    await Promise.all(userA.role.map(async (element) => {
      const permission = await axios({
        url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
        method: "get",
      })
      if (permission.success === 0 || !permission.data) return;
      if (permission.data[0].add === true) {
        setTemp(true);
        return;
      }
    }))
    return;
  }
  return (
    <>
      {temp === true ? (
        <Button
          variant="success"
          onClick={handleShow}
          style={{ marginRight: "20px" }}
        >
          <FaPlusCircle></FaPlusCircle> Thêm thuốc
        </Button>
      ) : null}


      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin thuốc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <MedicineForm></MedicineForm> */}
          <>
            <Form onSubmit={formik.handleSubmit}>
              <Row className="mb-3">
                <Form.Group
                  className="mb-3"
                  as={Col}
                  controlId="formGroupPassword"
                >
                  <Form.Label column sm={12}>
                    Tên thuốc{" "}
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
                    Hình ảnh{" "}
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
                    permission = {temp}
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
                    Lượng/SP{" "}
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
                    placeholder="0"
                    // value={formik.values.quantity}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.quantity && (
                    <p className="errorMsg"> {formik.errors.quantity} </p>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" as={Col}>
                  <Form.Label column sm={12}>
                    Giá bán{" "}
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
                    Công dụng{" "}
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
                    type="text"
                    placeholder=""
                    onChange={formik.handleChange}
                  />
                  {formik.errors.effect && (
                    <p className="errorMsg"> {formik.errors.effect} </p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" as={Col}>
                  <Form.Label column sm={12}>
                    Giá nhập{" "}
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
                        onChange={formik.handleChange}
                        placeholder="0"
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
                    Cách sử dụng{" "}
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
                    Chống chỉ định{" "}
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

export default MedicineModal;
