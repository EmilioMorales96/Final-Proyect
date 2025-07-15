import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AppSettingsProvider } from "./context/AppSettingsContext.jsx";
import "./index.css";
import "./App.css";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./AppRoutes.jsx";
import "./i18n";

/**
 * Application entry point
 * Sets up all necessary providers and initializes the React application
 * 
 * Provider hierarchy:
 * - AuthProvider: Manages user authentication state
 * - AppSettingsProvider: Manages application settings (theme, language, etc.)
 * - BrowserRouter: Enables client-side routing
 * - Toaster: Global toast notification system
 */
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