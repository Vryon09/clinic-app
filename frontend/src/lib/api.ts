import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;
    const message = error?.response?.data?.message;

    if (
      status === 403 &&
      (code === "FEATURE_HIDDEN" || code === "FEATURE_DISABLED")
    ) {
      toast.error(
        code === "FEATURE_DISABLED"
          ? "Read-Only Feature"
          : "Feature Restricted",
        {
          description:
            message || "This action is not allowed for your current role.",
        },
      );
    }

    return Promise.reject(error);
  },
);

export default api;
