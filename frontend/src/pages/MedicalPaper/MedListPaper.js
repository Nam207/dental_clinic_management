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

const MedListPaper = ({ closeMedPaper, openMedPaper, singleSelectionsDoc }) => {
  const [medListA, setMedListA] = useState([]);
  const [medName, setSingleMedName] = useState([]);
  const [medNamelist, setMedNamelist] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    openMedPaper();
    setShow(false);
  };
  const handleShow = () => {
    closeMedPaper();
    setShow(true);
    // console.log(singleSelectionsDoc);
  };

  const addMedListA = () => {
    setMedListA([...medListA, ["", "", "", "", ""]]);
  };

  const deleteMedListA = (rowIndex) => {
    let temp = medListA;
    temp.splice(rowIndex, 1);
    setMedListA([...temp]);
  };

  const fillMedListA = (e, rowIndex) => {
    console.log(e);
    // const searchResult = medNamelist.find((item) => item.name === e[0].name);
    // console.log(e[0].unit);

    if (e[0]?.name) {
      medListA[rowIndex][0] = e[0].name;
      medListA[rowIndex][2] = e[0].unit;
      setMedListA(medListA);
    } else {
      medListA[rowIndex][0] = "";
      medListA[rowIndex][2] = "";
    }
  };

  const loadMedData = () => {
    axios
      .get("/api/medicine/activeMedicine")
      .then((response) => {
        console.log(response.data);
        // setMedNamelist([
        //   ...response.data.map((u) => ({ id: u._id, name: u.name })),
        // ]);
        setMedNamelist(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    loadMedData();
  }, []);

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

      <Modal id="MedListPaper" size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Đơn thuốc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormAntd name="basic">
            <Row className="mb-3" style={{ margin: "5px" }}>
              <Form.Label column sm={2}>
                Bác sỹ kê đơn
              </Form.Label>
              <Col sm={4}>
                <Form.Control
                  id="phone"
                  type="text"
                  disabled
                  value={`${singleSelectionsDoc[0]?.id} - ${singleSelectionsDoc[0]?.name}`}
                />
              </Col>
              <Col sm={3}>
                <Button
                  variant="success"
                  onClick={handleShow}
                  style={{
                    marginRight: "20px",
                    width: "80%",
                    maxWidth: "100%",
                  }}
                  disabled={singleSelectionsDoc.length < 1 ? true : false}
                >
                  Thuốc thủ tục <FaPlusCircle></FaPlusCircle>
                </Button>
              </Col>
              <Col sm={3}>
                <Button
                  variant="success"
                  onClick={addMedListA}
                  style={{
                    marginRight: "20px",
                    width: "70%",
                    maxWidth: "100%",
                  }}
                  disabled={singleSelectionsDoc.length < 1 ? true : false}
                >
                  Thuốc khác <FaPlusCircle></FaPlusCircle>
                </Button>
              </Col>
            </Row>

            <Table bordered>
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th>STT</th>
                  <th>Tên thuốc</th>
                  <th>Số lượng</th>
                  <th>Đơn vị</th>
                  <th>Cách dùng</th>
                  <th>s</th>
                </tr>
              </thead>
              {medListA.length > 0 && (
                <tbody>
                  {medListA.map((row, rowIndex) => {
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
                          <Typeahead
                            // clearButton
                            id="basic-typeahead-single"
                            labelKey="name"
                            onChange={(e) => {
                              // console.log(e);
                              // findCusByName(e);
                              // setSingleCusName(e);
                              // setSingleCusPhone([]);
                              fillMedListA(e, rowIndex);
                              let tempSelect = medName;
                              tempSelect[rowIndex] = e;
                              setSingleMedName([...tempSelect]);
                            }}
                            options={medNamelist}
                            placeholder="Nhập thuốc"
                            selected={medName[rowIndex]}
                          />
                        </td>
                        {/* So Luong */}
                        <td style={{ width: "12%" }}>
                          <Form.Control />
                        </td>
                        {/* Don vi */}
                        <td style={{ width: "12%" }}>
                          <Form.Control disabled value={row[2]} />
                        </td>
                        {/* Cach dung */}
                        <td style={{ width: "30%" }}>
                          <Form.Control type="text" />
                        </td>
                        {/* Btn Delete */}
                        <td onClick={() => deleteMedListA(rowIndex)}>
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
              )}
            </Table>
          </FormAntd>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MedListPaper;
