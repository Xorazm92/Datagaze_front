import axios from "axios";

interface PropsType {
  url?: string;
  method?: "GET" | "DELETE" | "PUT" | "POST";
  params?: object;
  headers?: object;
  body?: object;
}

export const useAxios = () => {
  const response = async (props: PropsType) => {
    const { url, headers, params, method = "GET", body } = props;
    try {
      const { data } = await axios({
        url: `${import.meta.env.VITE_BASE_URL}/${url}`,
        data: body,
        method,
        params: { ...params },
        headers: {
          "Content-Type": "application/json",
          "Accsess-Control-Allow-Origin": true,
          ...headers
        }
      });
      return data;
    } catch (error) {
      console.log("Xato:", error);
      return Promise.reject(error); // Xatoni return qilish kerak!
    }
  };
  return response;
};
