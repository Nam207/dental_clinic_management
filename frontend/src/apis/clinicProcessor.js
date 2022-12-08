import axios from "./api";
import Swal from "sweetalert2";

const clinicProcessor = {};

clinicProcessor.getClinic = async () => {
  const response = await axios.get("/api/clinic").catch((err) => {
    console.log(err);
  });
  return response.data[0];
};

clinicProcessor.updateClinic = async (clinic) => {
    const result = await axios.put(`api/clinic`, clinic);
    if(result.success === 1) {
      Swal.fire("Thành công", `Cập nhật thông tin phòng khám thành công`, "success");
    } else {
      Swal.fire("Thất bại", `Cập nhật thông tin phòng khám thất bại`, "failed");
    }
};

export default clinicProcessor;
