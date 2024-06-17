import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = ({ setIsAuthenticated,setRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const response = await axios.post("/api/login", {
        username,
        password,
      });
      const { token, refreshtoken, Uid, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshtoken);
      localStorage.setItem("Uid", Uid);
      localStorage.setItem("role", role);
      setIsAuthenticated(true);

      if (role === "admin") {
        setRole("admin")
        navigate("/dashboard");
      } else if (role === "user") {
        setRole("user")
        navigate("/statistics");
      } else {
        setError("Invalid role.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label htmlFor="username">Email or Phone</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          <p className="signup-link">
            Not a member? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
