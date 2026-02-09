import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthPage from "./auth/AuthPage";

const root = document.getElementById("root");
if (!root) throw new Error("Root not found");

// DEMO: поменяй на true чтобы увидеть авторизацию
const SHOW_AUTH = true;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    {SHOW_AUTH ? <AuthPage /> : <App />}
  </React.StrictMode>
);
