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

      navigate("/desktop",{replace:true});
      notify("superadmin");
    },
    onError: (err) => {
      console.log(err.message);
      notify("Not register");
    }
  });
};

const useInstallApplication = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data?: any }) => {
      const response = await axios({
        url: `/api/1/desktop/install/${id}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data
      });
      return response.data;
    },
    onSuccess: (response, variables) => {
      console.log("Success application:", response);
      queryClient.invalidateQueries({
        queryKey: ["information_app", variables.id]
      });
    },
    onError: (err) => {
      console.error("Error installing application:", err.message);
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
    onSuccess: () => {
      console.log("Delete application", 1);
    },
    onError: (error) => {
      console.log(error.message);
    }
  });
};

export { useRegister, useInstallApplication, useDeleteApplication };
