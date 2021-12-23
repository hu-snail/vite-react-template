import React, { Suspense, lazy } from "react";
import LoadingComponent from "./compontents/Loading";
import RenderRouter from "./router";

export default function App() {
  return (
    <div>
      <Suspense fallback={<LoadingComponent />}>
        <RenderRouter />
      </Suspense>
    </div>
  );
}
