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
import { Line } from "react-chartjs-2";
import moment from "moment";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  registerables,
} from "chart.js";
const DashBoard = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  ChartJS.register(CategoryScale);
  ChartJS.register(...registerables);

  const [cusTotal, setCusTotal] = useState(0);
  const [cusInMonth, setCusInMonth] = useState(0);

  const [empTotal, setEmpTotal] = useState(0);
  const [empInMonth, setEmpInMonth] = useState(0);

  const [medTotal, setMedTotal] = useState(0);
  const [medInMonth, setMedInMonth] = useState(0);

  const [serTotal, setSerTotal] = useState(0);
  const [serInMonth, setSerInMonth] = useState(0);

  const [bestSer, setBestSer] = useState(0);
  const [bestSerNumber, setBestSerNumber] = useState(0);

  const [cus2, setCus2] = useState(0);
  const [cus3, setCus3] = useState(0);
  const [cus4, setCus4] = useState(0);
  const [cus5, setCus5] = useState(0);
  const [cus6, setCus6] = useState(0);
  const [cus7, setCus7] = useState(0);
  const [cus8, setCus8] = useState(0);

  const [cusMon1, setCusMon1] = useState(0);
  const [cusMon2, setCusMon2] = useState(0);
  const [cusMon3, setCusMon3] = useState(0);
  const [cusMon4, setCusMon4] = useState(0);
  const [cusMon5, setCusMon5] = useState(0);
  const [cusMon6, setCusMon6] = useState(0);
  const [cusMon7, setCusMon7] = useState(0);
  const [cusMon8, setCusMon8] = useState(0);
  const [cusMon9, setCusMon9] = useState(0);
  const [cusMon10, setCusMon10] = useState(0);
  const [cusMon11, setCusMon11] = useState(0);
  const [cusMon12, setCusMon12] = useState(0);

  const loadDataDashBoard = async () => {
    const response = await axios
      .get(`/api/staticstial/forDashBoard`)
      .then((response) => {
        setCusTotal(response.data.totalCustomer);
        setCusInMonth(response.data.totalCustomerInMonth);


        setEmpTotal(response.data.totalEmployee);
        setEmpInMonth(response.data.totalEmployeeInMonth);

        setMedTotal(response.data.totalMedical);
        setMedInMonth(response.data.totalMedicalInMonth);

        setSerTotal(response.data.totalService);
        setSerInMonth(response.data.totalServiceInMonth);

        setBestSer(response.data[0].service[0][0].name);
        setBestSerNumber(response.data[0].count);
      });
  };

  const loadDataPieChart = async () => {
    await axios.get(`/api/staticstial/forPieChart`).then((response) => {
      setCus2(response.data[0]);
      setCus3(response.data[1]);
      setCus4(response.data[2]);
      setCus5(response.data[3]);
      setCus6(response.data[4]);
      setCus7(response.data[5]);
      setCus8(response.data[6]);
    });
  };

  const loadDataLineChart = async () => {
    await axios.get(`/api/staticstial/forLineChart`).then((response) => {
      console.log(response.data);

      setCusMon1(response.data[0]);
      setCusMon2(response.data[1]);
      setCusMon3(response.data[2]);
      setCusMon4(response.data[3]);
      setCusMon5(response.data[4]);
      setCusMon6(response.data[5]);
      setCusMon7(response.data[6]);
      setCusMon8(response.data[7]);
      setCusMon9(response.data[8]);
      setCusMon10(response.data[9]);
      setCusMon11(response.data[10]);
      setCusMon12(response.data[11]);
    });
  };

  useEffect(() => {
    loadDataDashBoard();
    loadDataPieChart();
    loadDataLineChart();
  }, []);


  //data pie chart
  const data = {
    labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
    datasets: [
      {
        label: "# of Votes",
        data: [cus2, cus3, cus4, cus5, cus6, cus7, cus8],
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
              <div class="count"> {cusTotal} </div>
              <span class="count_bottom">
                <i class="green">
                  {" "}
                  {Math.round(
                    (cusInMonth / (cusTotal - cusInMonth)) * 100
                  )}%{" "}
                </i>{" "}
                so với tháng trước{" "}
              </span>
              <span class="count_bottom"> ({cusInMonth} khách) </span>
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
              <div class="count"> {empTotal} </div>
              <span class="count_bottom">
                <i class="green">
                  {" "}
                  {Math.round((empInMonth / (empTotal - empInMonth)) * 100) ===
                  Infinity
                    ? 0
                    : Math.round((empInMonth / (empTotal - empInMonth)) * 100)}
                  %{" "}
                </i>{" "}
                so với tháng trước{" "}
              </span>
              <span class="count_bottom"> ({empInMonth} khách) </span>
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
              <div class="count"> {medTotal} </div>
              <span class="count_bottom">
                <i class="green">
                  {" "}
                  {Math.round((medInMonth / (medTotal - medInMonth)) * 100) ===
                  Infinity
                    ? 0
                    : Math.round((medInMonth / (medTotal - medInMonth)) * 100)}
                  %{" "}
                </i>{" "}
                so với tháng trước{" "}
              </span>
              <span class="count_bottom"> ({medInMonth} khách) </span>
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
              <div class="count"> {serTotal} </div>
              <span class="count_bottom">
                <i class="green">
                  {" "}
                  {Math.round((serInMonth / (serTotal - serInMonth)) * 100) ===
                  Infinity
                    ? 0
                    : Math.round((serInMonth / (serTotal - serInMonth)) * 100)}
                  %{" "}
                </i>{" "}
                so với tháng trước{" "}
              </span>
              <span class="count_bottom"> ({serInMonth} khách) </span>
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
              <div class="count" style={{alignItems:"center"}}>
                {" "}
                {bestSer} - {bestSerNumber}
              </div>
              <span class="count_bottom">
                <i class="green"> {bestSerNumber} </i> lần sử dụng tháng này
              </span>
              {/* <span class="count_bottom"> (30 khách) </span> */}
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
                    <i className="h3 fa fa-book ">
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
                  <span style={{ fontWeight: "bold", fontSize: "24px" }}>
                    Số lượng khách hàng trong tuần
                  </span>

                  <Pie data={data} />
                </div>
                <div
                  className=""
                  style={{
                    textAlign: "-webkit-center",
                    height: "400px",
                    marginTop: "100px",
                  }}
                >
                  <span style={{ fontWeight: "bold", fontSize: "24px" }}>
                    Số lượng khách hàng trong tháng
                  </span>
                  <Line
                    datasetIdKey="id"
                    data={{
                      labels: [
                        "T1",
                        "T2",
                        "T3",
                        "T4",
                        "T5",
                        "T6",
                        "T7",
                        "T8",
                        "T9",
                        "T10",
                        "T11",
                        "T12",
                      ],
                      datasets: [
                        {
                          id: 1,
                          label: "",

                          data: [
                            cusMon1,
                            cusMon2,
                            cusMon3,
                            cusMon4,
                            cusMon5,
                            cusMon6,
                            cusMon7,
                            cusMon8,
                            cusMon9,
                            cusMon10,
                            cusMon11,
                            cusMon12,
                          ],

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
