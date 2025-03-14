import api from "./api";

interface PropsType {
  url?: string;
  method?: "GET" | "DELETE" | "PUT" | "POST";
  params?: object;
  headers?: object;
  body?: object;
}

export const useAxios = () => {
  const response = async ({ url, headers, params, method = "GET", body }: PropsType) => {
    try {
      const { data } = await api({
        url: `${import.meta.env.VITE_BASE_URL}${url}`,
        data: body,
        method,
        params: {
          ...params
        },
        headers
      });
      return data;
    } catch (error) {
      console.log("Api xatosi", error);
      return Promise.reject(error);
    }
  };
  return response;
};
