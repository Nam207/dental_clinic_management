import React, { useState, useEffect, Component } from "react";
import "./dashBoard.css";
import { SnippetsOutlined,SnippetsFilled } from "@ant-design/icons";
import { Space, Table, Tag } from 'antd';
const DashBoard = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      filters: [
        {
          text: 'Joe',
          value: 'Joe',
        },
        {
          text: 'Jim',
          value: 'Jim',
        },
        {
          text: 'Submenu',
          value: 'Submenu',
          children: [
            {
              text: 'Green',
              value: 'Green',
            },
            {
              text: 'Black',
              value: 'Black',
            },
          ],
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend'],
    },
    {
      title: 'Age',
      dataIndex: 'age',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      filters: [
        {
          text: 'London',
          value: 'London',
        },
        {
          text: 'New York',
          value: 'New York',
        },
      ],
      onFilter: (value, record) => record.address.indexOf(value) === 0,
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park',
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };
  const columns1 = [
    {
      title: 'Name',
      dataIndex: 'name',
      filters: [
        {
          text: 'Joe',
          value: 'Joe',
        },
        {
          text: 'Jim',
          value: 'Jim',
        },
        {
          text: 'Submenu',
          value: 'Submenu',
          children: [
            {
              text: 'Green',
              value: 'Green',
            },
            {
              text: 'Black',
              value: 'Black',
            },
          ],
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend'],
    },
    {
      title: 'Age',
      dataIndex: 'age',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      filters: [
        {
          text: 'London',
          value: 'London',
        },
        {
          text: 'New York',
          value: 'New York',
        },
      ],
      onFilter: (value, record) => record.address.indexOf(value) === 0,
    },
  ];
  const data1 = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park',
    },
  ];
  const onChange1 = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };
  return (
    <section className="vh-100" style={{marginTop:"10px"}}>
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-6">
            <div className="right__main">
              <div className="row row-cols-3 mb-4">
                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient1 text-shadow relative"
                    href=""
                  >
                    <i className="h3 fa fa-book">
                      <SnippetsOutlined />
                    </i>
                    <div className="text font-weight-bold text-shadow">
                      Phiếu khám 
                    </div>
                  </a>
                </div>

                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient2 text-shadow relative"
                    href="/medicine"
                  >
                    <i className="h3 fa fa-book">
                      <SnippetsOutlined />
                    </i>
                    <div className="text font-weight-bold">
                      Đăng ký thuốc
                    </div>
                  </a>
                </div>

                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient3 text-shadow relative"
                    href="/service"
                  >
                    <i className="h3 fa fa-book">
                      <SnippetsOutlined />
                    </i>
                    <div className="text font-weight-bold">
                      Đăng ký thủ thuật
                    </div>
                  </a>
                </div>
              </div>
              <div className="row row-cols-3 mb-4">
                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient4 text-shadow relative"
                    href="/customer"
                  >
                    <i className="h3 fa fa-book text-shadow">
                      <SnippetsOutlined />
                    </i>
                    <div className="text font-weight-bold text-shadow">
                      Khách Hàng
                    </div>
                  </a>
                </div>

                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient5 text-shadow relative"
                    href=""
                  >
                    <i className="h3 fa fa-book">
                      <SnippetsOutlined />
                    </i>
                    <div className="text font-weight-bold">
                      Doanh thu
                    </div>
                  </a>
                </div>

                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient6 text-shadow relative"
                    href="/staff"
                  >
                    <i className="h3 fa fa-book">
                      <SnippetsOutlined />
                    </i>
                    <div className="text font-weight-bold">
                      Nhân viên
                    </div>
                  </a>
                </div>
              </div>
              
            </div>
          </div>

          <div className="col-md-4 col-lg-6 col-xl-6 offset-xl">
            <div className="col-md-12 col-lg-12 col-xl-12">
              <div className="col-md-12 col-lg-8 col-xl-9 left__main">
                <div className="" >
                  <h3>Phiếu khám</h3>
                <Table columns={columns} dataSource={data} onChange={onChange} />
                </div>
                <div className="" style={{marginTop:"20px"}}>
                <h3>Nhân viên</h3>
                <Table columns={columns1} dataSource={data1} onChange={onChange1} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default DashBoard;
