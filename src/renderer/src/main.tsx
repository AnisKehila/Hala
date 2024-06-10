import "./assets/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Router />
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>
);
