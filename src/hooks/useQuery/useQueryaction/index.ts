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
      await axios({ url: "/api/1/auth/login", body: data, method: "POST" }),

    onSuccess: (data) => {
      if (data.status === "success") {
        localStorage.setItem("token", data.token);
      }
      navigate("/desktop");
      notify("superadmin");
    },
    onError: (err) => {
      console.log(err.message);
      notify("Not register");
    }
  });
};

export { useRegister };
