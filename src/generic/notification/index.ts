import { notification } from "antd";
type NotificationType = "Register" | "Not register";

export const notificationApi = () => {
  const notify = (props: NotificationType) => {
    switch (props) {
      case "Register":
        return notification.success({ message: "Success register" });
      case "Not register":
        return notification.error({ message: "Error register" });
    }
  };
  return notify;
};
