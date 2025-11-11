import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:500/api/users",
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

    // Verifica se o erro é relacionado  ao token expirado
    if ((status === 401 || status === 403) && !handledExpiredToken) {
      handledExpiredToken = true; // Marca que o token expirou para evitar loops

      try {
        console.log("🔴 Interceptor captou erro:", error.response);

        alert("Seu token expirou! Faça login novamente");
      } catch (e) {
        console.error("Erro ao tratar token expirado:", e);
      }

      // Remove o token e outros dados do localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("ID_Usuario");
      localStorage.removeItem("Tipo_Usuario");
      localStorage.removeItem("Email");

      // Redefine a variável para permitir novos logins
      handledExpiredToken = false;

      // Redireciona para a página de login
      window.location.href = "/login";
    }

    // Retorna o erro para ser tratado normalmente
    return Promise.reject(error);
  }
);

export default api;