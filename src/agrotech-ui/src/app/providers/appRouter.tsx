import { createBrowserRouter } from "react-router";
import { MainLayout } from "../layouts/MainLayout";


export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children:[
       


    ]
  },
]);