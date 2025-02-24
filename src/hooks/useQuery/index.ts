import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../useAxios";

interface useQueryApiType<T> {
  pathname: string;
  url: string;
  params?: object;
}

const useQueryApi = <T>({ pathname, url, params }: useQueryApiType<T>) => {
  const axios = useAxios();
  return useQuery({
    queryKey: [pathname],
    queryFn: async () => {
      if (!url) throw new Error("URL berilishi shart!");
      const data = await axios({ url, params });

      if (!data) {
        throw new Error("Serverdan noto‘g‘ri javob keldi!");
      }

      return data;
    }
  });
};

export { useQueryApi };

//keshidagi malumotlari olish va saqlash uchun ishlataman
