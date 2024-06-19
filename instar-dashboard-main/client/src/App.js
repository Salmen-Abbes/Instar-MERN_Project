import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard/dashboard";
import Statistics from "./pages/statistics/statistics";
import Sales from "./pages/sales/sales";
import Products from "./pages/products/products";
import Sidebar from "./components/sidebar/sidebar";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Navbar from "./components/navbar/navbar";
import List from "./pages/list/list";
import Requests from "./pages/requests/requests";
import "./App.css";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const accessToken = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken || !refreshToken) {
        setIsAuthenticated(false);
        return;
      }

      const decodedAccessToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      if (decodedAccessToken.exp <= currentTime) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return;
      }

      if (decodedAccessToken.exp - currentTime < 300) {
        axios
          .post("/api/refreshtoken", { refreshToken })
          .then((response) => {
            const newAccessToken = response.data.accessToken;
            localStorage.setItem("token", newAccessToken);
          })
          .catch((error) => {
            console.error("Error refreshing access token:", error);
          });
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const uid = localStorage.getItem("Uid");
    if (token) {
      setIsAuthenticated(true);
      axios.get(`/api/users/${uid}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user by ID:", error);
        });
    }
  }, []);

  const ProtectedRoute = ({ children, roleRequired }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (roleRequired && role !== roleRequired) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Navbar />}
        {isAuthenticated && <Sidebar />}
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />}
            />
            <Route
              path="/signup"
              element={<Signup setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roleRequired="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <ProtectedRoute roleRequired="user">
                  <Statistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list"
              element={
                <ProtectedRoute roleRequired="admin">
                  <List />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute>
                  <Sales user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/details/:userId"
              element={
                <ProtectedRoute roleRequired="admin">
                  <Requests />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
