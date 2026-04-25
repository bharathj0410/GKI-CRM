import axios from "axios";

const api = axios.create({
  baseURL: "/api/", // only base URL here
});

export default api;
