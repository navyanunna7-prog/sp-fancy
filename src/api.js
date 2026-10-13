import axios from "axios";

const api = axios.create({
  baseURL: "https://sp-fancy-backend-1.onrender.com/api",
});

export default api;
