import React from "react";
import axios from "./api";
import Swal from "sweetalert2";

const customerProcessor = {};

customerProcessor.getAllCustomer = async () => {
  const response = await axios.get("/api/customer").catch((err) => {
    console.log(err);
  });

  return response.data;
};

customerProcessor.addCustomer = async (cus) => {
  const res = await axios.post("/api/customer/", cus).catch((error) => {
    console.log(error);
  });
  if (res.success) {
    Swal.fire("Thành Công", `Thêm thành công`, "success");
  }
};

customerProcessor.updateService = async (customer, id) => {
  const result = await axios.put(`api/customer/${id}`, customer);
  if (result.success === 1) {
    Swal.fire("Thành công", `Cập nhật thành công`, "success");
  } else {
    Swal.fire("Thất bại", `Cập nhật thất bại tại id=${id}`, "failed");
  }
};

customerProcessor.changeStatus = async (id, state) => {
  const result = await axios.put(`api/customer/${id}/${state}`);

  if (result.success !== 1) {
    Swal.fire("Thất bại", `Cập nhật thất bại tại id=${id}`, "failed");
  }
  return result;
};

export default customerProcessor;
