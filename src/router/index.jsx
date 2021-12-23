import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

import LayoutPage from "@/layout";

const Home = lazy(() => import("@/views/home"));
const Detail = lazy(() => import("@/views/detail"));

const routeList = [
  {
    path: "/",
    element: <LayoutPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "detail",
        element: <Detail />,
      },
    ],
  },
];

const RenderRouter = () => {
  const element = useRoutes(routeList);
  console.log(element);
  return element;
};

export default RenderRouter;
