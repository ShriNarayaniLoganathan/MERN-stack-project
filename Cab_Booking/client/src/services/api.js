import axios from "axios";
const api = axios.create({
   REACT_APP_API_URL: "https://your-backend.onrender.com"
});

export default api;
