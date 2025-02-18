import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../useAxios";
// import api from "../Api";

interface useQueryApiType {
  pathname?: string;
  url?: string;
  params?: object;
}

// const ApiData = async () => {
//   const data = await api.get("/products");
// };

const useQueryApi = ({ pathname, url, params }: useQueryApiType) => {
  const axios = useAxios();
  return useQuery({
    queryKey: [pathname],
    queryFn: () => {
      axios({ url, params })
        .then((data) => data.data)
        .catch((error) => console.log(error));
    }
  });
};

export { useQueryApi };
