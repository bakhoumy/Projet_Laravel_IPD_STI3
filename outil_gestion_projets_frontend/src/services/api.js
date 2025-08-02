// src/services/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  }
});

// Intercepteur pour ajouter le token à chaque requête
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;