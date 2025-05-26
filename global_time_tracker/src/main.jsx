import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import GlobalTimeTracker from "./GlobalTimeTracker";

const root = ReactDOM.createRoot(document.getElementById("app"));

root.render(
  <React.StrictMode>
    <GlobalTimeTracker />
  </React.StrictMode>
);
