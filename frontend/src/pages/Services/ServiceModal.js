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
import {
  Select,
  Modal as ModalAntd,
  Button as Butt,
  Input,
  Form as FormAntd,
  InputNumber,
  Typography,
} from "antd";
import Swal from "sweetalert2";

// PHẦN này gồm typeahead trong Form.Item
const ServiceModal = ({ userA, loadData }) => {
  const { Text, Link } = Typography;
  const [form] = FormAntd.useForm();
  const [temp, setTemp] = useState(false);
  const [consumableUiList, setConsumableUiList] = useState([]);
  // const [numberOfUses, setNumberOfUses] = useState(0);
  const [singleSelections, setSingleSelections] = useState([]);
  const [singleSelectionsPre, setSingleSelectionsPre] = useState([]);
  const [errorList, setErrorList] = useState([]);
  const [errorListPre, setErrorListPre] = useState([]);

  const [validated, setValidated] = useState(false);

  const [numOfUseErr, setNumOfUseErr] = useState();

  const formik = useFormik({
    initialValues: {
      name: "",
      imageUrl: null,
      time: 0,
      price: 0,
      note: "",
      consumableArray: [{ medicineId: "", numberOfUses: "" }],
      // numberOfUses: 0,
      quantity: 0,
      usage: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Bắt buộc").min(4, "Nhập 4 kí tự trở lên"),
      imageUrl: Yup.mixed().required("Bắt buộc"),
      time: Yup.number()
        .required("Bắt buộc")
        .positive("Phải là số dương")
        .integer("Phải là số tự nhiên")
        .typeError("Nhập số phút"),
      price: Yup.number()
        .required("Bắt buộc")
        .positive("Phải là số dương")
        .typeError("Nhập số"),
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
      let isValid = true;

      consumableUiList.forEach((parent, parentIndex) => {
        parent.forEach((item, index) => {
          switch (index) {
            case 1:
              break;
            case 4:
              if (Number(item) < 1) {
                isValid = false;
              }
              break;
            default:
              break;
          }
        });
      });
      prescriptionList.forEach((parent, parentIndex) => {
        parent.forEach((item, index) => {
          switch (index) {
            case 1:
              break;
            case 4:
              if (Number(item) < 1) {
                isValid = false;
              }
              break;
            case 5:
              if (item === "") {
                isValid = false;
              }
              break;
            default:
              break;
          }
        });
      });

      if (!isValid) {
        return;
      }

      let formData = new FormData();
      formData.append("name", values.name);
      formData.append("imageUrl", values.imageUrl[0]);
      formData.append("time", values.time);
      formData.append("price", values.price);
      formData.append("note", values.note);
      for (var i = 0; i < consumableUiList.length; i++) {
        const tempOb = {
          medicineId: consumableUiList[i][0],
          numberOfUses: consumableUiList[i][5],
          // numberOfUses: values.numberOfUses,
        };
        formData.append("consumable[]", JSON.stringify(tempOb));
      }

      for (var i = 0; i < prescriptionList.length; i++) {
        const tempOb = {
          medicineId: prescriptionList[i][0],
          quantity: prescriptionList[i][5],
          usage: prescriptionList[i][6],
        };
        formData.append("prescription[]", JSON.stringify(tempOb));
      }

      values.name = "";
      values.imageUrl = "";
      values.time = 0;
      values.price = 0;
      values.note = "";

      setConsumableUiList([]);
      setPrescriptionList([]);

      handleClose();
      await serviceProcessor.addService(formData);
      loadData();
    },
  });

  const [meds, setMeds] = useState([]);

  const [suggestionList, setSuggestionList] = useState([]);
  const { Control } = Form;
  //only MedID
  // const [selectedMed, setSelectedMed] = useState("");
  // const [selectedMedObj, setSelectedMedObj] = useState({});
  // const [isShowSuggestion, setIsShowSuggestion] = useState([]);
  // const [isShowSuggestion1, setIsShowSuggestion1] = useState([]);

  const fillData = (e, rowIndex) => {
    // let tempList = consumableUiList;
    // console.log(consumableUiList);
    console.log("chay vao fiil");
    const searchResult = meds.find((item) => item.name === e[0]);
    console.log(searchResult);
    if (searchResult) {
      consumableUiList[rowIndex][0] = searchResult._id;
      consumableUiList[rowIndex][2] = searchResult.quantity;
      consumableUiList[rowIndex][3] = searchResult.unit;
      consumableUiList[rowIndex][4] = searchResult.effect;

      setConsumableUiList(consumableUiList);
    } else {
      consumableUiList[rowIndex][0] = "";
      consumableUiList[rowIndex][2] = "";
      consumableUiList[rowIndex][3] = "";
      consumableUiList[rowIndex][4] = "";
      // setNumberOfUses(0);
    }
    // setConsumableUiList([...tempList]);
    // console.log(consumableUiList[rowIndex]);
  };

  const fillDataPre = (e, rowIndex) => {
    const searchResult = meds.find((item) => item.name === e[0]);

    if (searchResult) {
      prescriptionList[rowIndex][0] = searchResult._id;
      prescriptionList[rowIndex][2] = searchResult.quantity;
      prescriptionList[rowIndex][3] = searchResult.unit;
      prescriptionList[rowIndex][4] = searchResult.effect;
      setPrescriptionList(prescriptionList);
    } else {
      prescriptionList[rowIndex][0] = "";
      prescriptionList[rowIndex][2] = "";
      prescriptionList[rowIndex][3] = "";
      prescriptionList[rowIndex][4] = "";
    }

    console.log(prescriptionList[rowIndex]);
  };

  // const [tempSuggestionList, setTempSuggestionList] = useState([]);
  const getMedicine = async () => {
    await axios.get(`/api/medicine/activeMedicine`).then((response) => {
      setMeds(response.data);

      // let temp = [];
      // temp.push(response.data.map((i) => i.name));
      // for (var i = 0; i < temp[0].length; i++) {
      //   suggestionList.push({ value: temp[0][i] });
      // }

      // tempSuggestionList.push(...response.data.map((i) => i.name));
      setSuggestionList([...response.data.map((i) => i.name)]);
    });
  };

  useEffect(() => {
    // formik.handleReset();
    getMedicine();
    getPermission("Quản lý dịch vụ");
  }, []);

  const deleteConsumableUiList = (rowIndex) => {
    let temp = consumableUiList;
    temp.splice(rowIndex, 1);
    setConsumableUiList([...temp]);

    let tempError = errorList;
    tempError.splice(rowIndex, 1);
    setErrorList([...tempError]);
  };

  //prescriptionList
  const [prescriptionList, setPrescriptionList] = useState([]);

  const deleteprescriptionList = (rowIndex) => {
    let temp = prescriptionList;
    temp.splice(rowIndex, 1);
    setPrescriptionList([...temp]);

    let tempError = errorListPre;
    tempError.splice(rowIndex, 1);
    setErrorListPre([...tempError]);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const addConsumableRow = () => {
    // setIsShowSuggestion([...isShowSuggestion, true]);
    setConsumableUiList([...consumableUiList, ["", [], "", "", "", "", ""]]);
    setErrorList([...errorList, ["", "", "", "", "", ""]]);
  };

  const addPrescriptionRow = () => {
    // setIsShowSuggestion1([...isShowSuggestion1, true]);
    setPrescriptionList([...prescriptionList, ["", [], "", "", "", "", ""]]);
    setErrorListPre([...errorListPre, ["", "", "", "", "", "", ""]]);
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

        if (permission.data[0].add === true) {
          setTemp(true);
        }
      })
    );
  };
  return (
    <>
      {temp === true ? (
        <Button
          variant="success"
          onClick={handleShow}
          style={{ marginRight: "20px" }}
        >
          <FaPlusCircle></FaPlusCircle> Thêm thủ thuật
        </Button>
      ) : null}

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
          {/* <Form
              onSubmit={formik.handleSubmit}
              // validated={validated}
              // noValidate
            > */}

          <FormAntd form={form} name="basic" onFinish={formik.handleSubmit}>
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
                  permission={temp}
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
                  <th>Hàm lượng thuốc</th>
                  <th>Đơn vị</th>
                  <th>Công dụng</th>
                  <th>Số lần dùng</th>
                </tr>
              </thead>
              {consumableUiList.length > 0 && (
                <tbody>
                  {consumableUiList.map((row, rowIndex) => {
                    return (
                      <tr>
                        <td style={{ width: "80px" }}>
                          <Control type="text" disabled value={rowIndex + 1} />
                        </td>
                        <td>
                          <Form.Control disabled value={row[0]} />
                        </td>
                        <td>
                          <FormAntd.Item
                            name={`selectCon${rowIndex}`}
                            rules={[
                              {
                                required: true,
                                message: "Nhập tên thuốc",
                              },
                            ]}
                          >
                            <Typeahead
                              id="basic-typeahead-single"
                              onChange={(e) => {
                                fillData(e, rowIndex);

                                let temp = consumableUiList;
                                temp[rowIndex][1] = e;
                                setConsumableUiList([...temp]);
                              }}
                              options={suggestionList}
                              selected={row[1]}
                              placeholder="Chọn tên thuốc..."
                              // inputProps={{ required: false }}
                            />
                          </FormAntd.Item>
                        </td>
                        <td>
                          {/* Hàm Lượng thuốc */}
                          <Form.Control type="number" value={row[2]} disabled />
                        </td>
                        <td>
                          {/* Đơn vị */}
                          <Form.Control type="text" value={row[3]} disabled />
                        </td>
                        <td>
                          {/* Cong dung */}
                          <Form.Control disabled value={row[4]} />
                        </td>
                        <td>
                          {/* Số lần dùng */}

                          <Form.Control
                            // required
                            type="number"
                            // min="1"
                            onChange={(e) => {
                              let temp = consumableUiList;
                              temp[rowIndex][5] = e.target.value;
                              setConsumableUiList([...temp]);

                              let tempError = errorList;
                              if (Number(e.target.value) < 1) {
                                tempError[rowIndex][5] = "Nhập số lớn hơn 0";
                                setErrorList([...tempError]);
                              } else {
                                tempError[rowIndex][5] = "";
                                setErrorList([...tempError]);
                              }
                            }}
                            value={row[5]}
                          />
                          {errorList[rowIndex][5] !== "" && (
                            <Text type="danger">{errorList[rowIndex][5]}</Text>
                          )}
                        </td>

                        <td
                          onClick={() => {
                            Swal.fire({
                              title: "Bạn có chắc chắn muốn xoá",
                              showDenyButton: true,
                              // showCancelButton: true,
                              confirmButtonText: "Xoá",
                              denyButtonText: `Huỷ`,
                            }).then((result) => {
                              /* Read more about isConfirmed, isDenied below */
                              if (result.isConfirmed) {
                                deleteConsumableUiList(rowIndex);
                              } else if (result.isDenied) {
                                // Swal.fire('Changes are not saved', '', 'info')
                              }
                            });
                          }}
                        >
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
                  <th>Hàm lượng thuốc</th>
                  <th>Đơn vị</th>
                  <th>Công dụng</th>
                  <th>Số Lượng</th>
                  <th>Cách sử dụng</th>
                </tr>
              </thead>
              {prescriptionList.length > 0 && (
                <tbody>
                  {prescriptionList.map((row, rowIndex) => {
                    return (
                      <tr>
                        <td style={{ width: "80px" }}>
                          <Control type="text" disabled value={rowIndex + 1} />
                        </td>
                        {/* Chinh sua o day */}
                        <td>
                          <Form.Control disabled value={row[0]} />
                        </td>
                        <td>
                          {/* Name Service thay bằng TypeHead*/}
                          <FormAntd.Item
                            name={`selectPre${rowIndex}`}
                            rules={[
                              {
                                required: true,
                                message: "Nhập tên thuốc",
                              },
                            ]}
                          >
                            <Typeahead
                              id="basic-typeahead-single"
                              onChange={(e) => {
                                fillDataPre(e, rowIndex);

                                let temp = prescriptionList;
                                temp[rowIndex][1] = e;
                                setPrescriptionList([...temp]);
                                // let tempSelect = singleSelectionsPre;
                                // tempSelect[rowIndex] = e;
                                // setSingleSelectionsPre([...tempSelect]);
                              }}
                              options={suggestionList}
                              selected={row[1]}
                              placeholder="Chọn tên thuốc..."
                            />
                          </FormAntd.Item>
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
                          {/* Công dụng */}
                          <Form.Control
                            disabled
                            value={row[4]}
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
                              // prescriptionList[rowIndex][4] = e.target.value;
                              let temp = prescriptionList;
                              temp[rowIndex][5] = e.target.value;
                              setPrescriptionList([...temp]);

                              let tempError = errorListPre;
                              if (Number(e.target.value) < 1) {
                                tempError[rowIndex][5] = "Nhập số lớn hơn 0";
                                setErrorListPre([...tempError]);
                              } else {
                                tempError[rowIndex][5] = "";
                                setErrorListPre([...tempError]);
                              }
                            }}
                            value={row[5]}
                          />
                          {errorListPre[rowIndex][5] !== "" && (
                            <Text type="danger">
                              {errorListPre[rowIndex][5]}
                            </Text>
                          )}
                        </td>

                        <td>
                          {/* Cách sử dụng*/}

                          <Form.Control
                            type="text"
                            // required
                            onChange={(e) => {
                              let temp = prescriptionList;
                              temp[rowIndex][6] = e.target.value;
                              setPrescriptionList([...temp]);

                              let tempError = errorListPre;
                              if (e.target.value === "") {
                                tempError[rowIndex][6] = "Bắt buộc nhập";
                                setErrorListPre([...tempError]);
                              } else {
                                tempError[rowIndex][6] = "";
                                setErrorListPre([...tempError]);
                              }
                            }}
                            value={row[6]}
                          />
                          {errorListPre[rowIndex][6] !== "" && (
                            <Text type="danger">
                              {errorListPre[rowIndex][6]}
                            </Text>
                          )}
                        </td>
                        <td
                          onClick={() => {
                            Swal.fire({
                              title: "Bạn có chắc chắn muốn xoá",
                              showDenyButton: true,
                              confirmButtonText: "Xoá",
                              denyButtonText: `Huỷ`,
                            }).then((result) => {
                              if (result.isConfirmed) {
                                deleteprescriptionList(rowIndex);
                              } else if (result.isDenied) {
                              }
                            });
                          }}
                        >
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
              onClick={() => {
                let tempError = errorList;
                consumableUiList.forEach((parent, parentIndex) => {
                  parent.forEach((item, index) => {
                    switch (index) {
                      case 1:
                        break;
                      case 5:
                        if (Number(item) < 1) {
                          tempError[parentIndex][index] = "Nhập số lớn hơn 0";
                          setErrorList([...tempError]);
                        }
                        break;
                      default:
                        break;
                    }
                  });
                });
                let tempErrorPre = errorListPre;
                prescriptionList.forEach((parent, parentIndex) => {
                  parent.forEach((item, index) => {
                    switch (index) {
                      case 1:
                        break;
                      case 5:
                        if (Number(item) < 1) {
                          tempErrorPre[parentIndex][index] =
                            "Nhập số lớn hơn 0";
                          setErrorListPre([...tempErrorPre]);
                        }
                        break;
                      case 6:
                        if (item === "") {
                          tempErrorPre[parentIndex][index] = "Bắt buộc nhập";
                          setErrorListPre([...tempErrorPre]);
                        }
                        break;
                      default:
                        break;
                    }
                  });
                });
              }}
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
            {/* </Form> */}
          </FormAntd>
        </Modal.Body>
      </Modal>
      {/* </ModalAntd> */}
    </>
  );
};

export default ServiceModal;
