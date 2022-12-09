import "./changpassword.css";
import React from "react";
// import axios from "../apis/api";

import { useFormik } from "formik";
import * as Yup from "yup";

function Changepassword() {

  const formik =  useFormik({
    initialValues: {
      password: "",
      newpassword: "",
      confirmpassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Không được trống")
        .min(2, "Phải dài hơn 2 kí tự"),
        newpassword: Yup.string()
        .required("Không được trống")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
          "Mật khẩu không đúng định dạng"
        ),
      confirmpassword: Yup.string()
        .required("Không được trống")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
          "Không trùng với mật khẩu mới"
        ),
    }),

   onSubmit: async  (values) => {
    console.log(values)
 
    },
  });
  console.log(formik.errors.username);

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
         
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={formik.handleSubmit}>
              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0">Đổi mật khẩu</p>
              </div>
              {/* Email input */}
              <div className="form-outline mb-4">
                <input
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
               {formik.errors.password && (
                  <p className="errorMsg"> {formik.errors.password} </p>
                )}
                <label className="form-label" htmlFor="form3Example3">
                  Username
                </label>
              </div>
              {/* Password input */}
              <div className="form-outline mb-3">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  id="newpassword"
                  name="newpassword"
                  value={formik.values.newpassword}
                  onChange={formik.handleChange}
                />
                {formik.errors.newpassword && (
                  <p className="errorMsg"> {formik.errors.newpassword} </p>
                )}
                <label className="form-label" htmlFor="form3Example4" required>
                  Mật khẩu mới
                </label>
              </div>
              <div className="form-outline mb-3">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  id="confirmpassword"
                  name="confirmpassword"
                  value={formik.values.confirmpassword}
                  onChange={formik.handleChange}
                />
                {formik.errors.password && (
                  <p className="errorMsg"> {formik.errors.confirmpassword} </p>
                )}
                <label className="form-label" htmlFor="form3Example4" required>
                  Nhập lại mật khẩu mới
                </label>
              </div>
              
              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="onSubmit"
                  className="btn btn-primary btn-lg"
                  href="/homepage"
                  styleFor={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                >
                  Xác Nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Changepassword;
