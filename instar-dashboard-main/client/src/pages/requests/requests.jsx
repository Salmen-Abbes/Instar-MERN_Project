import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './requests.css';
import BestsellingIcon from './bestselling.png';
import UserImage from './user2.png';

const Requests = () => {
  const { userId } = useParams(); // Get userId from URL params
  const [user, setUser] = useState(null);
  const monthlyIncomeChartRef = useRef(null);
  const totalIncomeChartRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const monthlyIncomeData = [120, 250, 200, 30, 35, 38, 40, 70, 100, 160, 250, 300];

    const monthlyIncomeCtx = monthlyIncomeChartRef.current;
    if (monthlyIncomeCtx) {
      if (monthlyIncomeCtx.chart) {
        monthlyIncomeCtx.chart.destroy();
      }

      monthlyIncomeCtx.chart = new Chart(monthlyIncomeCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Monthly Income',
            data: monthlyIncomeData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true },
            x: { display: false }
          },
          plugins: { legend: { display: false } },
          layout: {
            padding: { left: 50, right: 50, top: 35, bottom: 100 }
          },
          responsive: true,
          maintainAspectRatio: false,
          barPercentage: 0.5,
          categoryPercentage: 0.2
        }
      });
    }

    const totalIncomeData = [150, 75, 95, 130, 100, 120, 70, 50, 100, 300, 254, 100];

    const totalIncomeCtx = totalIncomeChartRef.current;
    if (totalIncomeCtx) {
      if (totalIncomeCtx.chart) {
        totalIncomeCtx.chart.destroy();
      }

      totalIncomeCtx.chart = new Chart(totalIncomeCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Total Income',
            data: totalIncomeData,
            fill: false,
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 0,
            borderCapStyle: 'round'
          }]
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false } },
          layout: {
            padding: { left: 25, right: 35, top: 35, bottom: 100 }
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { display: false } }
        }
      });
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    user?(<div className="requests-container">
      <div className="tile-container first">
        <div className="tile">
          <div className="user-frame">
            <img src={UserImage} alt="User" className="user-image" />
          </div>
          <p><strong>Username:</strong> {user.Firstname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Prhone:</strong> {user.phone}</p>
          <p><strong>Ban:</strong> {user.ban ? "Yes" : "No"}</p>
        </div>
      </div>
      
      <div className="tile-container third">
        <div className="tile">
          <img src={BestsellingIcon} alt="Bestselling Icon" className="bestselling-icon" />
          <h2>Best Selling Product</h2>
        </div>
      </div>
      <div className="tile-container fourth">
        <div className="tile">
          <h2>Monthly Income</h2>
          <canvas ref={monthlyIncomeChartRef} width="100" height="300"></canvas>
        </div>
      </div>
      <div className="tile-container fifth">
        <div className="tile">
          <h2>Total Income</h2>
          <canvas ref={totalIncomeChartRef} width="100" height="300"></canvas>
        </div>
      </div>
    </div>):(<div>User Not Found</div>)
  );
};

export default Requests;
