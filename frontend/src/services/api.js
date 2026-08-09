import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/**
 * Fetch chat history from the backend.
 * @param {number} page
 * @param {number} limit
 */
export const fetchMessages = async (page = 1, limit = 50) => {
  const response = await api.get("/messages", { params: { page, limit } });
  return response.data;
};

/**
 * Persist a message via REST (used as a fallback/complement to Socket.io).
 * @param {{username: string, message: string}} payload
 */
export const sendMessage = async (payload) => {
  const response = await api.post("/messages", payload);
  return response.data;
};

/**
 * Simple health check used to confirm the backend is reachable.
 */
export const checkHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};

export default api;
