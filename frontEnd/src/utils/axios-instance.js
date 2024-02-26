// src/utils/axiosConfig.js
import axios from "axios";
import { store } from "../store";

// Set up Axios interceptor to automatically add the Authorization header
const NETWORK_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 3000;
// const baseURL = process.env.BASE_URL || "http://localhost:5000";
// console.log('baseURL',baseURL);

const axiosDefaultConfig = {
  // baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: NETWORK_TIMEOUT,
};
const instance = axios.create(axiosDefaultConfig);
instance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    console.log(state.auth.token);
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
