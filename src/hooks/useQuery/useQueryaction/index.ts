import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "~/generic/notification";
import { useAxios } from "~/hooks/useAxios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { RegisterType } from "~/types";

const useRegister = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const toast = notificationApi();
  const { setLogin } = useOutletContext<{ setLogin: (value: boolean) => void }>();

  return useMutation({
    mutationFn: async ({ data }: { data: RegisterType }) => {
      try {
        console.log('Sending login request with data:', data);
        const response = await axios({
          url: "/api/1/auth/login",
          body: data,
          method: "POST"
        });
        console.log('Login response:', response);
        return response;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    onSuccess: (response) => {
      console.log('Login success response:', response);
      if (response?.token) {
        try {
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          setLogin(true);
          toast.success("Welcome Superadmin ✅");
          setTimeout(() => {
            navigate("/desktop", { replace: true });
          }, 100);
        } catch (error) {
          console.error('Error saving data:', error);
          toast.error("Login failed. Please try again ❌");
        }
      } else {
        console.error('Invalid response format:', response);
        toast.error("Invalid response from server ❌");
      }
    },
    onError: (err: any) => {
      if (err.response && err.response.data.message.hint) {
        const hint = err.response.data.message.hint;
        toast.info(`Maslahat: Login: ${hint.user}, Parol: ${hint.pass}`);
      } else {
        toast.error("Login failed. Please try again ❌");
      }
      console.error('Login error:', err);
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