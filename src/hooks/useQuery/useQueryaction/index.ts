import { useMutation } from "@tanstack/react-query";
import { notificationApi } from "~/generic/notification";
import { useAxios } from "~/hooks/useAxios";
import { useNavigate } from "react-router-dom";
import { RegisterType } from "~/types";

const useRegister = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const notify = notificationApi();
  return useMutation({
    mutationFn: async ({ data }: { data: RegisterType }) =>
      await axios({ url: "api/1/auth/register", body: data, method: "POST" }),

    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem("token", data.data.token);
      }
      console.log(data);
      navigate("/desktop");
      notify("Register");
    },
    onError: (err) => {
      console.log(err.message);
      notify("Not register");
      navigate("/");
    }
  });
};

export { useRegister };
