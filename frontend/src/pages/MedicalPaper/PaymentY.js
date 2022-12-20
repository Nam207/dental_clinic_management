import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { FaBookMedical, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import {
  Select,
  Pagination,
  Modal as ModalAntd,
  Table as TableAntd,
  Form as FormAntd,
  Space,
  Tag,
  InputNumber,
  DatePicker,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { Typeahead } from "react-bootstrap-typeahead";
import { useFetcher } from "react-router-dom";
import axios from "../../apis/api";
import Swal from "sweetalert2";
const PaymentY = ({ PKID, show, handleClose, loadDataFilterByDate }) => {
  // const [cusMon, setCusMon] = useState(customerPayment);
  const [tempL, setTempL] = useState(0);
  //   const [show, setShow] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cusPayment, setCusPayment] = useState(0);
  const [changeMoney, setChangeMoney] = useState(0);

  const [paymentList, setPaymentList] = useState([]);

  const getPaymentData = async () => {
    const res = await axios({
      url: `/api/medicalPaper/${PKID}`,
      method: "get",
    });

    setTotalPrice(Number(res.data.totalAmount.$numberDecimal));
    setCusPayment(Number(res.data.customerPayment.$numberDecimal));

    await axios
      .get(`/api/bill?medicalPaperId=${PKID}`)
      .then((response) => {
        setPaymentList([
          ...response.data.map((i) => [
            i.createdAt,
            [{ id: i.paymentId, name: i.namePayment }],
            Number(i.amount.$numberDecimal),
            [{ id: i.employeeId, name: i.nameEmployee }],
            i._id,
          ]),
        ]);

        setTempL(response.data.length);
        if (response.success === 1) {
          loadDataFilterByDate();
        }
      })

      .catch((error) => {
        console.error(error);
      });
  };

  const [op, setOP] = useState([]);
  const [receptionList, setReceptionList] = useState([]);

  const loadTT = async () => {
    try {
      const res = await axios({
        url: `/api/payment/`,
        method: "get",
      });
      setOP([...res.data.map((i) => ({ id: i._id, name: i.name }))]);
    } catch (error) {
      console.log(error);
    }
  };
  const loadReceptionist = async () => {
    try {
      const res = await axios({
        url: `/api/profile/getReceptionist/`,
        method: "get",
      });
      setReceptionList([
        ...res.data.map((i) => ({ id: i._id, name: i.fullname })),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (PKID) {
      loadTT();
      loadReceptionist();
      getPaymentData();
    }
  }, []);

  useEffect(() => {
    if (PKID) {
      getPaymentData();
    }
    // loadDataFilterByDate();
  }, [show]);
  const columns = [
    {
      title: "Ngày trả",
      dataIndex: "date",
      align: "center",
    },
    {
      title: "Hình thức TT",
      dataIndex: "type",
      align: "center",
    },
    {
      title: "Thanh toán",
      dataIndex: "money",
      align: "center",
    },
    {
      title: "Nhân viên thu",
      dataIndex: "people",
      align: "center",
    },
    {
      title: "",
      dataIndex: "action",
      align: "center",
    },
  ];
  const curDate = new Date();
  const curTime = new Date().getTime();

  const [paySelect, setPaySelect] = useState([]);

  const deleteRow = (rowIndex) => {
    // console.log(paymentList);
    let temp = paymentList;
    temp.splice(rowIndex, 1);
    setPaymentList([...temp]);

    let total = [];
    temp.map((i) => {
      if (i[2]) {
        total.push(i[2]);
      }
    });
    setCusPayment(total.reduce((a, b) => a + b));
  };

  const dateFormat = "DD/MM/YYYY";
  const dataSource = paymentList.map((row, rowIndex) => {
    return {
      date: (
        <>
          <Space direction="vertical">
            <DatePicker
              format={dateFormat}
              defaultValue={dayjs(row[0])}
              disabled
            />
            <TimePicker
              defaultValue={dayjs(row[0], "HH:mm:ss")}
              disabled
              style={{ width: "100%" }}
            />
          </Space>
        </>
      ),
      type: (
        <FormAntd.Item
          name={`TK${rowIndex}`}
          rules={[
            {
              required: true,
              message: "Nhập cách thanh toán...",
            },
          ]}
          initialValue={row[1]}
        >
          <Typeahead
            disabled={rowIndex < tempL ? true : false}
            style={{
              // transform: "translateY(12px)",
              marginTop: "20px",
            }}
            id="basic-typeahead-single"
            labelKey="name"
            onChange={(e) => {
              // let temp = paySelect;
              // temp[rowIndex] = e;
              // setPaySelect([...temp]);

              let temp = paymentList;
              temp[rowIndex][1] = e;
              setPaymentList([...temp]);
            }}
            options={op}
            placeholder="Nhập cách thanh toán"
            selected={row[1]}
          />
        </FormAntd.Item>
      ),
      money: (
        <>
          <InputNumber
            disabled={rowIndex < tempL ? true : false}
            required
            min={1}
            value={row[2]}
            onChange={(e) => {
              console.log(e);

              // if (e != null) {
              //   // setCusMon(cusMon + e);
              // } else {
              //   let teme = row[2];
              //   console.log(teme);
              // }

              let temp = paymentList;
              console.log(temp);
              temp[rowIndex][2] = e;
              setPaymentList([...temp]);

              let total = [];
              temp.map((i) => {
                if (i[2]) {
                  total.push(i[2]);
                }
              });
              setCusPayment(total.reduce((a, b) => a + b));
            }}
          ></InputNumber>
        </>
      ),
      people: (
        <FormAntd.Item
          name={`PP${rowIndex}`}
          rules={[
            {
              required: true,
              message: "Nhập nhân viên thu",
            },
          ]}
          initialValue={row[3]}
        >
          <Typeahead
            disabled={rowIndex < tempL ? true : false}
            style={{
              // transform: "translateY(12px)",
              marginTop: "20px",
            }}
            id="basic-typeahead-single"
            labelKey="name"
            onChange={(e) => {
              let temp = paymentList;
              temp[rowIndex][3] = e;
              setPaymentList([...temp]);
            }}
            options={receptionList}
            placeholder="Nhập nhân viên thu..."
            selected={row[3]}
            renderMenuItemChildren={(option) => (
              <div>
                {option.name}
                <div>
                  <small>ID: {option.id}</small>
                </div>
              </div>
            )}
          />
        </FormAntd.Item>
      ),
      action:
        rowIndex < tempL ? (
          <td></td>
        ) : (
          <td
            // style={{ display: "none" }}
            onClick={() => {
              //them alert truoc khi xoa
              Swal.fire({
                title: "Bạn có chắc chắn muốn xoá",
                showDenyButton: true,
                // showCancelButton: true,
                confirmButtonText: "Xoá",
                denyButtonText: `Huỷ`,
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  deleteRow(rowIndex);
                } else if (result.isDenied) {
                  // Swal.fire('Changes are not saved', '', 'info')
                }
              });
            }}
          >
            <FaTrashAlt cursor="pointer" color="#e74c3c" />
          </td>
        ),
    };
  });

  const addRow = () => {
    setPaymentList([...paymentList, [new Date(), [], "", [], ""]]);
  };

  const onSubmit = async () => {
    console.log(paymentList);
    let paymentListTemp = [];
    paymentList.map((e) => {
      paymentListTemp.push({
        medicalPaperId: PKID,
        employeeId: e[3][0].id,
        paymentId: e[1][0].id,
        amount: e[2],
        _id: e[4],
        createAt: e[0],
      });
    });

    await axios
      .post("/api/bill", { billMedical: paymentListTemp })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    handleClose();
  };

  return (
    <>
      <Modal
        id="PaymentModal"
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        // aria-labelledby="st-lg-modal"
      >
        <FormAntd
          name="basic"
          // form={form}
          onFinish={onSubmit}
        >
          <Modal.Header>
            <Modal.Title>Thanh toán - {PKID}</Modal.Title>

            <div style={{ float: "right", display: "inline-block" }}>
              <Button
                variant="secondary"
                style={{ marginRight: "10px" }}
                onClick={handleClose}
              >
                Huỷ
              </Button>
              <Button type="submit" variant="primary">
                OK
              </Button>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3" style={{ margin: "5px" }}>
              <Form.Label column sm={1} style={{ width: "13%", color: "blue" }}>
                Tổng tiền hoá đơn:
              </Form.Label>
              <Col
                sm={2}
                //  style={{ width: "20%" }}
              >
                <InputNumber
                  style={{
                    width: "100%",
                    color: "blue",
                  }}
                  value={new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                  bordered={false}
                  readOnly
                />
              </Col>
              <Form.Label
                column
                sm={1}
                style={{ width: "13%", color: "green" }}
              >
                <b>Đã thanh toán:</b>
              </Form.Label>
              <Col sm={2} style={{ padding: "0px" }}>
                <InputNumber
                  style={{
                    width: "100%",
                    color: "green",
                  }}
                  value={new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "VND",
                  }).format(cusPayment)}
                  bordered={false}
                  readOnly
                />
              </Col>

              <Form.Label
                column
                sm={1}
                style={{ width: "8%", color: "red", display: "inline" }}
              >
                Còn nợ:
              </Form.Label>

              <Col sm={2} style={{ display: "inline" }}>
                <InputNumber
                  style={{
                    width: "100%",
                    color: "red",
                  }}
                  value={
                    totalPrice - cusPayment > 0
                      ? new Intl.NumberFormat("de-DE", {
                          style: "currency",
                          currency: "VND",
                        }).format(totalPrice - cusPayment)
                      : 0
                  }
                  bordered={false}
                  readOnly
                />
              </Col>

              <Col sm={1} style={{ display: "inline" }}>
                <Button
                  variant="success"
                  onClick={addRow}
                  style={{
                    transform: "translateY(-7px)",
                  }}
                >
                  <FaPlusCircle />
                </Button>
              </Col>
            </Row>
            <TableAntd
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </Modal.Body>
        </FormAntd>
      </Modal>
    </>
  );
};

export default PaymentY;
