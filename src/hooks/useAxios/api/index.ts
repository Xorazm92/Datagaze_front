import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000',
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    console.log('Request config:', config);
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response data:', response.data);
    return response.data;
  },
  (error) => {
    console.log(`Interceptor Error: Status=${error.response?.status}, URL='${error.config.url}'`); // DEBUGGING LINE
    console.error('Response error:', error);
    if (error.response?.status === 401 && error.config.url !== '/api/1/auth/login') {
      console.log("Token yaroqsiz yoki muddati tugagan. Foydalanuvchini logout qilamiz.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
