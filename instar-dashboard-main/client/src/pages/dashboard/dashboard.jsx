import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Link } from "react-router-dom";
import logoavatar from "./logoavatar.png";
import "./dashboard.css";

function PercentageChart({ available, unavailable }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const percentageChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Available", "Not Available"],
        datasets: [
          {
            data: [available, unavailable],
            backgroundColor: ["#647adf", "#ff0000"], // Change the color for "Not Available" to red
            cutout: "85%",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 14,
              },
              generateLabels: function (chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const meta = chart.getDatasetMeta(0);
                    const style = meta.controller.getStyle(i);
                    return {
                      text: label,
                      fillStyle: style.backgroundColor,
                      hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                      lineCap: style.borderCapStyle,
                      lineDash: style.borderDash,
                      lineDashOffset: style.borderDashOffset,
                      lineJoin: style.borderJoinStyle,
                      lineWidth: style.borderWidth,
                      strokeStyle: style.borderColor,
                      pointStyle: style.pointStyle,
                      rotation: style.rotation,
                      textAlign: style.textAlign,
                      borderRadius: 0,
                    };
                  });
                }
                return [];
              },
            },
          },
          tooltip: {
            enabled: false,
          },
          doughnutlabel: {
            labels: [
              {
                text: `${((available / (available + unavailable)) * 100).toFixed(2)}%`,
                font: {
                  size: "30",
                },
              },
            ],
          },
        },
        animation: {
          animateRotate: true,
          animateScale: false,
        },
        layout: {
          padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        },
      },
    });

    return () => {
      percentageChart.destroy();
    };
  }, [available, unavailable]);

  return <canvas ref={chartRef} />;
}




const userVotes = [
  { username: "user1", comment: "Good Product" },
  { username: "user2", comment: "Good Service" },
  // Add more static user votes as needed
];

function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [totalProducts] = useState(32);
  const [filterType, setFilterType] = useState("weekly");

  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentDay = currentDate.getDate();
  const daysArray = [];
  for (let i = -3; i <= 3; i++) {
    const date = new Date();
    date.setDate(currentDay + i);
    daysArray.push(date);
  }

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const chartRef = useRef(null);
  const histogramChartRef = useRef(null);

  useEffect(() => {
    const staticLineData = {
      daily: { "2024-06-12": 50, "2024-06-13": 70, "2024-06-14": 60, "2024-06-15": 90, "2024-06-16": 80 }
    };

    const ctx = chartRef.current.getContext("2d");
    const lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Object.keys(staticLineData.daily),
        datasets: [
          {
            label: "Total Income",
            data: Object.values(staticLineData.daily),
            borderColor: "#647adf",
            backgroundColor: "rgba(147, 112, 219, 0.1)",
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: "#647adf",
            pointBorderColor: "#647adf",
            pointBorderWidth: 2,
            tension: 0.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            display: true,
          },
          x: {
            display: true,
          },
        },
        elements: {
          line: {
            borderWidth: 2,
            fill: true,
          },
          point: {
            radius: 5,
          },
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    return () => {
      lineChart.destroy();
    };
  }, []);

  useEffect(() => {
    let filteredData = [];
    switch (filterType) {
      case "weekly":
        filteredData = [20, 40, 60, 80, 100];
        break;
      case "monthly":
        filteredData = [100, 200, 300, 400, 500];
        break;
      case "annually":
        filteredData = [500, 400, 300, 200, 100];
        break;
      default:
        filteredData = [0, 50, 100, 150, 200];
    }

    const ctx = histogramChartRef.current.getContext("2d");
    const histogramChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["DEL", "Conf", "Ret", "Can", "Rec"],
        datasets: [
          {
            label: "Sales",
            data: filteredData,
            backgroundColor: "#647adf",
            borderWidth: 1,
            borderSkipped: "end",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    return () => {
      histogramChart.destroy();
    };
  }, [filterType]);

  const confirmOrderHours = [10, 13, 16, 19];

  const getConfirmationBarHeight = (day, hour) => {
    const orderConfirmationHour = hour;
    const lineHeight = 40;
    return day.getHours() === orderConfirmationHour ? lineHeight : 0;
  };

  useEffect(() => {
    document.title = "Indar App";
  }, []);

  return (
    <div className="dashboard">
      <Link to="/dashboard">
        <div className="welcome-back-container">
          <div className="welcome-back-text">Welcome back!</div>
          <img src={logoavatar} alt="Welcome" className="welcome-back-logo" />
        </div>
      </Link>
      <div className="calendar-container">
        <div className="container">
          <div className="month">{currentMonth}</div>
          <div className="arrow right-arrow" onClick={goToNextDay}>
            {">"}
          </div>
        </div>
        <div className="calendar">
          {daysArray.map((day, index) => (
            <div className={`date ${index === 3 ? "selected" : ""}`} key={index}>
              <div className="day">{day.getDate()}</div>
              <div className="day-text">
                {day.toLocaleString("default", { weekday: "short" })}
              </div>
              <div className="order-chart">
                {confirmOrderHours.map((hour) => (
                  <div
                    className="confirmation-bar"
                    style={{
                      height: `${getConfirmationBarHeight(day, hour)}px`,
                    }}
                    key={hour}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chart-container" style={{ width: "268px", height: "320px" }}>
        <canvas ref={chartRef} id="lineChart" width="320" height="320"></canvas>
      </div>
      <div className="centered-chart-container">
        <div className="stock-chart-container stock-content" style={{ width: "119px", height: "320px",padding:"35px" }}>
          <div className="stock-chart-title">Products Availability:</div>
          <PercentageChart available={20} unavailable={10} />
        </div>
        <div className="histogram-chart-container histogram-content" style={{ width: "270px", height: "290px" }}>
          <div className="histogram-chart-filters">
            <label htmlFor="filter"></label>
            <select
              id="filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
          <div className="histogram-chart-title">Order Status</div>
          <canvas ref={histogramChartRef} id="histogramChart" width="300" height="300"></canvas>
        </div>
      </div>
      <div className="customer-review-container customer-review-content">
        <div className="customer-review">
          <h2>Customer Reviews</h2>
          <div className="user-votes-container">
            {userVotes.map((user, index) => (
              <div className="user-vote" key={index}>
                <p>{user.username}</p>
                <p>{user.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
