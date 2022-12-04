import "./login.css";
import React from "react";
import axios from "../../apis/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../../components/hooks/useAuth";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import SwalCard from "../../components/CardErr";
import { render } from "@testing-library/react";
function Login() {
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  const { login } = useAuth();


  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .trim()
        .required("Tên đăng nhập được trống")
        .min(2, "Tên đăng nhập phải dài hơn 2 kí tự"),
      password: Yup.string()
        .trim()
        .required("Mật khẩu không được trống")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
          "Mật khẩu chứa 1 chữ hoa, 1 chữ số và dài hơn 8 kí tự"
        ),
    }),

    onSubmit: async (values) => {
      const { username, password } = values;
      try {
        const res = await axios({
          url: "/api/auth/login",
          method: "post",
          data: {
            username,
            password,
          },
        });
        console.log(res)
        if (res.success === 1) {
          login({
            _id: res.data._id,
            token: res.data.token,
          });
        }if(res.success === 0){
          console.log(1)
          // render(
          //   <SwalCard text='Tên đăng nhập hoặc mật khẩu sai'></SwalCard>
          //   )
          alert("sai passs")
        }
      } catch (err) {
        console.log(err);
        // render(
        // <SwalCard text='Tên đăng nhập hoặc mật khẩu sai'></SwalCard>
        // )
      }
    },
  });

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            />
          </div>
          <div className="col-md-4 col-lg-6 col-xl-4 offset-xl-1">
            <div className="col-md-12 col-lg-12 col-xl-12">
              <div className="col-md-12 col-lg-8 col-xl-9">
                <div className="login-form">
                  <h2>Đăng Nhập</h2>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="login_top">
                      <label>Tên đăng nhập</label>
                      <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        id="username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                      />

                      {formik.errors.username && (
                        <p className="errorMsg"> {formik.errors.username} </p>
                      )}
                    </div>

                    <div className="login_mide">
                      <label>Mật khẩu</label>
                      <input
                        type="password"
                        placeholder="Mật khẩu"
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                      />

                      {formik.errors.password && (
                        <p className="errorMsg"> {formik.errors.password} </p>
                      )}
                    </div>

                    <div className="login_bottom">
                      <button className="btnlogin" type="submit">
                        Đăng nhập
                      </button>
                      <a href="/forgotpassword" className="pt-3">
                        Quên mật khẩu?
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
