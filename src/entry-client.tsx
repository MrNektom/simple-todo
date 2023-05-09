import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { getUser } from "./api/auth";
import "@material-design-icons/font/outlined.css";

if (
  !getUser() &&
  (location.href.startsWith("/auth/login") ||
    location.href.startsWith("/auth/register"))
) {
  location.href = "/auth/login";
}

ReactDOM.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
