import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-sf-z2s0.onrender.com",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      try {
        document.cookie.split(";").forEach((cookie) => {
          const name = cookie.split("=")[0].trim();

          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=None;Secure`;
        });

        localStorage.clear();
        sessionStorage.clear();
      } catch (_) {}

      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;