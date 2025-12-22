import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach JWT token automatically to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Optional: Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired / invalid
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;