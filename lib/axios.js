import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/", // only base URL here
});

export default api;
