import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { jwtDecode } from "jwt-decode";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role"));
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
        // Token has expired
        setIsAuthenticated(false);
        localStorage.removeItem("token"); // Remove expired token
        localStorage.removeItem("refreshToken"); // Remove refresh token as well
        return;
      }

      if (decodedAccessToken.exp - currentTime < 300) {
        // Check if token is about to expire (within 5 minutes)
        axios
          .post("/api/refreshtoken", { refreshToken })
          .then((response) => {
            const newAccessToken = response.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
          })
          .catch((error) => {
            console.error("Error refreshing access token:", error);
          });
      }
    };

    // Check token expiration every minute
    const intervalId = setInterval(checkTokenExpiration, 60000);

    // Clean up interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Navbar />}
        {isAuthenticated && <Sidebar />}
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/signup"
              element={<Signup setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated && role === "user" ? (
                  <Dashboard />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/statistics"
              element={
                isAuthenticated ? (
                  <Statistics />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/products"
              element={
                isAuthenticated ? (
                  <Products />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/list"
              element={
                isAuthenticated && role === "admin" ? (
                  <List />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/sales"
              element={
                isAuthenticated ? (
                  <Sales />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/requests"
              element={
                isAuthenticated && role === "admin" ? (
                  <Requests />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
