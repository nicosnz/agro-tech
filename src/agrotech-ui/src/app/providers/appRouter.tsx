import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout } from "../layouts/MainLayout";
import { Ganado } from "../../pages/ganado/ui/Ganado";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/ganado" replace /> },
      { path: "ganado", element: <Ganado /> },
    ],
  },
]);