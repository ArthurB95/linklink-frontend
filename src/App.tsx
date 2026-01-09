import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import { BioPage } from "./pages/BioPage";
import { LinkShortenerPage } from "./pages/LinkShortenerPage";
import { QRCodePage } from "./pages/QRCodePage";
import { PublicProfilePage } from "./pages/PublicProfilePage";
import { OAuth2RedirectHandler } from "./pages/OAuth2RedirectHandler";
import { PublicProfileUser } from "./pages/PublicProfileUser";
import { Toaster } from "./components/ui/sonner";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("accessToken");
  });

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <LoginPage onLogin={() => setIsAuthenticated(true)} />
              )
            }
          />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/bio"
            element={
              <PrivateRoute>
                <BioPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/links"
            element={
              <PrivateRoute>
                <LinkShortenerPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/qrcode"
            element={
              <PrivateRoute>
                <QRCodePage />
              </PrivateRoute>
            }
          />
          {/* Public Profile Routes */}
          <Route path="/:username" element={<PublicProfileUser />} />
          <Route path="/preview/:username" element={<PublicProfilePage />} />
        </Routes>
      </Router>
      <Toaster position="top-center" duration={2000} />
    </>
  );
}
