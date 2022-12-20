import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import UploadAndDisplayImage from "../../components/uploadImage";
import clinicProcessor from "../../apis/clinicProcessor";
import axios from "../../apis/api";

const Clinic = ({ user }) => {
    const [clinic, setClinic] = useState({});

    const [tempEye, setTempeye] = useState(false);

    useEffect(() => {
        getClinic();
        getPermission("Quản lý phòng khám")
    }, []);

    const getClinic = async () => {
        const response = await clinicProcessor.getClinic();
        setClinic(response);
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
            setTempeye(true);
            return;
        }
        const functionArray = await axios({
            url: `/api/function`,
            method: "get",
        });
        const index = findIndexByProperty(functionArray.data, "name", functionName);
        await Promise.all(
            user.role.map(async (element) => {
                const permission = await axios({
                    url: `/api/permission/${element._id}/${functionArray.data[index]._id}`,
                    method: "get",
                });
                if (permission.success === 0 || !permission.data) return;
                if (permission.data[0].view === false) {
                    window.location.href = "/Page404";
                }
                if (permission.data[0].edit === true) {
                    setTempeye(true);
                }
            })
        );
    };

    const formik = useFormik({
        initialValues: {
            name: clinic.name,
            icon: clinic.icon,
            phone: clinic.phone,
            email: clinic.email,
            address: clinic.address,
            accountNumber: clinic.accountNumber,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string()
                .required("Bắt buộc")
                .min(4, "Tên phải lớn hơn 4 kí tự"),
            icon: Yup.mixed().required("Bắt buộc"),
            phone: Yup.string()
                .required("Nhập số điện thoại")
                .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Điền đúng số điện thoại"),
            email: Yup.string()
                .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Điền đúng dạng email"),
            address: Yup.string().required("Bắt buộc").min(4, "Địa chỉ phải lớn hơn 4 kí tự"),
            accountNumber: Yup.string().required("Bắt buộc").min(4, "Thông tin số tài khoản phải lớn hơn 4 kí tự"),
        }),

        onSubmit: async (values) => {
            await clinicProcessor.updateClinic(values)
        },
    });

    return (
        <>
            <div className="" style={{ textAlign: 'center' }}>
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
                                    Thông tin phòng khám
                                </h4>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
            <div
                style={{
                    position: "fixed",
                    right: "10px",
                    bottom: "20px",
                    zIndex: "3",
                }}
            >
            </div>
            <div style={{
                width: "100%",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '30px'
            }}>
                <Form onSubmit={formik.handleSubmit} style={{ width: "70%" }}>
                    <Row className="mb-3">
                        <Col style={{ borderRight: '1px dashed lime' }}>
                            <div style={{
                                textAlign: 'center'
                            }}>
                                <Form.Label style={{ fontWeight: "bold", display: "block", marginBottom: "15px" }}>
                                    Logo Phòng khám
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
                                <UploadAndDisplayImage
                                    value={formik.values.icon ? formik.values.icon : []}
                                    onChange={(value) => {
                                        if (value && value.length > 0) {
                                            formik.values.icon = value;
                                        }
                                    }}
                                />
                            </div>
                            {formik.errors.imageUrl && (
                                <p className="errorMsg"> {formik.errors.imageUrl} </p>
                            )}
                        </Col>

                        <Col>
                            <Row className="mb-5 mt-5">
                                <Form.Label column sm={4}>
                                    Tên phòng khám
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
                                <Col sm={8}>
                                    <Form.Control
                                        id="name"
                                        type="text"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        readOnly={tempEye ? "false" : "true"}
                                    />
                                    {formik.errors.name && (
                                        <p className="errorMsg"> {formik.errors.name} </p>
                                    )}
                                </Col>
                            </Row>

                            <Row className="mb-5">
                                <Form.Label column sm={4}>
                                    Số điện thoại
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
                                <Col sm={8}>
                                    <Form.Control
                                        id="phone"
                                        type="text"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        readOnly={tempEye ? "false" : "true"}
                                    />
                                    {formik.errors.phone && (
                                        <p className="errorMsg"> {formik.errors.phone} </p>
                                    )}
                                </Col>
                            </Row>

                            <Row className="mb-5">
                                <Form.Label column sm={4}>
                                    Email
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
                                <Col sm={8}>
                                    <Form.Control
                                        id="email"
                                        type="text"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        readOnly={tempEye ? "false" : "true"}
                                    />
                                    {formik.errors.email && (
                                        <p className="errorMsg"> {formik.errors.email} </p>
                                    )}
                                </Col>
                            </Row>

                            <Row className="mb-5">
                                <Form.Label column sm={4}>
                                    Địa chỉ
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
                                <Col sm={8}>
                                    <Form.Control
                                        id="address"
                                        type="text"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        readOnly={tempEye ? "false" : "true"}
                                    />
                                    {formik.errors.address && (
                                        <p className="errorMsg"> {formik.errors.address} </p>
                                    )}
                                </Col>
                            </Row>

                            <Row className="mb-5">
                                <Form.Label column sm={4}>
                                    Tài khoản ngân hàng
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
                                <Col sm={8}>
                                    <Form.Control
                                        id="accountNumber"
                                        type="text"
                                        value={formik.values.accountNumber}
                                        onChange={formik.handleChange}
                                        readOnly={tempEye ? "false" : "true"}
                                    />
                                    {formik.errors.accountNumber && (
                                        <p className="errorMsg"> {formik.errors.accountNumber} </p>
                                    )}
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                    <hr
                        style={{
                            background: 'lime',
                            color: 'lime',
                            borderColor: 'lime',
                            height: '1px',
                            marginTop: '0'
                        }}
                    />
                    {tempEye === true ? (
                        <>
                            <Button
                                type="submit"
                                variant="primary"
                                style={{ float: "right" }}
                            >
                                Lưu lại
                            </Button>
                            <Button
                                style={{
                                    float: "right",
                                    marginRight: "10px",
                                    backgroundColor: "gray",
                                }}
                                onClick={(e) => {
                                    window.location.reload(false);
                                }}
                            >
                                Đặt lại
                            </Button>
                        </>) : (<Button
                            style={{
                                float: "right",
                                marginRight: "10px",
                                backgroundColor: "gray",
                            }}
                            onClick={(e) => {
                                window.location.href = "/";
                            }}
                        >
                            Quay lại
                        </Button>)}
                </Form>
            </div>
        </>
    );
};

export default Clinic;
