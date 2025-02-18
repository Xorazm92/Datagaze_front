import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route, Outlet } from "react-router-dom";

import Desktop from "~/pages/Desktop";
import Login from "~/pages/Login";
import Boot from "~/pages/Boot";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "katex/dist/katex.min.css";
import "~/styles/index.css";
import { Empty } from "antd";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";

function Layout() {
  const [login, setLogin] = useState<boolean>(false);
  // const [booting, setBooting] = useState<boolean>(false);

  const shutMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setLogin(false);
    // setBooting(true);
  };

  const restartMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setLogin(false);
    // setBooting(true);
  };

  const sleepMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setLogin(false);
    // setBooting(true);
  };

  // if (booting) {
  //   return <Boot restart={restart} sleep={sleep} setBooting={setBooting} />;
  // }

  return <Outlet context={{ login, setLogin, shutMac, restartMac, sleepMac }} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/desktop", element: <Desktop /> },
      { path: "/boot", element: <Boot /> },
      {
        path: "*",
        element: (
          <div className="flex items-center justify-center h-[100vh]">
            <Empty description="Malumot topilmadi xatolik !!!!" />
          </div>
        )
      }
    ]
  }
]);

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);
const queryClinet = new QueryClient();
root.render(
  <QueryClientProvider client={queryClinet}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
