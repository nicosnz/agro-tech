import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout } from "../layouts/MainLayout";
import { Ganado } from "../../pages/ganado/ui/Ganado";
import { Pesajes } from "@/pages/pesajes/ui/Pesajes";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/ganado" replace /> },
      { path: "ganado", element: <Ganado /> },
      { path: 'pesajes',element:<Pesajes/>  }
    ],
  },
]);