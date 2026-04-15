import axios from "axios";

// Use environment variable
const BASE_URL = process.env.REACT_APP_API_URL;

//🚕 Ride API
const API = axios.create({
  baseURL: `${BASE_URL}/api/rides`,
});

//🔐 Auth API
export const AuthAPI = axios.create({
  baseURL: `${BASE_URL}/api/auth`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;