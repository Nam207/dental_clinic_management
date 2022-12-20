import "./forgotpassword.css";
import React from "react";
import axios from "../../apis/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

function Forgotpassword() {

  const disPlay = () => {
    Swal.fire(
      "Thành Công",
      `Đổi mật khẩu thành công`,
      "success"
    );
  }

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Không được trống")
        .min(2, "Phải dài hơn 2 kí tự")
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email sai định dạng"),
    }),

    onSubmit: async (values) => {
      const { email } = values;
      try {
        const res = await axios({
          url: "api/auth/forgotPassword",
          method: "Post",
          data: {
            email,
          },
        });

        if (res.success) {
          disPlay();
          setTimeout(() => {
            window.location.href = "/login"
          }, 3000);
        }
      } catch (err) {
        Swal.fire(
          "Thất Bại",
          `Email không tồn tại`,
          "error"
        );
      }
    },
  });
  const onBack = () =>{
      window.location.href = "/login"
  }

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={formik.handleSubmit}>
              <div className="divider d-flex align-items-center my-4">
                <p
                  className="text-center fw-bold mx-3 mb-0"
                  style={{ fontSize: "23px" }}
                >
                  Quên Mật Khẩu
                </p>
              </div>
              {/* Email input */}
              <div className="form-outline mb-4">
                <label>Email</label>
                <br></br>
                <input
                  className="input_forgotpass "
                  placeholder="Nhập email của bạn"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                {formik.errors.email && (
                  <p className="errorMsg"> {formik.errors.email} </p>
                )}
              </div>
              {/* Password input */}

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="onSubmit"
                  className="btn btn-primary btn-lg"
                  href="/login"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                >
                  Xác Nhận
                </button>
                <button
                  onClick={onBack}
                  className="btn btn-secondary btn-lg"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem",float:"right" }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Forgotpassword;