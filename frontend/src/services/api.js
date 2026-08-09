
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const fetchMessages = async (page = 1, limit = 50) => {
  const response = await api.get("/messages", {
    params: { page, limit },
  });

  return response.data;
};

export const sendMessage = async (payload) => {
  const response = await api.post("/messages", payload);

  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get("/health");

  return response.data;
};

export default api;
