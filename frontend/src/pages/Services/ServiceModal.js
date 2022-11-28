import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
// import Modal from "react-bootstrap/Modal";
import { FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from "react-bootstrap/Table";
import { FaTrashAlt } from "react-icons/fa";
import serviceProcessor from "../../apis/serviceProcessor";
import { useSelector } from "react-redux";
import UploadAndDisplayImage from "../../components/uploadImage";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../apis/api";
import { Typeahead } from "react-bootstrap-typeahead";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Select, Modal, Button as Butt, Input, Form as FormAntd } from "antd";
// import { Modal, Button as Butt } from "antd";
// import {
//   Select,
//   // Modal,
//   // Button as Butt,
//   Input,
//   Form as FormAntd,
// } from "formik-antd";

const ServiceModal = ({ loadData }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    criteriaMode: "all",
  });

  const [consumableUiList, setConsumableUiList] = useState([]);
  const [numberOfUses, setNumberOfUses] = useState(0);
  const [singleSelections, setSingleSelections] = useState([]);
  const [singleSelectionsPre, setSingleSelectionsPre] = useState([]);
  const [errorList, setErrorList] = useState({});

  const [validated, setValidated] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      imageUrl: null,
      time: 0,
      price: 0,
      note: "",
      // consumableArray: [{ numberOfUses: 0 }],
      // numberOfUses: 0,
      quantity: 0,
      usage: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Bắt buộc")
        .min(4, "Must be 4 characters or more"),
      imageUrl: Yup.mixed().required("Bắt buộc"),
      time: Yup.number()
        .required("Bắt buộc")
        .positive("Phải là số dương")
        .integer("Phải là số tự nhiên"),
      price: Yup.number().required("Bắt buộc").positive("Phải là số dương"),
      note: Yup.string(),
      // numberOfUses: Yup.number()
      //   .required("Bắt buộc")
      //   .positive("Phải là số dương"),
      // consumableArray: Yup.array().of(
      //   Yup.object().shape({
      //     numberOfUses: Yup.number()
      //       .required("Bắt buộc")
      //       .positive("Phải là số dương"),
      //   })
      // ),
    }),
    onSubmit: async (values) => {
      console.log(values);

      // let tempError = { medicineNameError: [] };
      // singleSelections.forEach((item, index) => {
      //   if (!item) {
      //     tempError.medicineNameError[index] = "Bắt buộc";
      //   }
      // });
      // if (tempError.medicineNameError.length > 0) {
      //   setErrorList(tempError);
      //   return;
      // }
      // if (singleSelections.length === 0) {
      //   setErrorList({ ...tempError, medicineNameError: ["Bắt buộc"] });
      //   return;
      // }

      // const form = values.currentTarget;
      // if (form.checkValidity() === false) {
      //   values.preventDefault();
      // }

      // setValidated(true);

      let formData = new FormData();
      formData.append("name", values.name);
      formData.append("imageUrl", values.imageUrl[0]);
      formData.append("time", values.time);
      formData.append("price", values.price);
      formData.append("note", values.note);
      for (var i = 0; i < consumableUiList.length; i++) {
        const tempOb = {
          medicineId: consumableUiList[i][0],
          numberOfUses: consumableUiList[i][4],
          // numberOfUses: values.numberOfUses,
        };
        formData.append("consumable[]", JSON.stringify(tempOb));
      }

      for (var i = 0; i < prescriptionList.length; i++) {
        const tempOb = {
          medicineId: prescriptionList[i][0],
          quantity: prescriptionList[i][4],
          usage: prescriptionList[i][5],
        };
        formData.append("prescription[]", JSON.stringify(tempOb));
      }

      for (var pair of formData.values()) {
        console.log(typeof pair);
      }

      handleClose();
      values.name = "";
      values.imageUrl = null;
      values.time = 0;
      values.price = 0;
      values.note = "";
      setConsumableUiList([]);
      setPrescriptionList([]);

      await serviceProcessor.addService(formData);
      loadData();
      // for (const value of formData.values()) {
      //   console.log(value);
      // }
      // await loadData();
    },
  });

  const [meds, setMeds] = useState([]);

  const [suggestionList, setSuggestionList] = useState([]);
  // const { Control } = Form;

  const fillData = (e, rowIndex) => {
    // let tempList = consumableUiList;
    // console.log(consumableUiList);
    // console.log(e);

    const searchResult = meds.find((item) => item.name === e);

    console.log(searchResult);

    if (searchResult) {
      consumableUiList[rowIndex][0] = searchResult._id;
      // consumableUiList[rowIndex][1] = e[0];
      consumableUiList[rowIndex][2] = searchResult.quantity;
      consumableUiList[rowIndex][3] = searchResult.unit;
      // consumableUiList[rowIndex][4] = numberOfUses;

      setConsumableUiList(consumableUiList);
    } else {
      consumableUiList[rowIndex][0] = "";
      consumableUiList[rowIndex][2] = "";
      consumableUiList[rowIndex][3] = "";
      // setNumberOfUses(0);
    }
    // console.log("4");

    // setConsumableUiList([...tempList]);
    // console.log(consumableUiList[rowIndex]);
  };

  const fillDataPre = (e, rowIndex) => {
    const searchResult = meds.find((item) => item.name === e[0]);

    if (searchResult) {
      prescriptionList[rowIndex][0] = searchResult._id;
      prescriptionList[rowIndex][2] = searchResult.quantity;
      prescriptionList[rowIndex][3] = searchResult.unit;
      setPrescriptionList(prescriptionList);
    } else {
      prescriptionList[rowIndex][0] = "";
      prescriptionList[rowIndex][2] = "";
      prescriptionList[rowIndex][3] = "";
    }

    console.log(prescriptionList[rowIndex]);
  };

  // const [tempSuggestionList, setTempSuggestionList] = useState([]);
  const getMedicine = async () => {
    await axios.get(`/api/medicine/activeMedicine`).then((response) => {
      setMeds(response.data);

      let temp = [];
      temp.push(response.data.map((i) => i.name));
      for (var i = 0; i < temp[0].length; i++) {
        suggestionList.push({ value: temp[0][i] });
      }

      // tempSuggestionList.push(...response.data.map((i) => i.name));
      // setSuggestionList([...response.data.map((i) => i.name)]);
    });
  };

  const onChangee = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log(value);
  };

  useEffect(() => {
    getMedicine();
  }, []);

  // useEffect(() => {
  //   console.log(suggestionList);
  //   // console.log(tempSuggestionList);
  // }, [suggestionList]);

  const deleteConsumableUiList = (rowIndex) => {
    let temp = consumableUiList;
    temp.splice(rowIndex, 1);
    setConsumableUiList([...temp]);
  };

  //prescriptionList
  const [prescriptionList, setPrescriptionList] = useState([]);

  const deleteprescriptionList = (rowIndex) => {
    let temp = prescriptionList;
    temp.splice(rowIndex, 1);
    setPrescriptionList([...temp]);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const addConsumableRow = () => {
    // setIsShowSuggestion([...isShowSuggestion, true]);
    setConsumableUiList([...consumableUiList, ["", "", "", "", ""]]);
  };

  const addPrescriptionRow = () => {
    // setIsShowSuggestion1([...isShowSuggestion1, true]);
    setPrescriptionList([...prescriptionList, ["", "", "", "", "", ""]]);
  };

  const demo = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
    }

    setValidated(true);

    formik.handleSubmit(e);
  };

  const handleOkk = (value) => {
    formik.handleSubmit(value);
  };
  return (
    <>
      {/* Btn antd */}
      {/* <Button
        type="primary"
        onClick={handleShow}
        style={{ marginRight: "20px" }}
      >
        <FaPlusCircle></FaPlusCircle> Thêm thủ thuật
      </Button> */}

      {/* Btn react-bootstrap */}
      <Button
        variant="success"
        onClick={handleShow}
        style={{ marginRight: "20px" }}
      >
        <FaPlusCircle></FaPlusCircle> Thêm thủ thuật
      </Button>

      <Modal
        title="Thông tin thủ thuật"
        centered
        width={1500}
        // id="serviceModal"
        // class="modal-dialog modal-xl"
        open={show}
        onCancel={handleClose}
        onOk={handleOkk}
        footer={null}
      >
        {/* <Form onSubmit={handleSubmit(formik.handleSubmit)}> */}
        <FormAntd onFinish={formik.handleSubmit}>
          <Row className="mb-3">
            {/* <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Mã thủ thuật</Form.Label>
                  <Form.Control type="text" />
                </Form.Group> */}
            <Form.Group as={Col}>
              <Form.Label>Tên thủ thuật</Form.Label>
              {/* <Form.Control
                id="name"
                // name="name"
                onChange={formik.handleChange}
                // onChange={(value) => formik.setFieldValue("name", value)}
                placeholder="Nhập tên thủ thuật"
              /> */}

              <Input
                // id="name"
                name="name"
                placeholder="Nhập tên thủ thuật"
                onChange={formik.handleChange}
              ></Input>

              {formik.errors.name && (
                <p className="errorMsg"> {formik.errors.name} </p>
              )}
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group
              className="mb-3"
              as={Col}
              // controlId="formGroupPassword"
            >
              <Form.Label column sm={12}>
                Hình Ảnh
              </Form.Label>
              <UploadAndDisplayImage
                value={formik.values.imageUrl ? formik.values.imageUrl : []}
                onChange={(value) => {
                  // console.log(value);
                  if (value && value.length > 0) {
                    formik.values.imageUrl = value;
                  }
                }}
              />
              {formik.errors.imageUrl && (
                <p className="errorMsg"> {formik.errors.imageUrl} </p>
              )}
            </Form.Group>

            <Form.Group
              as={Col}
              // controlId="formGridEmail"
            >
              <Form.Label column sm={12}>
                Thời gian (phút)
              </Form.Label>
              <Form.Control
                id="time"
                type="text"
                // value={formik.values.time}
                onChange={formik.handleChange}
                placeholder="0"
              />
              {formik.errors.time && (
                <p className="errorMsg"> {formik.errors.time} </p>
              )}
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group className="mb-3" as={Col}>
              <Form.Label>Giá</Form.Label>
              <Row className="mb-3">
                <Form.Group className="mb-3" as={Col}>
                  <Form.Control
                    id="price"
                    type="text"
                    // value={formik.values.price}
                    onChange={formik.handleChange}
                    placeholder="0"
                  />{" "}
                  {formik.errors.price && (
                    <p className="errorMsg"> {formik.errors.price} </p>
                  )}
                </Form.Group>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3" as={Col}>
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                id="note"
                value={formik.values.note}
                onChange={formik.handleChange}
              />
              {formik.errors.note && (
                <p className="errorMsg"> {formik.errors.note} </p>
              )}
            </Form.Group>
          </Row>

          {/* ConsumableList */}
          <Row className="mb-3">
            <Col>
              <Form.Label style={{ marginBottom: "4px" }}>
                Sử dụng tiêu hao thuốc
              </Form.Label>
              <Button
                onClick={addConsumableRow}
                style={{
                  marginLeft: "10px",
                  padding: "12px",
                  paddingRight: "14px",
                  paddingLeft: "14px",
                }}
                variant="success"
              >
                <FaPlusCircle></FaPlusCircle>
              </Button>
            </Col>
          </Row>
          <hr style={{ margin: "0px" }}></hr>

          <Table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã thuốc</th>
                <th>Tên thuốc</th>
                <th>Lượng</th>
                <th>Đơn vị</th>
                <th>Số lần dùng</th>
              </tr>
            </thead>
            {consumableUiList.length > 0 && (
              <tbody>
                {consumableUiList.map((row, rowIndex) => {
                  return (
                    <tr>
                      <td style={{ width: "80px" }}>
                        <Form.Control
                          type="text"
                          disabled
                          value={rowIndex + 1}
                        />
                      </td>
                      <td>
                        <Form.Control disabled value={row[0]} />
                      </td>
                      <td>
                        <Select
                          style={{ width: "150px" }}
                          // defaultValue={suggestionList[0].value}
                          defaultValue={suggestionList[0].value}
                          // showSearch
                          placeholder="Select a person"
                          optionFilterProp="children"
                          onChange={(e) => {
                            // onChangee(e);
                            fillData(e, rowIndex);
                          }}
                          // onSearch={(e) => {
                          //   onSearch(e);
                          // }}
                          filterOption={(input, option) =>
                            (option?.value ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={suggestionList}
                        />
                        {/* <Typeahead
                            id="basic-typeahead-single"
                            onChange={(e) => {
                              if (
                                errorList.medicineNameError &&
                                errorList.medicineNameError.length > 0
                              ) {
                                setErrorList({
                                  ...errorList,
                                  medicineNameError: [],
                                });
                              }
                              fillData(e, rowIndex);
                              let tempSelect = singleSelections;
                              tempSelect[rowIndex] = e;
                              setSingleSelections([...tempSelect]);
                            }}
                            options={suggestionList}
                            selected={singleSelections[rowIndex]}
                            placeholder="Chọn tên thuốc..."
                            // inputProps={{ required: false }}
                            // {...register(`Type${rowIndex}`, {
                            //   required: "Bắt buộc",
                            // })}
                          /> */}
                        {/* {errorList.medicineNameError && (
                              <span style={{ color: "red" }}>
                                {errorList.medicineNameError}
                              </span>
                            )} */}
                      </td>
                      <td>
                        {/* Lượng */}
                        <Form.Control type="number" value={row[2]} disabled />
                      </td>
                      <td>
                        {/* Đơn vị */}
                        <Form.Control
                          disabled
                          value={row[3]}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        {/* Số lần dùng */}
                        <Form.Control
                          // id={`consumableArray[${rowIndex}].numberOfUses`}
                          type="number"
                          // min="1"
                          // required
                          // defaultValue={1}
                          // value={numberOfUses === 0 ? "" : numberOfUses}
                          // onChange={formik.handleChange}
                          onChange={(e) => {
                            console.log(e.target.value);
                            // setNumberOfUses(e.target.value);
                            // setConsumableUiList[rowIndex][4](
                            //   e.target.value
                            // );
                            consumableUiList[rowIndex][4] = e.target.value;
                          }}
                        />
                      </td>

                      <td onClick={() => deleteConsumableUiList(rowIndex)}>
                        <FaTrashAlt
                          cursor="pointer"
                          color="#e74c3c"
                          style={{ transform: "translateY(7px)" }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </Table>

          <Row className="mb-3">
            <Col>
              <Form.Label style={{ marginBottom: "4px" }}>
                Sử dụng cho đơn thuốc
              </Form.Label>
              <Button
                onClick={addPrescriptionRow}
                style={{
                  marginLeft: "10px",
                  padding: "12px",
                  paddingRight: "14px",
                  paddingLeft: "14px",
                }}
                variant="success"
              >
                <FaPlusCircle></FaPlusCircle>
              </Button>
            </Col>
          </Row>
          <hr style={{ margin: "0px" }}></hr>
          <Table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã thuốc</th>
                <th>Tên thuốc</th>
                <th>Lượng</th>
                <th>Đơn vị</th>
                <th>Số Lượng</th>
                <th>Cách Dùng</th>
              </tr>
            </thead>
            {prescriptionList.length > 0 && (
              <tbody>
                {prescriptionList.map((row, rowIndex) => {
                  return (
                    <tr>
                      <td style={{ width: "80px" }}>
                        <Form.Control
                          type="text"
                          disabled
                          value={rowIndex + 1}
                        />
                      </td>
                      {/* Chinh sua o day */}
                      <td>
                        <Form.Control disabled value={row[0]} />
                      </td>
                      <td>
                        {/* Name Service thay bằng TypeHead*/}
                        <Typeahead
                          id="basic-typeahead-single"
                          onChange={(e) => {
                            fillDataPre(e, rowIndex);
                            let tempSelect = singleSelectionsPre;
                            tempSelect[rowIndex] = e;
                            setSingleSelectionsPre([...tempSelect]);
                          }}
                          options={suggestionList}
                          // onInputChange={(e) => {
                          //   fillDataPre(e, rowIndex);
                          //   let tempSelect = singleSelectionsPre;
                          //   tempSelect[rowIndex] = e;
                          //   setSingleSelectionsPre([...tempSelect]);
                          // }}
                          selected={singleSelectionsPre[rowIndex]}
                          placeholder="Chọn tên thuốc..."
                        />
                      </td>

                      <td>
                        {/* Lượng */}
                        <Form.Control type="number" value={row[2]} disabled />
                      </td>
                      <td>
                        {/* Đơn vị */}
                        <Form.Control
                          disabled
                          value={row[3]}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        {/* Số Lượng/SP */}
                        <Form.Control
                          type="number"
                          // required
                          // min={1}
                          onChange={(e) => {
                            prescriptionList[rowIndex][4] = e.target.value;
                          }}
                          // {...register(`Prescript${rowIndex}`, {
                          //   required: "Bắt buộc",
                          //   min: {
                          //     value: 1,
                          //     message: "Lớn hơn 1",
                          //   },
                          // })}
                        />
                        {/* <ErrorMessage
                              errors={errors}
                              name={`Prescript${rowIndex}`}
                              render={({ messages }) =>
                                messages &&
                                Object.entries(messages).map(
                                  ([type, message]) => (
                                    <p key={type} style={{ color: "red" }}>
                                      {message}
                                    </p>
                                  )
                                )
                              }
                            /> */}
                      </td>

                      <td>
                        {/* Cachs dung*/}
                        <Form.Control
                          type="text"
                          required
                          onChange={(e) => {
                            prescriptionList[rowIndex][5] = e.target.value;
                          }}
                          // {...register(`Prescriptusage${rowIndex}`, {
                          //   required: "Bắt buộc",
                          // })}
                        />
                        {/* <ErrorMessage
                              errors={errors}
                              name={`Prescriptusage${rowIndex}`}
                              render={({ messages }) =>
                                messages &&
                                Object.entries(messages).map(
                                  ([type, message]) => (
                                    <p key={type} style={{ color: "red" }}>
                                      {message}
                                    </p>
                                  )
                                )
                              }
                            /> */}
                      </td>
                      <td onClick={() => deleteprescriptionList(rowIndex)}>
                        <FaTrashAlt
                          cursor="pointer"
                          color="#e74c3c"
                          style={{ transform: "translateY(7px)" }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </Table>

          <Butt
            size="large"
            // type="submit"
            // variant="primary"
            htmlType="submit"
            type="primary"
            style={{
              // marginTop: "10px",
              borderRadius: "5px",
              width: "100px",
              // fontSize: "16px",
              // padding: "auto",
              // float: "right",
              // display: "inline-block",
              // textAlign: "center",
              // position: "relative",
              // bottom: "10px",
            }}
            // onClick={(e) => {
            //   console.log("1");
            // }}
          >
            Lưu lại
          </Butt>
          {/* <Butt
            style={{
              // float: "right",
              // display: "none",
              marginLeft: "10px",
              backgroundColor: "gray",
            }}
            onClick={handleClose}
          >
            Hủy bỏ
          </Butt> */}

          {/* </Form> */}
        </FormAntd>
      </Modal>
    </>
  );
};

export default ServiceModal;
