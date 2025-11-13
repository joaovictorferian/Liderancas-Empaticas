import axios from "axios";

const api = axios.create({
  baseURL: "https://projeto404-site-backend.vercel.app/api/users",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let handledExpiredToken = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    console.log(status)
    if (status === 409) {
        return Promise.reject(error);

      }
    if ((status === 401 || status === 403) && !handledExpiredToken) {
      handledExpiredToken = true; 

      try {
        console.log("🔴 Interceptor captou erro:", error.response);

        alert("Seu token expirou! Faça login novamente");
      } catch (e) {
        console.error("Erro ao tratar token expirado:", e);
      }

      localStorage.removeItem("token");
      localStorage.removeItem("ID_Usuario");
      localStorage.removeItem("Tipo_Usuario");
      localStorage.removeItem("Email");

      handledExpiredToken = false;

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;