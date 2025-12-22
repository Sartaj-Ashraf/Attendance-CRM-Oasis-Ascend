import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // only if using cookies
});
// console.log(import.meta.env.VITE_BACKEND_URL);
export default api;
