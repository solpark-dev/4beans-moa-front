// src/api/httpClient.js
import axios from "axios";

const httpClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default httpClient;
