import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL + "/api",
  withCredentials: true, // 🔥 REQUIRED for cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 🔐 Rate limit
      if (error.response.status === 429) {
        alert(
          error.response.data.message ||
            "Too many requests. Please wait."
        );
      }

      // 🔐 Unauthorized (cookie expired / invalid)
      if (error.response.status === 401) {
        // UI cleanup only (token is server-side)
        localStorage.removeItem("role");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;