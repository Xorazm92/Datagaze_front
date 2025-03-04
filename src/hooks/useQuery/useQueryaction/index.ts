import { useMutation, useQueryClient } from "@tanstack/react-query";
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

const useInstallApplication = () => {
  // const queryClient = useQueryClient();
  const axios = useAxios();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data?: any }) =>
      await axios({
        url: `/api/1/desktop/install/${id}`,
        body: data,
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }),
    onSuccess: (response) => {
      console.log("succsess application", response);
      // queryClient.invalidateQueries({
      //   queryKey: ["information_app", id]
      // });
    },
    onError: (err) => {
      console.log(err.message);
    }
  });
};

const useDeleteApplication = () => {
  const axios = useAxios();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await axios({
        url: `/api/1/desktop/uninstall/${id}`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: (res) => {
      console.log("Delete application", res);
    },
    onError: (error) => {
      console.log(error.message);
    }
  });
};

export { useRegister, useInstallApplication, useDeleteApplication };
