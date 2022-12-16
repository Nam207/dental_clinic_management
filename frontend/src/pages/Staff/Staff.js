import React, { useState, useEffect, Component } from "react";
import { Button } from "antd";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FaRedoAlt, FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import ModaladdStaff from "./ModaladdStaff";
import { AiOutlineCheck, AiOutlineCloseCircle } from "react-icons/ai";
import { Pagination, Table, Tag } from "antd";
import axios from "../../apis/api";
import Editstaff from "./EditStaff";
import Swal from "sweetalert2";
import CustomToast from "../../components/CustomToast";

function Staff({user}) {
  const [meds, setMeds] = useState([]);
  const [searchEmployee, setsearchEmployee] = useState("");

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  const [isShowUpdate, setIsShowUpdate] = useState(false);
  const [empId, setEmpId] = useState("");

  const [fillrole, setFillroll] = useState([]);

  const loadData = async () => {
    // medicineProcessor.getAll("", 1, "");
    const response = await axios
      .get(
        `/api/profile?keyword=${searchEmployee}&offset=${offset}&limit=${limit}`
      )
      .then((response) => {
        // response.success === 1 &&
        //   setMeds(response.data.data) &&
        // setTotal(response.data.total);

        if (response.success === 1) {
          setMeds(response.data.data);
          setTotal(response.data.total);
        }
      });

    const fillrole = await axios.get(`/api/role/`).then((fillrole) => {
      // response.success === 1 &&
      //   setMeds(response.data.data) &&
      // setTotal(response.data.total);

      if (fillrole.success === 1) {
        setFillroll(fillrole.data);
      }
    });
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

  const handleSearch = (e) => {
    setsearchEmployee(e.target.value);
  };

  const openUpdateModal = (id) => {
    console.log(id);
    setIsShowUpdate(true);
    setEmpId(id);
  };

  const closeUpdateModal = () => {
    setEmpId("");
    setIsShowUpdate(false);
  };

  const onChangePage = (current, pageSize) => {
    setOffset(current - 1);
    setLimit(pageSize);
  };

  useEffect(() => {
    loadData();
  }, [offset, searchEmployee, limit]);

  const columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "_id",
      align: "center",
      // defaultSortOrder: "descend",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Tên nhân viên",
      dataIndex: "fullname",
      align: "center",
      sorter: (a, b) => a.fullname.length - b.fullname.length,
    },
    {
      title: "Chức danh",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (_, { role }) => (
        <>
          {role.map((tag) => {
            let color;
            if (tag.name === "Bác sĩ") {
              color = "volcano";
            }
            if (tag.name === "Kỹ thuật viên") {
              color = "green";
            }
            if (tag.name === "Lễ tân") {
              color = "blue";
            }
            return (
              <Tag color={color} key={tag._id}>
                {tag.name}
              </Tag>
            );
          })}
        </>
      ),

      filters: fillrole.map((element) => {
        return {
          text: element.name,
          value: element._id,
        };
      }),
      onFilter: (value, record) => {
        let temp = false;
        record.role.map((element) => {
          if (element._id === value) {
            temp = true;
            return;
          }
        });
        return temp;
      },
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      align: "center",
      // tableLayout: "fixed",
      // wordWrap: "break-word",
      ellipsis: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      align: "center",
      // tableLayout: "fixed",
      // wordWrap: "break-word",
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
      fullname: med.fullname,
      role: med.role,
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
                  resul = await axios({
                    url: `/api/profile/${med._id}/${temp}`,
                    method: "put",
                  });
                } else if (result.isDenied) {
                }
              });
              if (resul.success === 1) {
                showToast(`Cập nhật id: ${med._id} thành công`, true);
                await loadData();
              }
              if (resul.success !== 1) {
                Swal.fire(
                  "Thất bại",
                  `Cập nhật thất bại tại id=${med._id}`,
                  "failed"
                );
              }
            }}
          />
        </>
      ),
    };
  });

  console.log(user)

  return (
    <>
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
                Danh sách nhân viên
              </h4>
            </Nav>
            <Form className="d-flex">
              <ModaladdStaff userAA={user} loadData={loadData} />
              <Button type="primary" onClick={loadData} style={{ marginRight: "20px",borderRadius:"5px",width:"100px",height:"38px" }}>
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
      {/* thêm 1 thanh search */}
      <Editstaff
        closeModal={closeUpdateModal}
        isVisible={isShowUpdate}
        empId={empId}
        loadData={loadData}
        userAB={user}
      />

      <div style={{ marginLeft: "100px", marginRight: "100px" }}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              style={{ marginTop: "20px" }}
              placeholder="Tìm kiếm"
              autoFocus
              onChange={handleSearch}
            />
          </Form.Group>
        </Form>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
      <div id="pagin" style={{ marginTop: "10px" }}>
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
}

export default Staff;
