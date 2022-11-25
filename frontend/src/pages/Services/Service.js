import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMedicineSuccess } from "../../redux/reducer/medicineSlice";
import ReactPaginate from "react-paginate";
import axios from "../../apis/api";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CloseButton from "react-bootstrap/CloseButton";
import { FaPlusCircle } from "react-icons/fa";
import { FaRedoAlt, FaEdit } from "react-icons/fa";
// import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import ServiceModal from "./ServiceModal";
import serviceProcessor from "../../apis/serviceProcessor";
import { AiOutlineCheck, AiOutlineCloseCircle } from "react-icons/ai";
import CustomToast from "../../components/CustomToast";
import UpdateServiceModal from "./UpdateServiceModal";
import { Pagination, Table } from "antd";

const Service = ({ itemsPerPage }) => {
  const [key, setKey] = useState("profile");
  const [searchSers, setSearchSers] = useState("");

  const [isShowUpdate, setIsShowUpdate] = useState(false);
  const [serviceId, setServiceId] = useState("");

  const [services, setServices] = useState([]);

  const openUpdateModal = (id) => {
    setIsShowUpdate(true);
    setServiceId(id);
  };

  const closeUpdateModal = () => {
    setIsShowUpdate(false);
  };

  const handleSearch = (e) => {
    setSearchSers(e.target.value);
  };

  // const [searchMeds, setSearchMeds] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  const loadData = async () => {
    await axios
      .get(`/api/service?keyword=${searchSers}&offset=${offset}&limit=${limit}`)
      .then((response) => {
        setServices(response.data.data);
        setTotal(response.data.total);
      })
      .catch((err) => {
        // console.log("Err: ", err);
        Swal.fire("Thất bại", `Kết nối với server thất bại`, "failed");
      });
  };

  const onChangePage = (current, pageSize) => {
    // console.log(current, pageSize);
    setOffset(current - 1);
    setLimit(pageSize);
  };

  useEffect(() => {
    // console.log("chay vao day");
    loadData();
  }, [offset, searchSers, limit]);

  const [isToast, setIsToast] = useState({
    value: false,
    isSuccess: true,
    content: "",
  });

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
      title: "Mã thủ thuật",
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
      title: "Tên thủ thuật",
      dataIndex: "name",
      align: "center",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: "center",
      width: "180px",
      sorter: (a, b) => a.price - b.price,
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

  const data = services.map((med) => {
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
      price: new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "VND",
      }).format(med.price.$numberDecimal),
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
              const result = await serviceProcessor.changeStatus(
                med._id,
                e.target.checked
              );
              if (result.success === 1) {
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
      <UpdateServiceModal
        closeModal={closeUpdateModal}
        isVisible={isShowUpdate}
        serviceId={serviceId}
        loadData={loadData}
      />
      <Navbar>
        <Container fluid>
          {/* <Navbar.Brand href="#">Navbar scroll</Navbar.Brand> */}
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <h4 style={{ display: "inline-block", margin: "10px" }}>
                Danh sách Thủ Thuật
              </h4>
            </Nav>
            <Form className="d-flex">
              <ServiceModal loadData={loadData} />

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
              placeholder="Tìm kiếm"
              autoFocus
              value={searchSers}
              onChange={handleSearch}
              style={{ marginTop: "20px" }}
            />
          </Form.Group>
        </Form>
        {/* <ServiceTable currentItems={services} /> */}
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

export default Service;
