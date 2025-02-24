import { toast } from "sonner";
type NotificationType = "superadmin" | "Not register";

export const notificationApi = () => {
  const notify = (type: NotificationType) => {
    switch (type) {
      case "superadmin":
        toast.success("Welcome Superadmin ✅");
        break;
      case "Not register":
        toast.error("Error Log in ❌");
        break;
      default:
        toast.info("Noma'lum xabar");
    }
  };
  return notify;
};
