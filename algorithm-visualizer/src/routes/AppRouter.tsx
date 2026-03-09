import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Algorithms from "../pages/Algorithms";
import Home from "../pages/Home";
import Visualizer from "../pages/Visualizer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "algorithms",
        element: <Algorithms />,
      },
      {
        path: "visualizer/:algorithmId",
        element: <Visualizer />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}