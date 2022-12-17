import axios from "axios";

// const baseURL = process.env.BASE_URL;

const ins = axios.create({
    baseURL: `http://localhost:9000/`
  });

  ins.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (!token) return config;

    config.headers['authorization'] = `${token}`;
    return config;
  
  }, function (error) {
    return Promise.error(error);
  })
  
  ins.interceptors.response.use(function (response) {
    return response.data;
  }, function (error) {
    return Promise.reject(error);
  })
  
  export default ins;