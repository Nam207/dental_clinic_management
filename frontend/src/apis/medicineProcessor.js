import axios from "./api";
// import axios from "axios";
import { addMedicine } from "../redux/reducer/medicineSlice";
import {
  getMedicineSuccess,
  getMedDetailSuccess,
} from "../redux/reducer/medicineSlice";
import {
  setLoading,
  setNotLoading,
  toggleLoading,
} from "../redux/reducer/loading";
import { store } from "../redux/store";
import Swal from "sweetalert2";

const medProcessor = {};

export const addMed = async (medicine, loadData) => {
  try {
    await axios
      .post("/api/medicine/", medicine)
      .then((response) => {
        store.dispatch(addMedicine(response.data.data));
        if (response.success === 1) {
          Swal.fire("Thành công", `Thêm thành công`, "success");
          loadData();
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // navigate("/medicine");
  } catch (error) {
    console.log(error);
  }
};

medProcessor.addMed = async (medicine, navigate) => {
  try {
    const res = await axios.post("/api/medicine/", medicine);
    store.dispatch(addMedicine(res.data));
    console.log(res.data);
    navigate("/medicine");
  } catch (error) {
    console.log(error);
  }
};

medProcessor.getAll = async (keyword, offset, limit) => {
  store.dispatch(setLoading());
  // console.log("dau");
  // const token = localStorage.getItem("token");
  // console.log("token " + token);
  const response = await axios.get(
    `/api/medicine?keyword=${keyword}&offset=${offset}&limit=${limit}`
  );
  store.dispatch(getMedicineSuccess(response.data.data));
  //   console.log(res);
  // .catch((err) => {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Lây dữ liệu thất bại",
  //     text: "Vui lòng kiểm tra lại kết nối mạng",
  //   });
  // });
  // console.log(res.data);
  store.dispatch(setNotLoading());
};

medProcessor.getAllObj = async () => {
  const result = await axios.get("/api/medicine");
  return result.data.data;
};

// medProcessor.getAllObj = async () => {
//   const result = await axios
//     .get("/api/medicine");
//     // console.log(response.data);
//   return result.data.data;
// };

medProcessor.getMedicineDetailObj = (id, setExDay) => {
  // const { id } = props;
  const response = axios
    .get(`api/medicine/${id}`)
    .then((response) => {
      store.dispatch(getMedDetailSuccess(response.data));
      // setExDay(new Date(response.data.expiredDay).toISOString().split("T")[0]);
    })
    .catch((err) => {
      console.log("Err: ", err);
    });
};

medProcessor.updateMedcine = async (med, id) => {
  // let tempId = med._id;
  console.log(med);
  // delete med._id;
  // delete med.createdAt;
  // delete med.updatedAt;
  // delete med.__v;
  const response = await axios
    .put(`api/medicine/${id}`, med)
    // .then(navigate("/medicine"))

    .catch((err) => {
      console.log("Err: ", err);
    });

  if (response.success === 1) {
    Swal.fire("Thành công", `Cập nhật thành công`, "success");
  }
};

medProcessor.changeStatus = async (id, state, navigate) => {
  const result = await axios.put(`api/medicine/${id}/${state}`);
  console.log(result);
  if (result.success !== 1) {
    Swal.fire("Thất bại", `Cập nhật thất bại tại id=${id}`, "failed");
  }
  return result;
};

export default medProcessor;
