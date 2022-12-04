import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaBookMedical } from "react-icons/fa";

const MedListPaper = ({ closeMedPaper, openMedPaper }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    openMedPaper();
    setShow(false);
  };
  const handleShow = () => {
    closeMedPaper();
    setShow(true);
  };
  return (
    <>
      <Button
        variant="warning"
        onClick={handleShow}
        style={{ marginRight: "20px", width: `200px` }}
      >
        <FaBookMedical></FaBookMedical> Đơn thuốc
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Đơn thuốc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>Form thêm thuốc</h1>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MedListPaper;
