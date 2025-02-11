import axios from "axios";

interface PropsType {
  url?: string;
  method?: "GET" | "DELETE" | "PUT" | "POST";
  params?: object;
  headers?: object;
  body?: object;
}

export const useAxios = () => {
  const response = (props: PropsType) => {
    const { url, headers, params, method = "GET", body } = props;
    return axios({
      url: `${import.meta.env.VITE_BASE_URL}/${url}`,
      data: body,
      method,
      params: {
        ...params
      },
      headers: {
        "Content-Type": "application/json",
        "Accsess-Control-Allow-Origin": true,
        ...headers
      }
    })
      .then((data) => data.data)
      .catch((error) => console.log(error));
  };
  return response;
};
