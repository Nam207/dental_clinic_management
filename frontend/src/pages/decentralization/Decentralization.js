import { DownOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Space, Table } from "antd";
import { Checkbox } from "antd";
import axios from "../../apis/api";
import React, { useState, useEffect, Component } from "react";
import "./decentralization.css";
import { Button } from "antd";
import { FaRedoAlt, FaEdit } from "react-icons/fa";
import SwalCard from "../../components/CardErr";
import Swal from "sweetalert2";
import { logDOM } from "@testing-library/react";
const Decentralization = () => {
  const [role, setRole] = useState([]);
  const [function1, setFuction1] = useState([]);
  const [permission, setPermission] = useState([]);
  const [initPermission, setInitPermission] = useState([]);
  const [filteredData, setfilteredData] = useState([]);
  const [cl, setCl] = useState(false);

  const getPermission = async () => {
    await axios.get(`/api/permission/`).then(async (response) => {
      // await setInitPermission(response.data);
      setPermission(response.data);
    });
  };
  const getInitPermission = async () => {
    await axios.get(`/api/permission/`).then((response) => {
      setInitPermission(response.data);
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

  const expandedRowRender = (e) => {
    const roleId = e.key;
    let indexRole = findIndexByProperty(permission, "roleId", roleId);

    const onChange = (e) => {
      const functionId = e.target.options.value;
      const action = e.target.options.key;
      let indexFunction = findIndexByProperty(
        permission[indexRole].permissionArray,
        "functionId",
        functionId
      );
      switch (action) {
        case "add":
          permission[indexRole].permissionArray[indexFunction].add =
            e.target.checked;
          break;
        case "edit":
          permission[indexRole].permissionArray[indexFunction].edit =
            e.target.checked;
          break;
        case "delete":
          permission[indexRole].permissionArray[indexFunction].delete =
            e.target.checked;
          break;
        case "view":
          permission[indexRole].permissionArray[indexFunction].view =
            e.target.checked;
          break;
        default:
      }
    };

    const columnsRole = [
      {
        title: "Chức năng",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Thêm",
        dataIndex: "add",
        key: "add",
        //render: () => <Checkbox onChange={onChange}>Checkbox</Checkbox>
      },
      {
        title: "Sửa",
        dataIndex: "edit",
        key: "edit",
        //render: () => <Checkbox onChange={onChange}>Checkbox</Checkbox>
      },
      {
        title: "Xóa",
        dataIndex: "delete",
        key: "delete",
        //render: () => <Checkbox onChange={onChange}>Checkbox</Checkbox>
      },
      {
        title: "Xem",
        dataIndex: "view",
        key: "view",
        //render: () => <Checkbox onChange={onChange}>Checkbox</Checkbox>
      },
    ];

    const dataRole = [];

    function1.forEach((f) => {
      let indexFunction = findIndexByProperty(
        permission[indexRole].permissionArray,
        "functionId",
        f._id
      );
      console.log(indexFunction);
      console.log(permission[indexRole].permissionArray[indexFunction]);
      const add = permission[indexRole].permissionArray[indexFunction].add;
      const edit = permission[indexRole].permissionArray[indexFunction].edit;
      const deleteCheck =
        permission[indexRole].permissionArray[indexFunction].delete;
      const view = permission[indexRole].permissionArray[indexFunction].view;
      dataRole.push({
        key: f._id,
        name: f.name,
        add: (
          <Checkbox
            options={{ label: "", value: f._id, key: "add" }}
            onChange={onChange}
            defaultChecked={add}
          ></Checkbox>
        ),
        edit: (
          <Checkbox
            options={{ label: "", value: f._id, key: "edit" }}
            onChange={onChange}
            defaultChecked={edit}
          ></Checkbox>
        ),
        delete: (
          <Checkbox
            options={{ label: "", value: f._id, key: "delete" }}
            onChange={onChange}
            defaultChecked={deleteCheck}
          ></Checkbox>
        ),
        view: (
          <Checkbox
            options={{ label: "", value: f._id, key: "view" }}
            onChange={onChange}
            defaultChecked={view}
          ></Checkbox>
        ),
      });
    });

    return (
      <div style={{ marginLeft: "100px", marginRight: "100px" }}>
        <Table columns={columnsRole} dataSource={dataRole} pagination={false} />
      </div>
    );
  };

  const columns = [
    {
      title: "Phân Quyền",
      dataIndex: "name",
      key: "name",
      className: "thTh"
    },
  ];
  const data = [];

  useEffect(() => {
    getRole();
    getFuction();
    getPermission();
    getInitPermission();
  }, []);

  // useEffect(() => {
  //   console.log("chay");
  //   getRole();
  //   getFuction();
  //   getPermission();
  //   getInitPermission();
  // }, [cl]);

  for (let i = 0; i < role.length; i++) {
    data.push({
      key: role[i]._id,
      name: `${role[i].name}`,
      value: role[i]._id,
    });
  }

  const getRole = async () => {
    await axios.get(`/api/role/`).then(async (response) => {
      setRole(response.data);
    });
  };

  const getFuction = async () => {
    await axios.get(`/api/function/`).then(async (response) => {
      setFuction1(response.data);
    });
  };

  const eventLoadData = () => {
    window.location.reload();
  };

  const eventBack = () => {
    window.location.href = "/";
  };

  const eventSave = async () => {
    try {
      const res = await axios({
        url: "/api/permission",
        method: "put",
        data: {
          permission,
        },
      });
      if (res.success === 1) {
        disPlaySuccess();
      }
    } catch (err) {
      disPlayError();
    }
  };
  const disPlaySuccess = () => {
    Swal.fire("Thành Công", `Lưu Lại Thành Công`, "success");
  };
  const disPlayError = () => {
    Swal.fire("Thất Bại", `Lưu Lại Thất Bại`, "success");
  };

  return (
    <>
      <div style={{ marginLeft: "100px", marginRight: "100px" }}>
        <Table
          columns={columns}
          expandable={{
            expandedRowRender,
            defaultExpandedRowKeys: ["0"],
          }}
          dataSource={data}
          pagination={false}
        />
        </div>
       <div style={{ marginLeft: "100px", marginRight: "100px",marginTop: "20px"}}>
        <div className="btn_Huy">
          <Button
            onClick={eventBack}
            style={{
              float: "right",
              marginRight: "10px",
              borderRadius: "5px",
              width: "100px",
              height: "38px",
              backgroundColor: "#7E7E7E",
              color: "white",
            }}
          >
            Hủy
          </Button>
        </div>

        <div className="btn_Luu">
          <Button
            type="primary"
            onClick={eventSave}
            style={{
              float: "right",
              marginRight: "10px",
              borderRadius: "5px",
              width: "100px",
              height: "38px",
            }}
          >
            Lưu Lại
          </Button>
        </div>
        <div>
          <Button
            type="primary"
            onClick={eventLoadData}
            style={{
              float: "right",
              marginRight: "10px",
              borderRadius: "5px",
              width: "100px",
              height: "38px",
            }}
          >
            <FaRedoAlt /> Tải lại
          </Button>
        </div>
      </div>
    </>
  );
};
export default Decentralization;
