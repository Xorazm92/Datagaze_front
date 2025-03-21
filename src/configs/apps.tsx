import { appBarHeight } from "~/utils";
import type { AppsData } from "~/types";

const apps: AppsData[] = [
  {
    id: "launchpad",
    title: "Applications",
    desktop: false,
    img: "/icons/icon-4.png"
  },

  {
    id: "support",
    title: "Support",
    desktop: false,
    width: 600,
    height: 580,
    y: -20,
    img: "/icons/support.png"
  },
  {
    id: "users",
    title: "Superadmin",
    desktop: true,
    content: <SuperAdmin_users />,
    img: "/icons/users.png"
  },
  {
    id: "safari",
    title: "Safari",
    desktop: true,
    width: 1024,
    minWidth: 375,
    minHeight: 200,
    x: -20,
    img: "/icons/safari.png",
    content: <Safari />
  },
  {
    id: "vscode",
    title: "VSCode",
    desktop: true,
    width: 900,
    height: 600,
    x: 80,
    y: -30,
    img: "/icons/vscode.png",
    content: <VSCode />
  },
  {
    id: "facetime",
    title: "FaceTime",
    desktop: true,
    img: "/icons/facetime.png",
    width: 500 * 1.7,
    height: 500 + appBarHeight,
    minWidth: 350 * 1.7,
    minHeight: 350 + appBarHeight,
    aspectRatio: 1.7,
    x: -80,
    y: 20,
    content: <FaceTime />
  },
  {
    id: "terminal",
    title: "Terminal",
    desktop: true,
    img: "/icons/terminal.png",
    content: <Terminal />
  },
  {
    id: "Add product",
    title: "Add product",
    desktop: true,
    img: "/icons/Liceses.png",
    content: <ModalLicense />
  },
  {
    id: "computers",
    title: "Computers",
    desktop: true,
    img: "/icons/camputers.png",
    content: <Computers />
  }
];

export default apps;
