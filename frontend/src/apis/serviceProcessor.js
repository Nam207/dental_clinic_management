// import axios from "axios";
import axios from "./api";

import Swal from "sweetalert2";

const serviceProcessor = {};

serviceProcessor.getAllService = async () => {
  let serviceList = [];
  await axios
    .get("/api/service")
    .then((response) => {
      serviceList = response.data.data;
      console.log("api service: " + serviceList);
    })
    .catch((err) => {
      console.log("Err: ", err);
    });
  return serviceList;
};

serviceProcessor.getServiceDetail = async (id) => {
  const response = await axios
    .get(`api/service/${id}`)
    .then((response) => {})
    .catch((err) => {
      console.log("Err: ", err);
    });
};

serviceProcessor.addService = async (service) => {
  try {
    const res = await axios.post("/api/service/", service);
    if (res.success) {
      Swal.fire("Thành Công", `Thêm thành công`, "success");
    }
  } catch (error) {
    console.log("Err: ", error);
  }
};

serviceProcessor.updateService = async (service, id) => {
  try {
    const res = await axios.put(`api/service/${id}`, service);
    if (res.success) {
      Swal.fire("Thành Công", `Cập nhật thành công`, "success");
    }
  } catch (error) {
    console.log("Err: ", error);
  }
};

serviceProcessor.changeStatus = async (id, state, navigate) => {
  const result = await axios.put(`api/service/${id}/${state}`);
  if (result.success !== 1) {
    Swal.fire("Thất bại", `Cập nhật thất bại tại id=${id}`, "failed");
  }
  return result;
};

export default serviceProcessor;
