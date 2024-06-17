import React, { useState } from "react";
import "./sidebar.css";
import { MdSpaceDashboard } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { DiDropbox } from "react-icons/di";
import { RiMessage2Fill } from "react-icons/ri";
import { BiSolidLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import logo from "./logo.png";

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("Uid");
    localStorage.removeItem("role");
    window.location.reload();
  };
  const [role, setRole] = useState(localStorage.getItem("role"));
  return (
    <div className="sidebar">
      <div className="top">
        <Link to={role==='user' ?("/dashboard") : ("/statistics")}>
          <img src={logo} alt="" />
        </Link>
      </div>
      <div className="center">
        <ul>
          {role === "admin" && (
            <Link to="/dashboard">
              <li>
                <MdSpaceDashboard /> <span>Dashboard</span>
              </li>
            </Link>
          )}
          {role === "user" && (
            <Link to="/statistics">
              <li>
                <IoStatsChart /> <span>Statistics</span>
              </li>
            </Link>
          )}

          <Link to="/sales">
            <li>
              <FaSackDollar /> <span>Sales</span>
            </li>
          </Link>
          <Link to="/products">
            <li>
              <DiDropbox /> <span>Products</span>
            </li>
          </Link>
          {role === "admin" && (
            <Link to="/list">
              <li>
                <FaUsers /> <span>List</span>
              </li>
            </Link>
          )}

          
        </ul>
      </div>
      <div className="bottom" onClick={handleLogout}>
        <BiSolidLogOut /> Logout
      </div>
    </div>
  );
};

export default Sidebar;
