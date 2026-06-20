import axios from "axios";
const BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
const api = axios.create({ baseURL: BASE });
api.interceptors.request.use((c) => {
  const t = localStorage.getItem("access_token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const r = await axios.post(`${BASE}/accounts/login/refresh/`, { refresh });
          localStorage.setItem("access_token", r.data.access);
          orig.headers.Authorization = `Bearer ${r.data.access}`;
          return api(orig);
        } catch { localStorage.clear(); window.location.href = "/login"; }
      }
    }
    return Promise.reject(err);
  }
);
export default api;
