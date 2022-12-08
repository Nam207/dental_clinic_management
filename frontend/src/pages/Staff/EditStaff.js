import React, { useState, useEffect, Component } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../apis/api";
import { Select, Input, Button, Modal, Form } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { Space, TimePicker } from "antd";
import { Checkbox } from "antd";
import dayjs from "dayjs";
import { FaRedoAlt, FaEdit } from "react-icons/fa";

import Swal from "sweetalert2";
import moment from "moment";

const { TextArea } = Input;
function Editstaff({ empId, isVisible, closeModal, loadData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState([]);
  const [open, setOpen] = useState(false);
  const [disabled2, setDisabled2] = useState(false);
  const [disabled3, setDisabled3] = useState(false);
  const [disabled4, setDisabled4] = useState(false);
  const [disabled5, setDisabled5] = useState(false);
  const [disabled6, setDisabled6] = useState(false);
  const [disabled7, setDisabled7] = useState(false);
  const [disabledcn, setDisabledcn] = useState(false);
  const format = "HH:mm";

  const [value2, setValue2] = useState([]);
  const [value3, setValue3] = useState([]);
  const [value4, setValue4] = useState([]);
  const [value5, setValue5] = useState([]);
  const [value6, setValue6] = useState([]);
  const [value7, setValue7] = useState([]);
  const [valuecn, setValuecn] = useState([]);

  const [profile, setProfile] = useState({});
  const [empPhone, setempPhone] = useState("");
  const [empEmail, setempEmail] = useState("");

  const toggleDisablet2 = () => {
    setDisabled2([]);
    if (disabled2) {
      removeSchedule("monday");
    }
    setDisabled2(!disabled2);
  };
  const toggleDisablet3 = () => {
    setValue3([]);
    if (disabled3) {
      removeSchedule("tuesday");
    }
    setDisabled3(!disabled3);
  };
  const toggleDisablet4 = () => {
    setValue4([]);
    if (disabled4) {
      removeSchedule("wednesday");
    }
    setDisabled4(!disabled4);
  };
  const toggleDisablet5 = () => {
    setValue5([]);
    if (disabled5) {
      removeSchedule("thursday");
    }
    setDisabled5(!disabled5);
  };
  const toggleDisablet6 = () => {
    setValue6([]);
    if (disabled6) {
      removeSchedule("friday");
    }
    setDisabled6(!disabled6);
  };
  const toggleDisablet7 = () => {
    setValue7([]);
    if (disabled7) {
      removeSchedule("saturday");
    }
    setDisabled7(!disabled7);
  };
  const toggleDisabletcn = () => {
    setValuecn([]);
    if (disabledcn) {
      removeSchedule("sunday");
    }
    setDisabledcn(!disabledcn);
  };

  let options = [];
  const getRole = async () => {
    await axios.get(`/api/role/`).then(async (response) => {
      // console.log(response.data);
      setRole(response.data);
    });
  };

  const getProfile = async () => {
    await axios.get(`/api/profile/${empId}`).then(async (response) => {
      console.log(response.data);
      setProfile(response.data);
      setempPhone(response.data.phone);
      setempEmail(response.data.email);
      response.data.scheduleArray.map((schedule) => {
        let startTime = moment();
        startTime.hours(schedule.start_time_hours);
        startTime.minutes(schedule.start_time_minutes);
        let endTime = moment();
        endTime.hours(schedule.end_time_hours);
        endTime.minutes(schedule.end_time_minutes);
        switch (schedule.weekday) {
          case "monday":
            setDisabled2(true);
            setValue2([startTime, endTime]);
            break;
          case "tuesday":
            setDisabled3(true);
            setValue3([startTime, endTime]);
            break;
          case "wednesday":
            setDisabled4(true);
            setValue4([startTime, endTime]);
            break;
          case "thursday":
            setDisabled5(true);
            setValue5([startTime, endTime]);
            break;
          case "friday":
            setDisabled6(true);
            setValue6([startTime, endTime]);
            break;
          case "saturday":
            setDisabled7(true);
            setValue7([startTime, endTime]);
            break;
          case "sunday":
            setDisabledcn(true);
            setValuecn([startTime, endTime]);
            break;
          default:
        }
      });
    });
  };

  useEffect(() => {
    // console.log(empId);
    if (empId) {
      getRole();
      getProfile();
      setValue2([]);
      setValue3([]);
      setValue4([]);
      setValue5([]);
      setValue6([]);
      setValue7([]);
      setValuecn([]);
      setDisabled2(false);
      setDisabled3(false);
      setDisabled4(false);
      setDisabled5(false);
      setDisabled6(false);
      setDisabled7(false);
      setDisabledcn(false);
    }
  }, [empId]);

  role.forEach((role) => {
    options.push({
      label: role.name,
      value: role._id,
    });
  });
  const formik = useFormik({
    initialValues: {
      fullname: profile.fullname,
      phone: profile.phone,
      competence: profile.roleArray,
      address: profile.address,
      email: profile.email,
      numberOfWorkdays: profile.workingDays,
      salary: profile.salary,
      schedule: profile.scheduleArray,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      fullname: Yup.string()
        .required("Không được trống")
        .min(2, "Phải dài hơn 2 kí tự"),
      phone: Yup.string()
        .required("Không được trống")
        .typeError("Không phải là dạng số")
        .matches(
          /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
          "Số điện thoại phải chữ số và có 10 số"
        )
        .test(
          "Số điện thoại độc nhất",
          "Số điện thoại đang được sử dụng", // <- key, message
          function (value) {
            return new Promise((resolve, reject) => {
              axios
                .get(`/api/profile/checkPhone/${value}`)
                .then((res) => {
                  if (res.success === 1 || empPhone === value) {
                    resolve(true);
                  } else resolve(false);
                })
                .catch((error) => {
                  if (
                    error.response.data.content === "Số điện thoại đã bị lấy"
                  ) {
                    resolve(false);
                  }
                });
            });
          }
        ),

      competence: Yup.array()
        .required("Không được trống")
        .min(1, "Không được trống"),
      address: Yup.string(),
      email: Yup.string()
        .required("Không được trống")
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email sai định dạng")
        .test(
          "Email độc nhất",
          "Email đang được sử dụng", // <- key, message
          function (value) {
            return new Promise((resolve, reject) => {
              axios
                .get(`/api/profile/checkEmail/${value}`)
                .then((res) => {
                  if (res.success === 1 || empEmail === value) {
                    resolve(true);
                  } else resolve(false);
                })
                .catch((error) => {
                  if (error.response.data.content === "Email đã bị lấy") {
                    resolve(false);
                  }
                });
            });
          }
        ),
      numberOfWorkdays: Yup.number()
        .typeError("Không phải là dạng số")
        .required("Không được để trống")
        .positive("Phải là số dương")
        .max(30, "Không được quá 30 ngày công")
        .integer("Phải là số nguyên dương"),
      salary: Yup.number()
        .typeError("Không phải là dạng số")
        .required("Không được để trống")
        .positive("Phải là số dương")
        .integer("Phải là số nguyên dương"),
      schedule: Yup.array().min(1, "Không được trống"),
    }),

    onSubmit: async (values) => {
      const {
        fullname,
        phone,
        competence,
        address,
        email,
        numberOfWorkdays,
        salary,
        schedule,
      } = values;
      try {
        const res = await axios({
          url: `api/profile/${empId}`,
          method: "put",
          data: {
            fullname,
            phone,
            role: competence,
            address,
            email,
            workingDays: numberOfWorkdays,
            salary,
            schedule,
          },
        });

        if (res.success) {
          loadData();
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            closeModal();
            disPlay();
          }, 3000);
        }
      } catch (err) {}
      console.log(values);
    },
  });
  const disPlay = () => {
    Swal.fire("Thành Công", `Sửa thành công ${empId}`, "success");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    formik.handleSubmit();
    if (Object.keys(formik.errors).length !== 1) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function findIndexByProperty(data, key, value) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][key] === value) {
        return i;
      }
    }
    return -1;
  }
  const removeSchedule = (weekday) => {
    const index = findIndexByProperty(
      formik.values.schedule,
      "weekday",
      weekday
    );
    if (index > -1) {
      formik.values.schedule.splice(index, 1);
    }
  };

  const pushSchedule = (e, weekday) => {
    let scheduleTemp = {
      start_time_hours: e[0]._d.getHours(),
      start_time_minutes: e[0]._d.getMinutes(),
      end_time_hours: e[1]._d.getHours(),
      end_time_minutes: e[1]._d.getMinutes(),
      weekday: weekday,
    };
    const index = findIndexByProperty(
      formik.values.schedule,
      "weekday",
      weekday
    );
    if (index > -1) {
      formik.values.schedule[index] = scheduleTemp;
    } else {
      formik.values.schedule.push(scheduleTemp);
    }
    let startTime = moment();
    startTime.hours(e[0]._d.getHours());
    startTime.minutes(e[0]._d.getMinutes());
    let endTime = moment();
    endTime.hours(e[1]._d.getHours());
    endTime.minutes(e[1]._d.getMinutes());
    switch (weekday) {
      case "monday":
        setValue2([startTime, endTime]);
        break;
      case "tuesday":
        setValue3([startTime, endTime]);
        break;
      case "wednesday":
        setValue4([startTime, endTime]);
        break;
      case "thursday":
        setValue5([startTime, endTime]);
        break;
      case "friday":
        setValue6([startTime, endTime]);
        break;
      case "saturday":
        setValue7([startTime, endTime]);
        break;
      case "sunday":
        setValuecn([startTime, endTime]);
        break;
      default:
    }
  };

  return (
    <>
      <Modal
        title="Sửa Nhân Viên"
        open={isVisible}
        onCancel={closeModal}
        width={1000}
        footer={[
          <Button
            key="back"
            onClick={closeModal}
            style={{
              backgroundColor: "#7F7F7F",
              width: "80px",
              color: "white,",
              borderRadius: "5px",
            }}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="#595959"
            loading={loading}
            onClick={handleOk}
            htmlType="submit"
            style={{
              backgroundColor: "#386BC0",
              width: "120px",
              borderRadius: "5px",
              color: "white",
            }}
          >
            Lưu lại
          </Button>,
        ]}
        // footer={null}
      >
        <Form onSubmit={formik.handleSubmit}>
          <div className="container">
            <div className="row">
              <div
                className="col-12 form-group"
                style={{ marginBottom: "20px" }}
              >
                <label>Mã nhân viên</label>
                <Input
                  rows={2}
                  type="text"
                  id="employeeCode"
                  name="employeeCode"
                  disabled
                  value={empId}
                  onChange={formik.handleChange}
                />
              </div>
              <div
                className="col-6 form-group "
                style={{ marginBottom: "20px" }}
              >
                <label>Tên nhân viên</label>
                <Input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formik.values.fullname}
                  onChange={formik.handleChange}
                />

                {formik.errors.fullname && (
                  <div className="errorMsg"> {formik.errors.fullname} </div>
                )}
              </div>
              <div className="col-6 form-group">
                <label>Điện thoại</label>
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                />

                {formik.errors.phone && (
                  <div className="errorMsg"> {formik.errors.phone} </div>
                )}
              </div>
              <div className="col-6 form-group">
                <label>Chức vụ</label>
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Chọn chức vụ"
                  id="competence"
                  name="competence"
                  onChange={(value) => {
                    formik.setFieldValue("competence", value);
                  }}
                  value={formik.values.competence}
                  options={options}
                />

                {formik.errors.competence && (
                  <div className="errorMsg"> {formik.errors.competence} </div>
                )}
              </div>
              <div
                className="col-6 form-group"
                style={{ marginBottom: "20px" }}
              >
                <label>Email</label>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />

                {formik.errors.email && (
                  <div className="errorMsg"> {formik.errors.email} </div>
                )}
              </div>
              <div className="col-12 form-group">
                <label>Địa chỉ</label>
                <TextArea
                  rows={2}
                  type="text"
                  id="address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="col-6 form-group" style={{ marginTop: "20px" }}>
                <label>Số ngày công</label>
                <Input
                  type="text"
                  id="numberOfWorkdays"
                  name="numberOfWorkdays"
                  value={formik.values.numberOfWorkdays}
                  onChange={formik.handleChange}
                />

                {formik.errors.numberOfWorkdays && (
                  <div className="errorMsg">
                    {" "}
                    {formik.errors.numberOfWorkdays}{" "}
                  </div>
                )}
              </div>
              <div className="col-6 form-group" style={{ marginTop: "20px" }}>
                <label>Lương</label>
                <Input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formik.values.salary}
                  onChange={formik.handleChange}
                />

                {formik.errors.salary && (
                  <div className="errorMsg"> {formik.errors.salary} </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 container">
            <div className="row" style={{ display: "flex", marginTop: "10px" }}>
              <div className="row" style={{ marginBottom: "15px" }}>
                <div className="col-md-2" style={{ textAlign: "center" }}>
                  <span
                    className="font-medium text-lg"
                    style={{ fontSize: "15px" }}
                  >
                    Lịch làm việc:
                  </span>
                </div>
                <div className="col-md-2" style={{ textAlign: "end" }}></div>
                <div className="col-md-8" style={{ textAlign: "center" }}>
                  {formik.errors.schedule && (
                    <div className="errorMsg"> {formik.errors.schedule} </div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-md-2" style={{ textAlign: "center" }}>
                  <p className="font-weight-bold">Thứ 2:</p>
                </div>
                <div className="col-md-2" style={{ textAlign: "end" }}>
                  <Checkbox
                    onClick={toggleDisablet2}
                    checked={disabled2}
                  ></Checkbox>
                </div>
                <div className="col-md-8" style={{ textAlign: "center" }}>
                  <Space direction="vertical">
                    <TimePicker.RangePicker
                      size="large"
                      TimePicker
                      id="schedule"
                      name="schedule"
                      value={value2.length < 1 ? [null, null] : value2}
                      format={format}
                      disabled={!disabled2}
                      status="success"
                      onChange={(e) => {
                        pushSchedule(e, "monday");
                      }}
                    />
                  </Space>
                </div>
              </div>
            </div>
            <div className="row" style={{ display: "flex", marginTop: "10px" }}>
              <div className="row">
                <div className="col-md-2" style={{ textAlign: "center" }}>
                  <p className="font-weight-bold">Thứ 3:</p>
                </div>
                <div className="col-md-2" style={{ textAlign: "end" }}>
                  <Checkbox
                    onClick={toggleDisablet3}
                    checked={disabled3}
                  ></Checkbox>
                </div>
                <div className="col-md-8" style={{ textAlign: "center" }}>
                  <Space direction="vertical">
                    <TimePicker.RangePicker
                      disabled={!disabled3}
                      size="large"
                      status="success"
                      id="schedule"
                      name="schedule"
                      TimePicker
                      value={value3.length < 1 ? [null, null] : value3}
                      format={format}
                      onChange={(e) => {
                        pushSchedule(e, "tuesday");
                      }}
                    />
                  </Space>
                </div>
              </div>
            </div>
            <div className="row" style={{ display: "flex", marginTop: "10px" }}>
              <div className="row">
                <div className="col-md-2" style={{ textAlign: "center" }}>
                  <p className="font-weight-bold">Thứ 4:</p>
                </div>
                <div className="col-md-2" style={{ textAlign: "end" }}>
                  <Checkbox
                    onClick={toggleDisablet4}
                    checked={disabled4}
                  ></Checkbox>
                </div>
                <div className="col-md-8" style={{ textAlign: "center" }}>
                  <Space direction="vertical">
                    <TimePicker.RangePicker
                      size="large"
                      disabled={!disabled4}
                      status="success"
                      id="schedule"
                      name="schedule"
                      TimePicker
                      value={value4.length < 1 ? [null, null] : value4}
                      format={format}
                      onChange={(e) => {
                        pushSchedule(e, "wednesday");
                      }}
                    />
                  </Space>
                </div>
              </div>
            </div>
            <div className="row" style={{ display: "flex", marginTop: "10px" }}>
              <div className="row">
                <div className="col-md-2" style={{ textAlign: "center" }}>
                  <p className="font-weight-bold">Thứ 5:</p>
                </div>
                <div className="col-md-2" style={{ textAlign: "end" }}>
                  <Checkbox
                    onClick={toggleDisablet5}
                    checked={disabled5}
                  ></Checkbox>
                </div>
                <div className="col-md-8" style={{ textAlign: "center" }}>
                  <Space direction="vertical">
                    <TimePicker.RangePicker
                      size="large"
                      disabled={!disabled5}
                      status="success"
                      id="schedule"
                      name="schedule"
                      TimePicker
                      value={value5.length < 1 ? [null, null] : value5}
                      format={format}
                      onChange={(e) => {
                        pushSchedule(e, "thursday");
                      }}
                    />
                  </Space>
                </div>
              </div>
            </div>
            <div className="row" style={{ display: "flex", marginTop: "10px" }}>
              <div className="row">
                <div className="col-md-2" style={{ textAlign: "center" }}>
                  <p className="font-weight-bold">Thứ 6:</p>
                </div>
                <div className="col-md-2" style={{ textAlign: "end" }}>
                  <Checkbox
                    onClick={toggleDisablet6}
                    checked={disabled6}
                  ></Checkbox>
                </div>
                <div className="col-md-8" style={{ textAlign: "center" }}>
                  <Space direction="vertical">
                    <TimePicker.RangePicker
                      size="large"
                      disabled={!disabled6}
                      status="success"
                      id="schedule"
                      name="schedule"
                      TimePicker
                      // value={formik.values.schedule}
                      value={value6.length < 1 ? [null, null] : value6}
                      format={format}
                      onChange={(e) => {
                        pushSchedule(e, "friday");
                      }}
                    />
                  </Space>
                </div>
              </div>
            </div>
            <div className="row" style={{ display: "flex", marginTop: "10px" }}>
              <div className="row">
                <div className="col-md-2" style={{ textAlign: "center" }}>
                  <p className="font-weight-bold">Thứ 7:</p>
                </div>
                <div className="col-md-2" style={{ textAlign: "end" }}>
                  <Checkbox
                    onClick={toggleDisablet7}
                    checked={disabled7}
                  ></Checkbox>
                </div>
                <div className="col-md-8" style={{ textAlign: "center" }}>
                  <Space direction="vertical">
                    <TimePicker.RangePicker
                      size="large"
                      disabled={!disabled7}
                      status="success"
                      id="schedule"
                      name="schedule"
                      TimePicker
                      value={value7.length < 1 ? [null, null] : value7}
                      format={format}
                      onChange={(e) => {
                        pushSchedule(e, "saturday");
                      }}
                    />
                  </Space>
                </div>
              </div>
            </div>
            <div className="row" style={{ display: "flex", marginTop: "10px" }}>
              <div className="row">
                <div className="col-md-2" style={{ textAlign: "center" }}>
                  <p className="font-weight-bold">Chủ Nhật:</p>
                </div>
                <div className="col-md-2" style={{ textAlign: "end" }}>
                  <Checkbox
                    onClick={toggleDisabletcn}
                    checked={disabledcn}
                  ></Checkbox>
                </div>
                <div className="col-md-8" style={{ textAlign: "center" }}>
                  <Space direction="vertical">
                    <TimePicker.RangePicker
                      size="large"
                      disabled={!disabledcn}
                      status="success"
                      id="schedule"
                      name="schedule"
                      TimePicker
                      value={valuecn.length < 1 ? [null, null] : valuecn}
                      format={format}
                      onChange={(e) => {
                        pushSchedule(e, "sunday");
                      }}
                    />
                  </Space>
                </div>
              </div>
            </div>
            <div className="footer" style={{ marginBottom: "20px" }}>
              {/* <Button
                htmlType="submit"
                loading={loading}
                type="primary"
                style={{ float: "right" }}
                key="submit"
                onClick={handleOk}
                form="myForm"
              >
                Xác nhận
              </Button>
              <Button
                style={{
                  float: "right",
                  marginRight: "10px",
                  backgroundColor: "gray",
                }}
                onClick={handleCancel}
                key="back"
              >
                Hủy
              </Button> */}
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default Editstaff;
