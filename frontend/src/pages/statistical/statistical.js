import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import axios from "../../apis/api";
import { DatePicker } from "antd";
import { FaRedoAlt } from "react-icons/fa";
import "./statistical.css";
import { Typeahead } from "react-bootstrap-typeahead";
import { Select, Pagination, Table as TableAntd, Form as FormAntd } from "antd";
function Statistical() {
  const [show, setShow] = React.useState(true);
  
  return (
    <>
      <div
        style={{
          marginLeft: "80px",
          marginRight: "80px",
          marginTop: "20px",
          border: "1px solid #E9ECEF",
        }}
      >
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
                  Khách hàng chờ làm thủ thuật
                </h4>
              </Nav>

              <Form className="d-flex">
                <Button variant="primary" style={{ marginRight: "20px" }} onClick={() => setShow(!show)} >
                {show ? "Ẩn điều kiện" : "Hiện điều kiện"}
                </Button>
                <Button variant="primary" style={{ marginRight: "20px" }}>
                  Thống Kê
                </Button>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      {show && 
      <div
      className="card-body collapse show"
      style={{
        marginLeft: "80px",
        marginRight: "80px",
        border: "1px solid #E9ECEF",
      }}
    >
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <div className="form-group row">
            <label className="col-2 col-form-label form-control-label">
              {" "}
              Loại thống kê{" "}
            </label>
            <div className="col-10">
              <select className="form-control">
                <option selected="selected" value="1">
                  Khách hàng
                </option>
                <option value="2">Ngày</option>
                <option value="17">Hình thức thanh toán</option>
                <option value="4">Thủ thuật</option>
                <option value="6">Nhân viên</option>
              </select>
            </div>
          </div>

          <div className="form-group row" style={{ marginTop: "24px" }}>
            <label class="col-2 col-form-label form-control-label">
              {" "}
              Nhân viên{" "}
            </label>

            <div class="col-5">
              <FormAntd.Item
                name="BS"
                rules={[
                  {
                    required: true,
                    message: "Nhập tên nhân viên",
                  },
                ]}
              >
                <Typeahead
                  id="basic-typeahead-single"
                  labelKey="name"
                  placeholder="Từ nhân viên"
                />
              </FormAntd.Item>
            </div>
            <div class="col-5">
              <FormAntd.Item
                name="BS"
                rules={[
                  {
                    required: true,
                    message: "Nhập tên nhân viên",
                  },
                ]}
              >
                <Typeahead
                  id="basic-typeahead-single"
                  labelKey="name"
                  placeholder="Đến nhân viên"
                />
              </FormAntd.Item>
            </div>
          </div>
          <div className="form-group row">
            <label class="col-2 col-form-label form-control-label">
              {" "}
              Khách hàng{" "}
            </label>

            <div class="col-5">
              <FormAntd.Item
                name="BS"
                rules={[
                  {
                    required: true,
                    message: "Nhập tên nhân viên",
                  },
                ]}
              >
                <Typeahead
                  id="basic-typeahead-single"
                  labelKey="name"
                  placeholder="Từ khách hàng"
                />
              </FormAntd.Item>
            </div>
            <div class="col-5">
              <FormAntd.Item
                name="BS"
                rules={[
                  {
                    required: true,
                    message: "Nhập tên nhân viên",
                  },
                ]}
              >
                <Typeahead
                  id="basic-typeahead-single"
                  labelKey="name"
                  placeholder="Đến khách hàng"
                />
              </FormAntd.Item>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-sm-12">
          <div className="form-group row">
            <label class="col-2 col-form-label form-control-label">
              {" "}
              Ngày thống kê{" "}
            </label>

            <div class="col-10" style={{ display: "flex" }}>
              <DatePicker.RangePicker style={{ textAlign: "center" }} />
            </div>
          </div>

          <div className="form-group row" style={{ marginTop: "24px" }}>
            <label class="col-2 col-form-label form-control-label">
              {" "}
              Thủ thuật{" "}
            </label>

            <div class="col-5">
              <FormAntd.Item
                name="BS"
                rules={[
                  {
                    required: true,
                    message: "Nhập tên nhân viên",
                  },
                ]}
              >
                <Typeahead
                  id="basic-typeahead-single"
                  labelKey="name"
                  placeholder="Từ thủ thuật"
                />
              </FormAntd.Item>
            </div>
            <div class="col-5">
              <FormAntd.Item
                name="BS"
                rules={[
                  {
                    required: true,
                    message: "Nhập tên nhân viên",
                  },
                ]}
              >
                <Typeahead
                  id="basic-typeahead-single"
                  labelKey="name"
                  placeholder="Đến thủ thuật"
                />
              </FormAntd.Item>
            </div>
          </div>
        </div>
      </div>
    </div>
      }
        
    </>
  );
}

export default Statistical;
