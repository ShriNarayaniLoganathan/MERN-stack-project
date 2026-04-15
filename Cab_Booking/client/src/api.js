import axios from "axios";

//🚕 Ride API
const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api/rides",
});

//🔐 Auth API
export const AuthAPI = axios.create({
  baseURL: "http://127.0.0.1:5000/api/auth",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  console.log("Sending token 👉",token)
  if(token){
    req.headers.authorization = `Bearer ${token}`;
  }
  return req;
});
export default API;