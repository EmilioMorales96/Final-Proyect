import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AppSettingsProvider } from "./context/AppSettingsContext.jsx";
import "./index.css";
import "./App.css";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./AppRoutes.jsx";

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppSettingsProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <AppRoutes />
        </BrowserRouter>
      </AppSettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);