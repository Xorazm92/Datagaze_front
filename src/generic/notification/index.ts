import { toast } from "sonner";
type NotificationType = "superadmin" | "Not register" | "login_failed" | "invalid_response";

export const notificationApi = () => {
  const notify = (type: NotificationType) => {
    switch (type) {
      case "superadmin":
        toast.success("Welcome Superadmin ✅");
        break;
      case "Not register":
        toast.error("Error Log in ❌");
        break;
      case "login_failed":
        toast.error("Login failed. Please try again ❌");
        break;
      case "invalid_response":
        toast.error("Invalid response from server ❌");
        break;
      default:
        toast.info("Noma'lum xabar");
    }
  };
  return notify;
};
