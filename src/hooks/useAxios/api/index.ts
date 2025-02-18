import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accsess-Control-Allow-Origin": "*"
  }
});

// 🔥 Request Interceptor - Har bir so‘rovga token avtomatik qo‘shiladi
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Tokenni localStorage yoki Redux-dan olish
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Response Interceptor - Xatolarni avtomatik boshqarish
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log(
        "⛔ Token yaroqsiz yoki muddati tugagan. Foydalanuvchini logout qilamiz."
      );
      localStorage.removeItem("token");
      window.location.href = "/desktop"; // Login sahifaga yo‘naltirish
    }
    return Promise.reject(error);
  }
);

export default api;
