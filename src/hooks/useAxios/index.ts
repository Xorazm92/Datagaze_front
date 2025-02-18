import api from "./api";

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
      const { data } = await api({
        url: `${import.meta.env.VITE_BASE_URL}/${url}`,
        data: body,
        method,
        params: {
          access_token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoic3VwZXJhZG1pbiIsInJvbGVfaWQiOjEsImlhdCI6MTczOTg3MDU3MywiZXhwIjoxNzM5OTU2OTczfQ.Cu0G_1XqxVui8A8QNhDSDIp7UtqhT2moIL1tDD26npg",
          ...params
        },
        headers: {
          "Content-Type": "application/json",
          "Accsess-Control-Allow-Origin": true,

          ...headers
        }
      });
      return data;
    } catch (error) {
      console.log("Xato:", error);
      return Promise.reject(error);
    }
  };
  return response;
};
