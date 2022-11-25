import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
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
      console.log("chay vao day");

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

  const demo = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
    }

    setValidated(true);
  };

  const [meds, setMeds] = useState([]);

  const [suggestionList, setSuggestionList] = useState([]);
  const { Control } = Form;
  //only MedID
  // const [selectedMed, setSelectedMed] = useState("");
  // const [selectedMedObj, setSelectedMedObj] = useState({});
  // const [isShowSuggestion, setIsShowSuggestion] = useState([]);
  // const [isShowSuggestion1, setIsShowSuggestion1] = useState([]);

  const [singleSelections, setSingleSelections] = useState([]);
  const [singleSelectionsPre, setSingleSelectionsPre] = useState([]);

  const fillData = (e, rowIndex) => {
    // let tempList = consumableUiList;
    // console.log(consumableUiList);

    const searchResult = meds.find((item) => item.name === e[0]);

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
    // setConsumableUiList([...tempList]);
    console.log(consumableUiList[rowIndex]);
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

  const getMedicine = async () => {
    await axios.get(`/api/medicine/activeMedicine`).then((response) => {
      setMeds(response.data);
      //get Names from list
      setSuggestionList([...response.data.map((i) => i.name)]);
    });
  };
  useEffect(() => {
    getMedicine();
  }, []);

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
    setConsumableUiList([...consumableUiList, ["", "", "", "", 2]]);
  };

  const addPrescriptionRow = () => {
    // setIsShowSuggestion1([...isShowSuggestion1, true]);
    setPrescriptionList([...prescriptionList, ["", "", "", "", "", ""]]);
  };

  //searchTextBox for ID
  // const searchTextBox = (data = [], rowIndex, colIndex) => {
  //   return (
  //     <div id="medCodeContainer" hidden={isShowSuggestion[rowIndex]}>
  //       <ul>
  //         {data.map((item) => {
  //           return (
  //             <li
  //               onClick={(e) => {
  //                 isShowSuggestion[rowIndex] = true;
  //                 setIsShowSuggestion([...isShowSuggestion]);
  //                 let tempList = consumableUiList;
  //                 tempList[rowIndex][colIndex] = e.target.textContent;

  //                 const searchResult = meds.find(
  //                   (item) => item.name === e.target.textContent
  //                 );
  //                 consumableUiList[rowIndex][colIndex - 1] = searchResult._id;
  //                 consumableUiList[rowIndex][colIndex] = searchResult.name;
  //                 consumableUiList[rowIndex][colIndex + 1] =
  //                   searchResult.quantity;
  //                 consumableUiList[rowIndex][colIndex + 2] = searchResult.unit;
  //                 setConsumableUiList(consumableUiList);

  //                 setConsumableUiList([...tempList]);
  //                 // setSelectedMed(e.target.textContent);
  //               }}
  //             >
  //               {item.name}
  //             </li>
  //           );
  //         })}
  //       </ul>
  //     </div>
  //   );
  // };

  // const searchTextBox1 = (data = [], rowIndex, colIndex) => {
  //   return (
  //     <div id="medCodeContainer" hidden={isShowSuggestion1[rowIndex]}>
  //       <ul>
  //         {data.map((item) => {
  //           return (
  //             <li
  //               onClick={(e) => {
  //                 isShowSuggestion1[rowIndex] = true;
  //                 setIsShowSuggestion1([...isShowSuggestion1]);
  //                 let tempList = prescriptionList;
  //                 tempList[rowIndex][colIndex] = e.target.textContent;

  //                 const searchResult = meds.find(
  //                   (item) => item.name === e.target.textContent
  //                 );
  //                 prescriptionList[rowIndex][colIndex - 1] = searchResult._id;
  //                 prescriptionList[rowIndex][colIndex] = searchResult.name;
  //                 prescriptionList[rowIndex][colIndex + 1] =
  //                   searchResult.quantity;
  //                 prescriptionList[rowIndex][colIndex + 2] = searchResult.unit;
  //                 setPrescriptionList(prescriptionList);
  //                 setPrescriptionList([...tempList]);
  //                 // setSelectedMed(e.target.textContent);
  //               }}
  //             >
  //               {item.name}
  //             </li>
  //           );
  //         })}
  //       </ul>
  //     </div>
  //   );
  // };

  return (
    <>
      <Button
        variant="success"
        onClick={handleShow}
        style={{ marginRight: "20px" }}
      >
        <FaPlusCircle></FaPlusCircle> Thêm thủ thuật
      </Button>
      <Modal
        id="serviceModal"
        // class="modal-dialog modal-xl"
        show={show}
        onHide={handleClose}
        // backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin thủ thuật</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <MedicineForm></MedicineForm> */}
          <>
            <Form
              onSubmit={formik.handleSubmit}
              // validated={validated}
              // noValidate
            >
              <Row className="mb-3">
                {/* <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Mã thủ thuật</Form.Label>
                  <Form.Control type="text" />
                </Form.Group> */}
                <Form.Group as={Col}>
                  <Form.Label>Tên thủ thuật</Form.Label>
                  <Form.Control
                    id="name"
                    // value={formik.values.name}
                    onChange={formik.handleChange}
                    placeholder="Nhập tên thủ thuật"
                  />
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
                            <Control
                              type="text"
                              disabled
                              value={rowIndex + 1}
                            />
                          </td>
                          <td>
                            <Form.Control disabled value={row[0]} />
                          </td>
                          <td>
                            {/* Name Service thay bằng TypeHead*/}
                            <Typeahead
                              id="basic-typeahead-single"
                              onChange={(e) => {
                                console.log(e + " Ơ" + rowIndex);
                                fillData(e, rowIndex);
                                let tempSelect = singleSelections;
                                tempSelect[rowIndex] = e;

                                setSingleSelections([...tempSelect]);
                                // console.log(tempSelect);
                              }}
                              options={suggestionList}
                              selected={singleSelections[rowIndex]}
                              // value={singleSelections[rowIndex]}
                              placeholder="Chọn tên thuốc..."
                            />
                            {/* <Form.Control.Feedback>
                              Đạt yêu c
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Nhập lại
                            </Form.Control.Feedback> */}
                          </td>
                          <td>
                            {/* Lượng */}
                            <Form.Control
                              type="number"
                              value={row[2]}
                              disabled
                            />
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
                              min="1"
                              required
                              // defaultValue={1}
                              // value={numberOfUses === 0 ? "" : numberOfUses}
                              // onChange={formik.handleChange}
                              onChange={(e) => {
                                // console.log(e.target.value);
                                setNumberOfUses(e.target.value);
                                // setConsumableUiList[rowIndex][4](
                                //   e.target.value
                                // );
                                consumableUiList[rowIndex][4] = e.target.value;
                              }}
                            />
                            {/* Nên thêm 1 cái error message */}
                            {/* <Form.Control.Feedback>
                              Đạt yêu c
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Nhập lại
                            </Form.Control.Feedback> */}
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
                            <Control
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
                            <Form.Control
                              type="number"
                              value={row[2]}
                              disabled
                            />
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
                              required
                              min={1}
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

export default ServiceModal;
