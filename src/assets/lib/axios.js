import axios from "axios";
import authServices from "../feature/auth/authServices";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:2020/api/v1",
});

// ✅ Request interceptor: Add token dynamically
api.interceptors.request.use((config) => {
  const user = authServices.getUser();
  const token = user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response interceptor: Handle expired JWT (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
