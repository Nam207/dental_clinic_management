import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { FaBookMedical, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import {
  Select,
  Pagination,
  Table as TableAntd,
  Form as FormAntd,
  Space,
  Tag,
} from "antd";
import { Typeahead } from "react-bootstrap-typeahead";
import { useFetcher } from "react-router-dom";
import axios from "../../apis/api";
import Swal from "sweetalert2";

const MedListPaper = ({
  closeMedPaper,
  openMedPaper,
  singleSelectionsDoc,
  serListID,
  PKID,
}) => {
  const [form] = FormAntd.useForm();

  const [medicalPrescribe, setMedicalPrescribe] = useState([
    {
      doctorId: singleSelectionsDoc[0]?.id,
      medicalPaperId: PKID,
      medicineId: "",
      quantity: 0,
      usage: "",
    },
  ]);

  const [medListA, setMedListA] = useState([]);

  //dem 1 nhip
  const [medName, setSingleMedName] = useState([]);
  //for options typeahead
  const [medNamelist, setMedNamelist] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    openMedPaper();
    setShow(false);
  };

  const isnotFormValidd = () => {
    const temp = form.getFieldsError().map((item) => item.errors.length > 0);
    return temp;
  };

  const checkClose = async (e) => {
    //chay khi length = 0 || length > 1 va dien du lieu
    //dk laf medListA.length > 1 && chua dien du lieu
    // let tem = isnotFormValidd();
    // if ((medListA.length >= 1 && !tem.includes(true)) || medListA.length < 1) {
    //   openMedPaper();
    //   setShow(false);
    // }
    // await axios
    //   .post(`/api/service/prescription`, pre)
    //   .then((response) => {})
    //   .catch((error) => {
    //     console.error(error);
    //   });

    let mePrescribe = [];
    medListA.map((e) => {
      mePrescribe.push({
        doctorId: singleSelectionsDoc[0]?.id,
        medicalPaperId: PKID,
        medicineId: e[4],
        quantity: e[1],
        usage: e[3],
      });
    });

    await axios
      .post("/api/medicinePrescribe", { medicalPrescribe: mePrescribe })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getCurMed = async () => {
    console.log(PKID);
    await axios
      .get(`/api/medicinePrescribe?medicalPaper=${PKID}`)
      .then((response) => {
        // console.log(response.data);
        setMedListA([
          ...response.data.map((i) => [
            [i.name],
            i.quantity,
            i.unit,
            i.usage,
            i.medicineId,
          ]),
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleShow = () => {
    closeMedPaper();
    setShow(true);
    getCurMed();
  };

  const addMedListA = () => {
    setMedListA([...medListA, [[], "", "", "", ""]]);
  };

  const deleteMedListA = (rowIndex) => {
    let temp = medListA;
    temp.splice(rowIndex, 1);
    setMedListA([...temp]);
  };

  const fillMedListA = (e, rowIndex) => {
    if (e[0]?.quantity) {
      // medListA[rowIndex][0] = e[0].name;
      medListA[rowIndex][2] = e[0].quantity;
      setMedListA(medListA);

      //fill medicalPrescribe
    } else {
      // medListA[rowIndex][0] = "";
      medListA[rowIndex][2] = "";
    }
  };

  const loadMedData = async () => {
    await axios
      .get("/api/medicine/activeMedicine")
      .then((response) => {
        // setMedNamelist([
        //   ...response.data.map((u) => ({ id: u._id, name: u.name })),
        // ]);

        setMedNamelist(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [pre, setPre] = useState({});

  //get prescription meds from selected services
  const getMedFromSer = async () => {
    await axios
      .post(`/api/service/prescription`, pre)
      .then((response) => {
        console.log(response.data);
        // console.log(1);
        setMedListA([
          ...medListA,
          ...response.data.map((i) => [
            [i.name],
            i.quantity,
            i.unit,
            i.usage,
            i.medicineId,
          ]),
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // setPre({ serListId: serListID });
    loadMedData();
  }, []);

  //
  useEffect(() => {
    // console.log(pre);
    setPre({ serListId: serListID });
  }, [serListID]);

  useEffect(() => {
    // console.log(pre);
    setPre({ serListId: serListID });
  }, [show]);

  const printPDF = async () => {
    const response = await axios
      .get(`/api/prescriptionPdf?medicalPaperId=${PKID}`, {
        responseType: "arraybuffer",
        headers: {
          Accept: "application/pdf",
        },
      })
      .then(async (response) => {
        const pdfBlod = new Blob([response], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlod);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "prescription.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
        const pdfWindow = window.open();
        pdfWindow.location.href = url;
      });
  };

  return (
    <>
      <Button
        variant="warning"
        onClick={handleShow}
        style={{ marginRight: "20px", width: `200px` }}
        disabled={singleSelectionsDoc.length < 1 ? true : false}
      >
        <FaBookMedical></FaBookMedical> Đơn thuốc
      </Button>

      <Modal
        id="MedListPaper"
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        // aria-labelledby="st-lg-modal"
      >
        <FormAntd name="basic" form={form} onFinish={checkClose}>
          <Modal.Header>
            <Modal.Title>Đơn thuốc</Modal.Title>

            <div style={{ float: "right", display: "inline-block" }}>
              <Button
                variant="secondary"
                style={{
                  marginRight: "10px",
                }}
                onClick={handleClose}
              >
                Huỷ
              </Button>
              <Button
                variant="warning"
                style={{
                  marginRight: "10px",
                }}
                onClick={printPDF}
              >
                In đơn thuốc
              </Button>
              <Button type="submit" variant="primary">
                Nhập thuốc
              </Button>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3" style={{ margin: "5px" }}>
              <Form.Label column sm={2}>
                Bác sỹ kê đơn
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  id="phone"
                  type="text"
                  disabled
                  value={`${singleSelectionsDoc[0]?.id} - ${singleSelectionsDoc[0]?.name}`}
                />
              </Col>
              <Col sm={3} style={{ width: "22%" }}>
                <Button
                  variant="success"
                  onClick={() => {
                    getMedFromSer();
                  }}
                  style={{
                    // marginRight: "20px",
                    width: "80%",
                    maxWidth: "100%",
                  }}
                  disabled={singleSelectionsDoc.length < 1 ? true : false}
                >
                  Thuốc thủ thuật<FaPlusCircle></FaPlusCircle>
                </Button>
              </Col>
              <Col sm={3} style={{ width: "22%" }}>
                <Button
                  variant="success"
                  onClick={addMedListA}
                  style={{
                    // marginRight: "20px",
                    width: "70%",
                    maxWidth: "100%",
                  }}
                  disabled={singleSelectionsDoc.length < 1 ? true : false}
                >
                  Thuốc khác <FaPlusCircle></FaPlusCircle>
                </Button>
              </Col>
              <Col sm={2} style={{ width: "22%" }}></Col>
            </Row>

            <Table bordered>
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th>STT</th>
                  <th>Tên thuốc</th>
                  <th>Số lượng</th>
                  <th>Đơn vị</th>
                  <th>Cách dùngs</th>
                  <th></th>
                </tr>
              </thead>
              {/* {medListA.length > 0 && ( */}
              <tbody>
                {medListA.length > 0 &&
                  medListA.map((row, rowIndex) => {
                    return (
                      <tr style={{ textAlign: "center" }}>
                        <td style={{ width: "1%" }}>
                          <Form.Control
                            style={{ textAlign: "center" }}
                            type="text"
                            // disabled
                            readOnly
                            plaintext
                            value={rowIndex + 1}
                          />
                        </td>
                        {/* Ten thuoc */}
                        <td style={{ width: "30%" }}>
                          <FormAntd.Item
                            name={`TK${rowIndex}`}
                            rules={[
                              {
                                required: true,
                                message: "Nhập tên thuốc",
                              },
                            ]}
                            initialValue={row[0]}
                          >
                            <Typeahead
                              // clearButton
                              id="basic-typeahead-single"
                              labelKey="name"
                              onChange={(e) => {
                                fillMedListA(e, rowIndex);

                                let temp = medListA;
                                temp[rowIndex][0] = e;
                                temp[rowIndex][4] = e[0]?._id;
                                setMedListA([...temp]);
                              }}
                              options={medNamelist}
                              placeholder="Nhập thuốc"
                              selected={row[0]}
                              // selected={medName[rowIndex]}
                            />
                          </FormAntd.Item>
                        </td>
                        {/* So Luong */}
                        <td style={{ width: "12%" }}>
                          {/* <FormAntd.Item
                            name={`SL${rowIndex}`}
                            rules={[
                              {
                                required: true,
                                message: "Nhập số lượng",
                              },
                            ]}
                            initialValue={row[1]}
                          > */}
                          <Form.Control
                            required
                            type="number"
                            min="1"
                            onChange={(e) => {
                              let temp = medListA;
                              temp[rowIndex][1] = Number(e.target.value);
                              setMedListA([...temp]);
                            }}
                            value={row[1]}
                          />
                          {/* </FormAntd.Item> */}
                        </td>
                        {/* Don vi */}
                        <td style={{ width: "12%" }}>
                          <Form.Control disabled value={row[2]} />
                        </td>
                        {/* Cach dung */}
                        <td style={{ width: "30%" }}>
                          <Form.Control
                            required
                            type="text"
                            onChange={(e) => {
                              let temp = medListA;
                              temp[rowIndex][3] = e.target.value;
                              setMedListA([...temp]);
                            }}
                            value={row[3]}
                          />
                        </td>
                        {/* Btn Delete */}
                        <td
                          onClick={() => {
                            Swal.fire({
                              title: "Bạn có chắc chắn muốn xoá",
                              showDenyButton: true,
                              confirmButtonText: "Xoá",
                              denyButtonText: `Huỷ`,
                            }).then((result) => {
                              if (result.isConfirmed) {
                                deleteMedListA(rowIndex);
                                // setVV("asd");
                              } else if (result.isDenied) {
                              }
                            });
                          }}
                        >
                          <FaTrashAlt
                            size={20}
                            cursor="pointer"
                            color="#e74c3c"
                            style={{ transform: "translateY(2px)" }}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              {/* )} */}
            </Table>
          </Modal.Body>
        </FormAntd>
      </Modal>
    </>
  );
};

export default MedListPaper;
