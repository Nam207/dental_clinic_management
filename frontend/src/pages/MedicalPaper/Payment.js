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
  InputNumber,
} from "antd";
import { Typeahead } from "react-bootstrap-typeahead";
import { useFetcher } from "react-router-dom";
import axios from "../../apis/api";
import Swal from "sweetalert2";

const Payment = ({ closeMedPaper, openMedPaper }) => {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    closeMedPaper();
    setShow(true);
  };

  const handleClose = () => {
    openMedPaper();
    setShow(false);
  };

  return (
    <>
      <Button
        variant="primary"
        style={{
          backgroundColor: "#e67e22",
          width: "52%",
          marginBottom: "8px",
          display: "inline",
        }}
        onClick={handleShow}
      >
        Thanh toán
      </Button>

      <Modal
        id="MedListPaper"
        size="lg"
        show={show}
        onHide={handleClose}
        // backdrop="static"
        // aria-labelledby="st-lg-modal"
      >
        <FormAntd
          name="basic"
          // form={form}
          // onFinish={checkClose}
        >
          <Modal.Header>
            <Modal.Title>Thanh toán</Modal.Title>

            <div style={{ float: "right", display: "inline-block" }}>
              <Button type="submit" variant="primary">
                OK
              </Button>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3" style={{ margin: "5px" }}>
              <Form.Label column sm={1} style={{ width: "13%" }}>
                Tổng tiền hoá đơn:
              </Form.Label>
              <Col sm={3} style={{ width: "20%" }}>
                <InputNumber
                  defaultValue={300000000000}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  bordered={false}
                />
              </Col>
            </Row>
          </Modal.Body>
        </FormAntd>
      </Modal>
    </>
  );
};

export default Payment;
