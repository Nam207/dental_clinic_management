import React, { useState, useEffect, Component } from "react";
import "./dashBoard.css";
import {
  SnippetsOutlined,
  UserOutlined,
  BarChartOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import axios from "../../apis/api";
import Button from "react-bootstrap/Button";
import { FaRedoAlt } from "react-icons/fa";
import { Pagination, Table, DatePicker } from "antd";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { Line } from 'react-chartjs-2';
import moment from "moment";
import { CategoryScale, LinearScale, BarElement, Title ,registerables} from "chart.js";
const DashBoard = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  ChartJS.register(CategoryScale);
  ChartJS.register(...registerables);
  const [offsetReExam, setOffsetReExam] = useState(0);
  const [limitReExam, setLimitReExam] = useState(5);
  const [totalReExam, setTotalReExam] = useState(0);
  const [reExamination, setReExamination] = useState([]);
  const [offsetBirthday, setOffsetBirthday] = useState(0);
  const [limitBirthday, setLimitBirthday] = useState(5);
  const [totalBirthday, setTotalBirthday] = useState(0);
  const [birthday, setBirthday] = useState([]);
  const today = new Date();
  const dateFormat = "DD/MM/YYYY";
  const [startDate, setStartDate] = useState(
    moment(today).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment(today).format("YYYY-MM-DD"));

  const loadDataReExam = async () => {
    const response = await axios
      .get(
        `/api/medicalPaper/reExam?offset=${offsetReExam}&limit=${limitReExam}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((response) => {
        if (response.success === 1) {
          setReExamination(response.data.data);
          setTotalReExam(response.data.total);
        }
      });
  };
  const loadDataBirthday = async () => {
    const response = await axios
      .get(
        `/api/customer/birthday?offset=${offsetBirthday}&limit=${limitBirthday}`
      )
      .then((response) => {
        if (response.success === 1) {
          setBirthday(response.data.data);
          setTotalBirthday(response.data.total);
        }
      });
  };

  useEffect(() => {
    loadDataReExam();
    loadDataBirthday();
  }, [
    offsetReExam,
    limitReExam,
    totalReExam,
    offsetBirthday,
    limitBirthday,
    totalBirthday,
  ]);

  const onChangePageReExam = (current, pageSize) => {
    setOffsetReExam(current - 1);
    setLimitReExam(pageSize);
  };

  const onChangePageBirthday = (current, pageSize) => {
    setOffsetBirthday(current - 1);
    setLimitBirthday(pageSize);
  };

  const columnsReExam = [
    {
      title: "Mã khách hàng",
      dataIndex: "_id",
      align: "center",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      align: "center",
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: "Phiếu khám",
      dataIndex: "medicalPaper",
      align: "center",
      sorter: (a, b) => a.medicalPaper.localeCompare(b.medicalPaper),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      align: "center",
    },
  ];

  const columnsBirthday = [
    {
      title: "Mã khách hàng",
      dataIndex: "_id",
      align: "center",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      align: "center",
    },
  ];

  const dataBirthday = birthday.map((element) => {
    return {
      key: element._id,
      _id: element._id,
      name: element.fullname,
      phone: element.phone,
    };
  });
  //data pie chart
  const data = {
    labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7","Chủ nhật"],
    datasets: [
      {
        label: "# of Votes",
        data: [7, 5, 3, 5, 2, 3,14],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(200, 142, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(200, 142, 64, 0.2)",
        ],
        borderWidth: 1,
      },
    ],
  };
  //data barchart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  };

  return (
    <section className="vh-100" style={{ marginTop: "10px" }}>
      <div className="row tile_count d-flex justify-content-center align-items-start">
        <div
          className="col-md-2 col-sm-4 tile_stats_count"
          style={{ width: "18%" }}
        >
          <div className="card">
            <div class="card-header">
              <span class="count_top">
                <i class="fa fa-user"></i> Tổng khách hàng{" "}
              </span>
            </div>
            <div class="card-body">
              <div class="count"> 15 </div>
              <span class="count_bottom">
                <i class="green"> 20% </i> so với tháng trước{" "}
              </span>
              <span class="count_bottom"> (30 khách) </span>
            </div>
          </div>
        </div>
        <div
          className="col-md-2 col-sm-4 tile_stats_count"
          style={{ width: "18%" }}
        >
          <div className="card">
            <div class="card-header">
              <span class="count_top">
                <i class="fa fa-user"></i> Nhân viên{" "}
              </span>
            </div>
            <div class="card-body">
              <div class="count"> 5 </div>
              <span class="count_bottom">
                <i class="green"> 100% </i> so với tháng trước{" "}
              </span>
              <span class="count_bottom"> (30 khách) </span>
            </div>
          </div>
        </div>
        <div
          className="col-md-2 col-sm-4 tile_stats_count"
          style={{ width: "18%" }}
        >
          <div className="card">
            <div class="card-header">
              <span class="count_top">
                <i class="fa fa-user"></i> Tổng phiếu khám{" "}
              </span>
            </div>
            <div class="card-body">
              <div class="count"> 20 </div>
              <span class="count_bottom">
                <i class="green"> 40% </i> so với tháng trước{" "}
              </span>
              <span class="count_bottom"> (30 khách) </span>
            </div>
          </div>
        </div>
        <div
          className="col-md-2 col-sm-4 tile_stats_count"
          style={{ width: "18%" }}
        >
          <div className="card">
            <div class="card-header">
              <span class="count_top" style={{ textAlign: "center" }}>
                <i class="fa fa-user"></i> Tổng thủ thuật{" "}
              </span>
            </div>
            <div class="card-body">
              <div class="count"> 26 </div>
              <span class="count_bottom">
                <i class="green"> 50% </i> so với tháng trước{" "}
              </span>
              <span class="count_bottom"> (30 khách) </span>
            </div>
          </div>
        </div>
        <div
          className="col-md-2 col-sm-4 tile_stats_count"
          style={{ width: "18%" }}
        >
          <div className="card">
            <div class="card-header">
              <span class="count_top">
                <i class="fa fa-user"></i> Thủ thuật nhiều nhất{" "}
              </span>
            </div>
            <div class="card-body">
              <div class="count"> 2 </div>
              <span class="count_bottom">
                <i class="green"> 80% </i> so với tháng trước{" "}
              </span>
              <span class="count_bottom"> (30 khách) </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid h-custom" style={{ marginTop: "10px" }}>
        <div className="row d-flex justify-content-center align-items-start h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <div className="right__main" style={{ marginTop: "0px" }}>
              <div className="row row-cols-2 mb-4">
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
                      <MedicineBoxOutlined />
                    </i>
                    <div className="text font-weight-bold">Đăng ký thuốc</div>
                  </a>
                </div>

                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient3 text-shadow relative"
                    href="/service"
                  >
                    <i className="h3 fa fa-book">
                      <ReconciliationOutlined />
                    </i>
                    <div className="text font-weight-bold">
                      Đăng ký thủ thuật
                    </div>
                  </a>
                </div>
                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient4 text-shadow relative"
                    href="/customer"
                  >
                    <i className="h3 fa fa-book text-shadow">
                      <UserOutlined />
                    </i>
                    <div className="text font-weight-bold text-shadow">
                      Khách Hàng
                    </div>
                  </a>
                </div>
              </div>
              <div className="row row-cols-2 mb-4">
                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient5 text-shadow relative"
                    href=""
                  >
                    <i className="h3 fa fa-book">
                      <BarChartOutlined />
                    </i>
                    <div className="text font-weight-bold">Doanh thu</div>
                  </a>
                </div>

                <div className="col overflow-hidden">
                  <a
                    className="d-block text-white rounded text-center py-3 py-md-5 bg-gradient6 text-shadow relative"
                    href="/staff"
                  >
                    <i className="h3 fa fa-book">
                      <TeamOutlined />
                    </i>
                    <div className="text font-weight-bold">Nhân viên</div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-lg-6 col-xl-6 offset-xl">
            <div className="col-md-12 col-lg-12 col-xl-12">
              <div className="col-md-12 col-lg-8 col-xl-9 left__main">
                <div
                  className=""
                  style={{ textAlign: "-webkit-center", height: "400px" }}
                >
                  <span style={{fontWeight:"bold",fontSize:"16px"}}>Số lượng khách hàng trong tuần</span>

                  <Pie data={data} />
                </div>
                <div className=""   style={{ textAlign: "-webkit-center", height: "400px" ,marginTop:"40px"}}>
                <span style={{fontWeight:"bold",fontSize:"16px"}}>Số lượng khách hàng trong tháng</span>
                  <Line
                    datasetIdKey="id"
                    data={{
                      labels: ["T1", "T2", "T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"],
                      datasets: [
                        {
                          id: 1,
                          label: "",
                          data: [5,2, 8, 4,8,1,9,4,2,7,1,3,4],
                        },
                        
                      ],
                    }}
                  />
                    
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
