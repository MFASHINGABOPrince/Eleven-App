import axios from "axios";
import authServices from "../feature/auth/authServices";

const api = axios.create({
  baseURL: "http://localhost:2020/api/v1",
});

api.interceptors.request.use((config) => {
  const user = authServices.getUser();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;

export const apiAuth = axios.create({
  baseURL: "http://localhost:2020/api/v1",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }
});



