import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FaRedoAlt, FaEdit, FaRegEye } from "react-icons/fa";
// import Table from "react-bootstrap/Table";
import { AiFillDelete } from "react-icons/ai";
import CustomTable from "../../components/CustomTable";
import { AiOutlineCheck, AiOutlineCloseCircle } from "react-icons/ai";
import CustomToast from "../../components/CustomToast";
import customerProcessor from "../../apis/customerProcessor";
import axios from "../../apis/api";
import MedicalPaperModal from "./MedicalPaperModal";
import {
  Pagination,
  Table,
  Button as ButtonAntd,
  DatePicker,
  Space,
} from "antd";
import DocMedicalPaperModal from "./DocMedicalPaperModal";

const ListMedicalPaper = () => {
  const { RangePicker } = DatePicker;
  const dateFormat = "DD/MM/YYYY";
  const [pkList, setPkList] = useState([]);

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchMeds, setSearchMeds] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [opac, setOpac] = useState(1);
  const openMedPaper = () => {
    setOpac(1);
  };
  const closeMedpaper = () => {
    setOpac(0);
  };

  const [isShowUpdate, setIsShowUpdate] = useState(false);
  const [pkID, setPKID] = useState();

  const openUpdateModal = (id) => {
    setPKID(id);
    setIsShowUpdate(true);
    openMedPaper();
  };

  const closeUpdateModal = () => {
    setIsShowUpdate(false);
  };

  const handleSearch = (e) => {
    setSearchMeds(e.target.value);
  };

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

  const onChangePage = (current, pageSize) => {
    // console.log(current, pageSize);
    setOffset(current - 1);
    setLimit(pageSize);
  };

  const loadDataFilterByDate = () => {
    axios
      .get(
        `/api/medicalPaper?keyword=${searchMeds}&offset=${offset}&limit=${limit}&startDate=${fromDate}&endDate=${toDate}`
      )
      .then((response) => {
        setPkList(response.data.data);
        setTotal(response.data.total);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //load Data of all MedicalPaper
  // const loadData = () => {
  //   axios
  //     .get(
  //       `/api/medicalPaper?keyword=${searchMeds}&offset=${offset}&limit=${limit}`
  //     )
  //     .then((response) => {
  //       setPkList(response.data.data);
  //       setTotal(response.data.total);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  useEffect(() => {
    // loadData();
    loadDataFilterByDate();
  }, [offset, searchMeds, limit, fromDate]);

  const columns = [
    {
      title: "Mã Phiếu khám",
      dataIndex: "_id",
      align: "center",
      // defaultSortOrder: "descend",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      align: "center",
      sorter: (a, b) => a.fullname.length - b.fullname.length,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      align: "center",
      width: "180px",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Nhân viên",
      dataIndex: "staff",
      align: "center",
      // width: "180px",
      // sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Thanh toán",
      dataIndex: "status",
      align: "center",
      // filters: [
      //   {
      //     text: "Thanh toán",
      //     value: `Thanh toan`,
      //   },
      //   {
      //     text: "Còn nợ",
      //     value: `Con no`,
      //   },
      // ],
      // onFilter: (value, record) => record.status.type.name === value,
    },
    {
      title: " ",
      dataIndex: "action",
      align: "center",
    },
  ];

  const data = pkList.map((p) => {
    return {
      key: p._id,
      _id: p._id,
      createdAt: new Date(p.createdAt).toLocaleDateString("en-GB"),
      customer: p.customer,
      staff: p.staff,
      status:
        p.status.$numberDecimal === "0" ? (
          <Button
            variant="danger"
            style={{ width: "60%" }}
            onClick={() => {
              console.log("con no!!!");
            }}
          >
            Con no
          </Button>
        ) : (
          <Button variant="success">Thanh toan</Button>
        ),

      action: (
        //de update/view trong nay
        <FaRegEye
          onClick={() => {
            openUpdateModal(p._id);
          }}
          cursor={"pointer"}
          size={25}
        ></FaRegEye>
      ),
    };
  });

  return (
    <div>
      {" "}
      {/* Update Modal */}
      <DocMedicalPaperModal
        opac={opac}
        closeMedpaper={closeMedpaper}
        PKID={pkID}
        closeModal={closeUpdateModal}
        isVisible={isShowUpdate}
        loadData={loadDataFilterByDate}
        openMedPaper={openMedPaper}
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
                Danh sách Phiếu khám
              </h4>
            </Nav>
            <Form className="d-flex">
              {/* Date filter */}
              {/* <Space direction="vertical" size={12}> */}
              <RangePicker
                format={dateFormat}
                onChange={(date, dateString) => {
                  setFromDate(dateString[0]);
                  setToDate(dateString[1]);
                  // loadDataFilterByDate(dateString[0], dateString[1]);
                }}
                style={{ marginRight: "20px" }}
              />
              {/* </Space> */}
              {/* Add Modal */}
              <MedicalPaperModal loadData={loadDataFilterByDate} />
              <Button
                variant="primary"
                style={{ marginRight: "20px" }}
                onClick={loadDataFilterByDate}
              >
                <FaRedoAlt /> Tải lại
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
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
      </div>
      {/* <MedicalPaperTable /> */}
    </div>
  );
};

export default ListMedicalPaper;
