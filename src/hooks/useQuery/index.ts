import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../useAxios";
// import api from "../Api";

interface useQueryApiType {
  pathname?: string;
  url?: string;
  params?: object;
}

const useQueryApi = ({ pathname, url, params }: useQueryApiType) => {
  const axios = useAxios();
  return useQuery({
    queryKey: [pathname],
    queryFn: async () => {
      const response = await axios({ url, params });
      return response.data;
    }
  });
};

export { useQueryApi };

//keshidagi malumotlari olish uchun ishlataman
