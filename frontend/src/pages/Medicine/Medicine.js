import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getMedicineSuccess } from "../../redux/reducer/medicineSlice";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FaRedoAlt, FaEdit } from "react-icons/fa";
import MedicineModal from "./MedicineModal";
// import Table from "react-bootstrap/Table";
import medicineProcessor from "../../apis/medicineProcessor";
import UpdateMedicineModal from "./UpdateMedicineModal";
import ReactPaginate from "react-paginate";
import { AiOutlineCheck, AiOutlineCloseCircle } from "react-icons/ai";
import { store } from "../../redux/store";
import CustomToast from "../../components/CustomToast";
import CustomTable from "../../components/CustomTable";
import axios from "../../apis/api";
import { Pagination, Table } from "antd";
// import "antd/dist/antd.css";

const Medicine = () => {
  const [medId, setMedID] = useState("");
  const [isShowUpdate, setIsShowUpdate] = useState(false);
  const [searchMeds, setSearchMeds] = useState("");
  // const meds = useSelector((state) => state.med.medicine);
  const [meds, setMeds] = useState([]);
  const [isToast, setIsToast] = useState({
    value: false,
    isSuccess: true,
    content: "",
  });

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  const loadData = async () => {
    // medicineProcessor.getAll("", 1, "");
    const response = await axios
      .get(
        `/api/medicine?keyword=${searchMeds}&offset=${offset}&limit=${limit}`
      )
      .then((response) => {

        if (response.success === 1) {
          setMeds(response.data.data);
          setTotal(response.data.total);
        }
      });
  };

  useEffect(() => {
    loadData();
  }, [offset, total, searchMeds, limit]);

  const onChangePage = (current, pageSize) => {
    setOffset(current - 1);
    setLimit(pageSize);
  };

  const openUpdateModal = (id) => {
    setMedID(id);
    setIsShowUpdate(true);
  };

  const closeUpdateModal = () => {
    setMedID("");
    setIsShowUpdate(false);
  };

  const handleSearch = (e) => {
    setSearchMeds(e.target.value);
  };

  const showToast = (content, isSuccess) => {
    setIsToast({
      ...isToast,
      content: content,
      isSuccess: isSuccess,
      value: true,
    });
  };

  const columns = [
    {
      title: "Mã thuốc",
      dataIndex: "_id",
      align: "center",
      // defaultSortOrder: "descend",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      align: "center",
    },
    {
      title: "Tên thuốc",
      dataIndex: "name",
      align: "center",
      // defaultSortOrder: "descend",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Tác dụng",
      dataIndex: "effect",
      align: "center",
      width: "380px",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      filters: [
        {
          text: "Hoạt động",
          value: `AiOutlineCheck`,
        },
        {
          text: "Không hoạt động",
          value: `AiOutlineCloseCircle`,
        },
      ],
      onFilter: (value, record) => record.status.type.name === value,
    },
    {
      title: " ",
      dataIndex: "action",
      align: "center",
    },
  ];

  const data = meds.map((med) => {
    return {
      key: med._id,
      _id: med._id,
      imageUrl: (
        <img
          src={med.imageUrl}
          style={{ height: "100px", width: "100px" }}
          alt=""
        />
      ),
      name: med.name,
      effect: med.effect,
      status: med.status ? (
        <AiOutlineCheck color="#009432" size={25} />
      ) : (
        // "true"
        <AiOutlineCloseCircle color="#EA2027" size={25} />
      ),
      // "false"
      action: (
        <>
          <FaEdit
            className="mx-2"
            color="#2980b9"
            cursor={"pointer"}
            size={25}
            onClick={() => {
              openUpdateModal(med._id);
            }}
          />
          <Form.Check
            type="switch"
            checked={med.status}
            style={{ display: "inline", marginLeft: "10px" }}
            onChange={async (e) => {
              // refreshData(e, med, index);
              let resul;
              let temp = e.target.checked;
              // console.log(e.target.checked);
              await Swal.fire({
                title: "Bạn có chắc chắn muốn đổi",
                showDenyButton: true,
                confirmButtonText: "Đổi",
                denyButtonText: `Huỷ`,
              }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  console.log(temp);
                  resul = await medicineProcessor.changeStatus(med._id, temp);
                } else if (result.isDenied) {
                }
              });

              if (resul.success === 1) {
                showToast(`Cập nhật id: ${med._id} thành công`, true);
                await loadData();
              }
            }}
          />
        </>
      ),
    };
  });

  return (
    <>
      <UpdateMedicineModal
        closeModal={closeUpdateModal}
        isVisible={isShowUpdate}
        medID={medId}
        loadData={loadData}
      ></UpdateMedicineModal>
      <Navbar>
        <Container fluid>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <h4 style={{ display: "inline-block", margin: "10px" }}>
                Danh sách thuốc
              </h4>
            </Nav>
            <Form className="d-flex">
              <MedicineModal loadData={loadData}></MedicineModal>
              <Button
                variant="primary"
                style={{ marginRight: "20px" }}
                onClick={loadData}
              >
                <FaRedoAlt /> Tải lại
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* <MedTable /> */}
      <div
        style={{
          position: "fixed",
          right: "10px",
          bottom: "20px",
          zIndex: "3",
        }}
      >
        <CustomToast
          value={isToast.value}
          content={isToast.content}
          isSuccess={isToast.isSuccess}
          onClose={() => {
            setIsToast({ ...isToast, value: false });
          }}
        />
      </div>
      <div style={{ marginLeft: "100px", marginRight: "100px" }}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              style={{ marginTop: "20px" }}
              placeholder="Tìm kiếm"
              autoFocus
              value={searchMeds}
              onChange={handleSearch}
            />
          </Form.Group>
        </Form>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>

      <div id="pagin">
        <Pagination
          showSizeChanger
          current={offset + 1}
          total={total}
          onChange={onChangePage}
          defaultPageSize={5}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </>
  );
};

export default Medicine;
