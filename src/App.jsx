import React, { Suspense, lazy } from "react";
import LoadingComponent from "./compontents/Loading";
import RenderRouter from "./router";
import "./App.css";
export default function App() {
  return (
    <div className="app-container">
      <Suspense fallback={<LoadingComponent />}>
        <RenderRouter />
      </Suspense>
    </div>
  );
}
