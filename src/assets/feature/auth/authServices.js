import axios from "axios";

// Save token & user to localStorage securely (avoid sensitive data if possible)
const saveUser = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
};

const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const login = async (credentials) => {
  const response = await axios.post(`http://localhost:2020/api/v1/auth/login`, credentials);
  if (response.data?.token) {
    saveUser(response.data);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  login,
  logout,
  getUser,
};
