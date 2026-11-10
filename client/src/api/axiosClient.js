import axios from "axios";

// Instance Axios unique pointant vers l API Express (locale ou cloud)
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Intercepteur JWT : ajoute le badge Bearer à chaque requête
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
