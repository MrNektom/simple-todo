import { useState } from "react";
import "./App.css";
import Column from "./lib/components/Column";
import { Routes, Route, useLocation, redirect } from "react-router-dom";
import { Auth, Login, Register } from "./routes/Auth";
import NotFound from "./routes/NotFound";
import Home from "./routes/Home";

interface AppProps {
  hasAuthRedirect: boolean;
}

export default function App() {
  return (
    <Routes>
      <Route index element={<Home />}  />
      <Route path="auth" element={<Auth />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
