import React, { useState, useEffect, useRef } from "react";
import "./dashboard.css";
import Chart from "chart.js/auto";
import { Link } from "react-router-dom"; // Importez Link depuis react-router-dom
import logoavatar from "./logoavatar.png";
import axios from "axios";
// Composant pour le graphique de pourcentage
function PercentageChart() {
  const chartRef = useRef(null);
  const [available, setAvailable] = useState(0);
  const [unavailable, setUnavailable] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("/api/totalAvailableProducts").then((response) => {
          setAvailable(response.data.available);
          setUnavailable(response.data.unavailable);
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []); // Assurez-vous de surveiller les deux props
  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const percentageChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Available Products", "Unavailable Products"], // Ajoutez les étiquettes pour les deux ensembles de données
        datasets: [
          {
            data: [available, unavailable], // Utilisez les valeurs des props
            backgroundColor: ["#647adf", "#f5f5f5"], // Couleur des produits disponibles et non disponibles
            cutout: "85%",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
          doughnutlabel: {
            // Utilisation du plugin pour afficher les libellés personnalisés
            labels: [
              {
                text: `${(
                  (available / (available + unavailable)) *
                  100
                ).toFixed(2)}%`, // Calcul du pourcentage des produits disponibles
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

// un tableau d'utilisateurs qui ont voté
const userVotes = [
  { username: "user1" },
  { username: "user2" },
  // ...
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
    const ctx = chartRef.current.getContext("2d");
    const lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jour 1",
          "Jour 2",
          "Jour 3",
          "Jour 4",
          "Jour 5",
          "Jour 6",
          "Jour 7",
        ],
        datasets: [
          {
            label: "Total Income",
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
        filteredData = [1, 7, 14, 21, 28];
        break;
      case "monthly":
        filteredData = [20, 25, 10, 15, 8];
        break;
      case "annually":
        filteredData = [5, 30, 5, 7, 8];
        break;
      default:
        filteredData = [0, 50, 100, 150, 200];
    }

    const ctx = histogramChartRef.current.getContext("2d");
    const histogramChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [" DEL", "Conf", "Ret", "Can", "Rec"],
        datasets: [
          {
            label: "Sales",
            data: filteredData,
            backgroundColor: "#647adf",
            borderWidth: 1, // Changé l'épaisseur des barres à 1
            borderSkipped: "end", // Ajouté cette propriété pour que les barres ne débordent pas sur les bords
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
  const confirmOrderHours = [10, 13, 16, 19]; // Heures de confirmation des commandes pour chaque jour

  const getConfirmationBarHeight = (day, hour) => {
    const orderConfirmationHour = hour; // Heure de confirmation souhaitée
    const lineHeight = 40; // Hauteur de la barre
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
          <img
            src={logoavatar}
            alt="Welcome"
            className="welcome-back-logo"
          />{" "}
          {/* Nouvel icône */}
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
            <div
              className={`date ${index === 3 ? "selected" : ""}`}
              key={index}
            >
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
      <div
        className="chart-container"
        style={{ width: "268px", height: "320px" }}
      >
        <canvas ref={chartRef} id="lineChart" width="320" height="320"></canvas>
      </div>
      <div className="centered-chart-container">
        <div
          className="stock-chart-container stock-content"
          style={{ width: "119px", height: "320px" }}
        >
          <div className="stock-chart-title">Products Availability:</div>
          <PercentageChart available={totalProducts} />
        </div>
        <div
          className="histogram-chart-container histogram-content"
          style={{ width: "270px", height: "290px" }}
        >
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
          <canvas
            ref={histogramChartRef}
            id="histogramChart"
            width="300"
            height="300"
          ></canvas>
        </div>
      </div>
      <div className="customer-review-container customer-review-content">
        <div className="customer-review">
          <h2>Customer Reviews</h2>
          <div className="user-votes-container">
            {userVotes.map((user, index) => (
              <div className="user-vote" key={index}>
                <p>{user.username}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
