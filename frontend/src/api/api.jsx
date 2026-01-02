import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL + "/api",
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Global error handler (rate limit aware)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 🔐 Rate limit
      if (error.response.status === 429) {
        alert(error.response.data.message || "Too many requests. Please wait.");
      }
      // 🔐 Auth errors
      else if (error.response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;