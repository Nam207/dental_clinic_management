import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaPlusCircle, FaSearch } from "react-icons/fa";
import {
  Select,
  Pagination,
  Table as TableAntd,
  Form as FormAntd,
  Space,
  Tag,
} from "antd";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "../../apis/api";

const AdCusSearch = ({
  closeMedPaper,
  openMedPaper,
  setSingleSelections,
  fillCusDataByName,
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    openMedPaper();
    setShow(false);
  };
  const handleShow = () => {
    closeMedPaper();
    setShow(true);
  };

  const [singleCusName, setSingleCusName] = useState([]);
  const [singleCusPhone, setSingleCusPhone] = useState([]);
  const [singleCusEmail, setSingleCusEmail] = useState([]);

  const [customerName, setCustomerName] = useState([]);
  const [customerPhone, setCustomerPhone] = useState([]);
  const [customerEmail, setCustomerEmail] = useState([]);

  //infor customer for table
  const [cusTable, setCusTable] = useState([]);

  const findCusByName = async (e) => {
    const response = await axios.get(`api/customer/${e[0].id}`);
    console.log(response.data);
    setCusTable([response.data]);
  };

  const findCusByPhone = async (e) => {
    const response = await axios.get(`api/customer/${e[0].id}`);
    console.log(response.data);
    setCusTable([response.data]);
  };

  const loadCustomerData = () => {
    axios
      .get("/api/customer/allCustomer")
      .then((response) => {
        // console.log(response.data.data);
        setCustomerName([
          // ...customerId,
          ...response.data.map((item) => ({
            name: item.fullname,
            id: item._id,
          })),
        ]);

        setCustomerPhone([
          // ...customerId,
          ...response.data.map((item) => ({
            name: item.phone,
            id: item._id,
          })),
        ]);

        //có Customer không trả về Email
        // setCustomerEmail([
        //   // ...customerId,
        //   ...response.data.data.map((item) => ({
        //     name: item.email,
        //     id: item._id,
        //   })),
        // ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    loadCustomerData();
  }, []);
  // singleCusName, singleCusPhone
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
      // width: "180px",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      align: "center",
      // width: "180px",
      // sorter: (a, b) => a.price - b.price,
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   align: "center",
    //   filters: [
    //     {
    //       text: "Hoạt động",
    //       value: `AiOutlineCheck`,
    //     },
    //     {
    //       text: "Không hoạt động",
    //       value: `AiOutlineCloseCircle`,
    //     },
    //   ],
    //   onFilter: (value, record) => record.status.type.name === value,
    // },
    // {
    //   title: " ",
    //   dataIndex: "action",
    //   align: "center",
    // },
  ];

  let data = cusTable.map((cus) => {
    return {
      key: cus._id,
      _id: cus._id,
      phone: cus.phone,
      fullname: cus.fullname,
      address: cus.address,
    };
  });

  // const data = [
  //   {
  //     key: "asd",
  //     _id: "asd",
  //     phone: "asdfasdf",
  //     fullname: "Longggg",
  //     address: "Ha Noiii",
  //   },
  // ];

  return (
    <>
      <Button
        variant="info"
        onClick={handleShow}
        style={{ marginRight: "20px", width: `200px` }}
      >
        <FaSearch></FaSearch> Tìm kiếm KH
        {/* <div style={{ color: "white", display: "inline" }}>Tìm kiếm KH</div> */}
      </Button>

      <Modal id="AdCus" size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tìm kiếm khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormAntd name="basic">
            <Row className="mb-3" style={{ margin: "5px" }}>
              <Form.Label column sm={2}>
                Khách Hàng
                <span
                  style={{
                    display: "inline",
                    marginBottom: "0px",
                    color: "red",
                  }}
                >
                  {" "}
                  *
                </span>
              </Form.Label>
              <Col sm={3}>
                <Typeahead
                  // clearButton
                  id="basic-typeahead-single"
                  labelKey="name"
                  onChange={(e) => {
                    // fillCusDataByName(e);
                    // console.log(e);
                    findCusByName(e);
                    setSingleCusName(e);
                    setSingleCusPhone([]);
                  }}
                  options={customerName}
                  placeholder="Chọn tên KH"
                  selected={singleCusName}
                />
              </Col>
              <Col sm={4}>
                <Typeahead
                  // clearButton
                  id="basic-typeahead-single"
                  labelKey="name"
                  onChange={(e) => {
                    // fillCusDataByName(e);
                    // console.log(e);
                    findCusByPhone(e);
                    setSingleCusPhone(e);
                    setSingleCusName([]);
                  }}
                  options={customerPhone}
                  placeholder="Chọn số điện thoại"
                  selected={singleCusPhone}
                />
              </Col>
              {/* <Col sm={3}>
                <FormAntd.Item
                  name="BS"
                  rules={[
                    {
                      required: true,
                      message: "Nhập tên khách hàng",
                    },
                  ]}
                >
                  <Typeahead
                    id="basic-typeahead-single"
                    labelKey="name"
                    onChange={(e) => {
                      // fillCusDataByName(e);
                      // console.log(e);
                      setSingleCusEmail(e);
                    }}
                    options={customerEmail}
                    placeholder="Chọn email"
                    selected={singleCusEmail}
                  />
                </FormAntd.Item>
              </Col> */}
            </Row>

            {/* Table for searched customers */}
            <hr />
            <TableAntd
              columns={columns}
              dataSource={data}
              onRow={(r) => ({
                //add thong tin ve phieu kham
                onClick: () => {
                  let temp = [
                    { id: cusTable[0]._id, name: cusTable[0].fullname },
                  ];
                  setSingleSelections(temp);
                  fillCusDataByName(temp);
                  handleClose();
                },
              })}
            ></TableAntd>
          </FormAntd>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AdCusSearch;
