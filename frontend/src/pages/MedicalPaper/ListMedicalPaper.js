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
import dayjs from "dayjs";
import moment from "moment";
import DocMedicalPaperModal from "./DocMedicalPaperModal";
import PaymentY from "./PaymentY";

const ListMedicalPaper = ({ user }) => {
  const { RangePicker } = DatePicker;
  const dateFormat = "DD/MM/YYYY";
  const [pkList, setPkList] = useState([]);

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchMeds, setSearchMeds] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [temp, setTemp] = useState(false);
  const [tempEye, setTempeye] = useState(false);
  const [temp1, setTemp1] = useState(false);

  const [opac, setOpac] = useState(1);
  const openMedPaper = () => {
    setOpac(1);
  };
  const closeMedpaper = () => {
    setOpac(0);
  };

  const [isShowUpdate, setIsShowUpdate] = useState(false);
  const [isShowUpdateY, setIsShowUpdateY] = useState(false);

  const [pkID, setPKID] = useState();

  const openUpdateModalY = async (id) => {
    setPKID(id);
    setIsShowUpdateY(true);
    // openMedPaper();
  };

  const closeUpdateModalY = () => {
    setIsShowUpdateY(false);
  };

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

  function findIndexByProperty(data, key, value) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][key] === value) {
        return i;
      }
    }
    return -1;
  }

  const getPermission = async (functionName) => {
    if (user.role[0].name === "Admin") {
      setTemp1(true);
      setTemp(true);
      setTempeye(false);
      return;
    }
    const functionArray = await axios({
      url: `/api/function`,
      method: "get",
    });
    const index = findIndexByProperty(functionArray.data, "name", functionName);
    let tempView = 0;
    await Promise.all(
      user.role.map(async (element) => {
        const permission = await axios({
          url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
          method: "get",
        });
        if (permission.success === 0 || !permission.data) return;
        if (permission.data[0].view === true) {
          tempView++;
          setTemp1(true);
        }
        if (permission.data[0].delete === true) {
          setTemp(true);
        }
        if (permission.data[0].edit === true) {
          setTempeye(true);
        }
      })
    );
    if (tempView === 0) {
      window.location.href = "/Page404";
    }
  };

  const onChangePage = (current, pageSize) => {
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

  useEffect(() => {
    // loadData();
    loadDataFilterByDate();
    getPermission("Quản lý phiếu khám");
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
      status: (
        <>
          {tempEye === true ? (
            p.status.$numberDecimal === "0" ? (
              <Button
                variant="danger"
                style={{ width: "60%" }}
                onClick={() => {
                  openUpdateModalY(p._id);
                }}
              >
                Chưa thanh toán
              </Button>
            ) : p.status.$numberDecimal === "1" ? (
              <Button
                variant="warning"
                style={{ width: "60%" }}
                onClick={() => {
                  openUpdateModalY(p._id);
                }}
              >
                Còn nợ
              </Button>
            ) : (
              <Button variant="success" style={{ width: "60%" }}>
                Thanh toan
              </Button>
            )
          ) : p.status.$numberDecimal === "0" ? (
            <Button
              variant="danger"
              style={{ width: "60%" }}
            >
              Chưa thanh toán
            </Button>
          ) : p.status.$numberDecimal === "1" ? (
            <Button
              variant="warning"
              style={{ width: "60%" }}
            >
              Còn nợ
            </Button>
          ) : (
            <Button variant="success" style={{ width: "60%" }}>
              Thanh toan
            </Button>
          )}
        </>
      ),
      action: (
        <>
          {tempEye === true ? (
            <FaEdit
              onClick={() => {
                openUpdateModal(p._id);
              }}
              cursor={"pointer"}
              size={25}
            />
          ) : (
            <FaRegEye
              onClick={() => {
                openUpdateModal(p._id);
              }}
              cursor={"pointer"}
              size={25}
            ></FaRegEye>
          )}
        </>
      ),
    };
  });

  return (
    <div>
      {" "}
      {/* Direct Payment */}
      <PaymentY
        show={isShowUpdateY}
        PKID={pkID}
        handleClose={closeUpdateModalY}
        loadDataFilterByDate={loadDataFilterByDate}
      />
      {/* Update Modal */}
      <DocMedicalPaperModal
        opac={opac}
        closeMedpaper={closeMedpaper}
        PKID={pkID}
        closeModal={closeUpdateModal}
        isVisible={isShowUpdate}
        loadData={loadDataFilterByDate}
        openMedPaper={openMedPaper}
        user={user}
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
                }}
                defaultValue={[
                  moment(new Date(), dateFormat),
                  moment(new Date(), dateFormat),
                ]}
                style={{ marginRight: "20px" }}
              />
              {/* </Space> */}
              {/* Add Modal */}

              <MedicalPaperModal loadData={loadDataFilterByDate} user={user} />
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
