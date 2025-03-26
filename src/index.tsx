import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route, Outlet, Navigate, useOutletContext, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import Desktop from "~/pages/Desktop";
import Login from "~/pages/Login";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "katex/dist/katex.min.css";
import "~/styles/index.css";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";

function Layout() {
  const [login, setLogin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLogin(true);
    }
  }, []);

  const handleLogin = (value: boolean) => {
    console.log('Setting login state to:', value);
    setLogin(value);
    if (!value) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    }
  };

  return <Outlet context={{ login, setLogin: handleLogin }} />;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { login } = useOutletContext<{ login: boolean }>();
  
  useEffect(() => {
    console.log('Protected route login state:', login);
  }, [login]);

  if (!login) {
    console.log('Redirecting to login page');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Login /> },
      { 
        path: "/desktop", 
        element: (
          <ProtectedRoute>
            <Desktop />
          </ProtectedRoute>
        )
      },
      {
        path: "*",
        element: (
          <div className="flex items-center justify-center h-[100vh]">
            <h1>Xatolik malumot topilmadi !</h1>
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
    <Toaster position="top-right" richColors />
    <ReactQueryDevtools initialIsOpen={false} />
    <RouterProvider router={router} />
  </QueryClientProvider>
);
