import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://eshop-api-ibpx.onrender.com/"
});

export default API;
