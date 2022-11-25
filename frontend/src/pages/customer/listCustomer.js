import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FaRedoAlt, FaEdit } from "react-icons/fa";
// import Table from "react-bootstrap/Table";
import { AiFillDelete } from "react-icons/ai";
import CustomerModal from "./CustomerModal";
import CustomTable from "../../components/CustomTable";
import { AiOutlineCheck, AiOutlineCloseCircle } from "react-icons/ai";
import CustomToast from "../../components/CustomToast";
import UpdateCustomerModal from "./UpdateCustomerModal";
import customerProcessor from "../../apis/customerProcessor";
import axios from "../../apis/api";
import { Pagination, Table } from "antd";

import { Pagination } from "antd";

const Customer = () => {
  const [customers, setCustomers] = useState([]);

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchMeds, setSearchMeds] = useState("");

  const loadData = () => {
    axios
      .get(
        `/api/customer?keyword=${searchMeds}&offset=${offset}&limit=${limit}`
      )
      .then((response) => {
        // response.success === 1 && setCustomers(response.data);
        if (response.success === 1) {

          setCustomers(response.data.data);

          setTotal(response.data.total);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [cusId, setCusID] = useState();
  const [isShowUpdate, setIsShowUpdate] = useState(false);

  useEffect(() => {
    loadData();
  }, [offset, total, searchMeds, limit]);

  const onChangePage = (current, pageSize) => {
    // console.log(current, pageSize);
    setOffset(current - 1);
    setLimit(pageSize);
  };

  // useEffect(() => {
  //   loadData();
  // }, [isShowUpdate]);

  const [currentItems, setCurrentItems] = useState([]);

  const [isToast, setIsToast] = useState({
    value: false,
    isSuccess: true,
    content: "",
  });

  const openUpdateModal = (id) => {
    setCusID(id);
    setIsShowUpdate(true);
  };

  const closeUpdateModal = () => {
    setIsShowUpdate(false);
    // console.log("chay ow day");
  };

  const showToast = (content, isSuccess) => {
    setIsToast({
      ...isToast,
      content: content,
      isSuccess: isSuccess,
      value: true,
    });
  };

  const handleSearch = (e) => {
    setSearchMeds(e.target.value);
  };

  const columns = [
    {
      title: "Mã khách hàng",
      dataIndex: "_id",
      align: "center",
      // defaultSortOrder: "descend",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "fullname",
      align: "center",
      sorter: (a, b) => a.fullname.length - b.fullname.length,
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      align: "center",
      width: "180px",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      align: "center",
      // width: "180px",
      // sorter: (a, b) => a.price - b.price,
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

  const data = customers.map((med) => {
    return {
      key: med._id,
      _id: med._id,
      fullname: med.fullname,
      phone: med.phone,
      address: med.address,
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
              const result = await customerProcessor.changeStatus(
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
      <UpdateCustomerModal
        closeModal={closeUpdateModal}
        isVisible={isShowUpdate}
        cusId={cusId}
        loadData={loadData}
      />

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
                Danh sách khách hàng
              </h4>
            </Nav>
            <Form className="d-flex">
              <CustomerModal
                lbl="Thêm Khách hàng"
                loadData={loadData}
                widthh="181px"
              />
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


      {/* <CustomerTable /> */}
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
              value={searchMeds}
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

export default Customer;
