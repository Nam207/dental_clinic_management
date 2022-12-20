import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import axios from "../../apis/api";
import { Pagination, Table, DatePicker } from "antd";
import moment from 'moment';
import { FaRedoAlt } from "react-icons/fa";

const Receptionist = ({user}) => {
    const [offsetReExam, setOffsetReExam] = useState(0);
    const [limitReExam, setLimitReExam] = useState(5);
    const [totalReExam, setTotalReExam] = useState(0);
    const [reExamination, setReExamination] = useState([]);

    const [offsetBirthday, setOffsetBirthday] = useState(0);
    const [limitBirthday, setLimitBirthday] = useState(5);
    const [totalBirthday, setTotalBirthday] = useState(0);
    const [birthday, setBirthday] = useState([]);

    const today = new Date();
    const dateFormat = 'DD/MM/YYYY';

    const [startDate, setStartDate] = useState(moment(today).format("YYYY-MM-DD"));
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
        let temp = 0;
        user.role.forEach(element => {
            if(element.name === "Lễ tân" || element.name === "Admin") temp++;
        });
        if(temp === 0) window.location.href = "/Page404";
        loadDataReExam();
        loadDataBirthday();
    }, [offsetReExam, limitReExam, offsetBirthday, limitBirthday, startDate, endDate]);

    const onChangePageReExam = (current, pageSize) => {
        setOffsetReExam(current - 1);
        setLimitReExam(pageSize);
    };

    const onChangePageBirthday = (current, pageSize) => {
        setOffsetBirthday(current - 1);
        setLimitBirthday(pageSize);
    };

    const handleSubmit = (e) => {
        setStartDate(moment(e[0]).format("YYYY-MM-DD"));
        setEndDate(moment(e[1]).format("YYYY-MM-DD"))
    }
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

    const dataReExam = reExamination.map((element) => {
        return {
            key: element._id,
            _id: element.customerId,
            name: element.customerName,
            date: moment(element.reExamination).format("DD/MM/YYYY"),
            medicalPaper: element._id,
            phone: element.phone
        };
    });

    const dataBirthday = birthday.map((element) => {
        return {
            key: element._id,
            _id: element._id,
            name: element.fullname,
            phone: element.phone,
        };
    });

    return (
        <>
            <div style={{ margin: "auto", width: "80%", display: "block", marginTop: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
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
                                    Tái khám
                                </h4>
                            </Nav>
                            <Form className="d-flex">
                                <Button
                                    variant="primary"
                                    style={{ marginRight: "20px" }}
                                    onClick={loadDataReExam}
                                >
                                    <FaRedoAlt /> Tải lại
                                </Button>
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <div style={{ marginLeft: "80px", marginRight: "80px", marginTop: "5px" }}>
                    <span>Tổng: {totalReExam}</span>
                    <DatePicker.RangePicker
                        defaultValue={[moment(today, dateFormat), moment(today, dateFormat)]}
                        format={dateFormat}
                        style={{ float: "right" }}
                        onChange = {handleSubmit}
                    />
                    <Table columns={columnsReExam} dataSource={dataReExam} pagination={false} />
                </div>

                <div id="pagin" style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <Pagination
                        showSizeChanger
                        current={offsetReExam + 1}
                        total={totalReExam}
                        onChange={onChangePageReExam}
                        defaultPageSize={5}
                        pageSizeOptions={[5, 10, 20, 50]}
                    />
                </div>
            </div>

            <div style={{ margin: "auto", width: "80%", display: "block", marginTop: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
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
                                    Sinh nhật hôm nay
                                </h4>
                            </Nav>
                            <Form className="d-flex">
                                <Button
                                    variant="primary"
                                    style={{ marginRight: "20px" }}
                                    onClick={loadDataBirthday}
                                >
                                    <FaRedoAlt /> Tải lại
                                </Button>
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <div style={{ marginLeft: "80px", marginRight: "80px", marginTop: "5px" }}>
                    <span>Tổng: {totalBirthday}</span>
                    <Table columns={columnsBirthday} dataSource={dataBirthday} pagination={false} />
                </div>

                <div id="pagin" style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <Pagination
                        showSizeChanger
                        current={offsetBirthday + 1}
                        total={totalBirthday}
                        onChange={onChangePageBirthday}
                        defaultPageSize={5}
                        pageSizeOptions={[5, 10, 20, 50]}
                    />
                </div>
            </div>
        </>
    );
};

export default Receptionist;