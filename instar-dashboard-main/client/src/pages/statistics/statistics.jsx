import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import "./statistics.css";
import SalesIcon from "./salesicon1.png";
import CustomerIcon from "./customericon.png";
import ProductIcon from "./producticon.png";
import RequestIcon from "./requesticon.png";
import RevenuIcon from "./revenu.png";
import ReqIcon from "./req.png";
import MoneyIcon from "./money.png";
import axios from "axios";
const Statistics = () => {
  const visitorsData = [
    { day: "Lun", visitors: 40 },
    { day: "Mar", visitors: 30 },
    { day: "Mer", visitors: 80 },
    { day: "Jeu", visitors: 50 },
    { day: "Ven", visitors: 15 },
    { day: "Sam", visitors: 20 },
    { day: "Dim", visitors: 33 },
  ];

  const monthlyData = [
    { day: 1, visitors: 50 },
    { day: 2, visitors: 45 },
    { day: 3, visitors: 60 },
    { day: 4, visitors: 55 },
    { day: 5, visitors: 70 },
    { day: 6, visitors: 65 },
    { day: 7, visitors: 80 },
    { day: 8, visitors: 75 },
    { day: 9, visitors: 90 },
    { day: 10, visitors: 85 },
    { day: 11, visitors: 100 },
    { day: 12, visitors: 95 },
    { day: 13, visitors: 10 },
    { day: 14, visitors: 5 },
    { day: 15, visitors: 20 },
    { day: 16, visitors: 15 },
    { day: 17, visitors: 10 },
    { day: 18, visitors: 25 },
    { day: 19, visitors: 40 },
    { day: 20, visitors: 35 },
    { day: 21, visitors: 50 },
    { day: 22, visitors: 15 },
    { day: 23, visitors: 16 },
    { day: 24, visitors: 15 },
    { day: 25, visitors: 17 },
    { day: 26, visitors: 19 },
    { day: 27, visitors: 18 },
    { day: 28, visitors: 17 },
    { day: 29, visitors: 9 },
    { day: 30, visitors: 18 },
    { day: 31, visitors: 20 },
  ];

  const activityData = [
    { day: "Lun", activity: 20 },
    { day: "Mar", activity: 30 },
    { day: "Mer", activity: 40 },
    { day: "Jeu", activity: 25 },
    { day: "Ven", activity: 35 },
    { day: "Sam", activity: 45 },
    { day: "Dim", activity: 50 },
  ];

  const [salesData, setSalesData] = useState([]);
  const [deliveriesData, setDeliveriesData] = useState([]);
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        await axios.get("/api/stats/summary").then((response) => {
          setSalesData(response.data);
        });
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDeliveriesData = async () => {
      try {
        await axios.get("/api/stats/delivered-summary").then((response) => {
          setDeliveriesData(response.data);
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchDeliveriesData();
    fetchSalesData();
  }, []);

  const targetData = [
    {
      target: 10,
      fournisseurId: "6651fea563e33bde3d7e8689",
      fournisseurName: "company 1",
    },
  ];

  const [viewMode, setViewMode] = useState("weekly");
  const [weeklySales, setWeeklySales] = useState(0);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  useEffect(() => {
    const lineChartCtx = document.getElementById("line-chart");
    const organicTrafficChartCtx = document.getElementById(
      "organic-traffic-chart"
    );
    const percentageChartCtx = document.getElementById("percentage-chart");

    Chart.getChart(lineChartCtx)?.destroy();
    Chart.getChart(organicTrafficChartCtx)?.destroy();
    Chart.getChart(percentageChartCtx)?.destroy();

    new Chart(lineChartCtx, {
      type: "line",
      data: {
        labels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        datasets: [
          {
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.7,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    new Chart(percentageChartCtx, {
      type: "doughnut",
      data: {
        labels: ["Delivered Models", "Target"],
        datasets: [
          {
            label: "Models",
            data: [30, 100],
            backgroundColor: ["rgb(255, 205, 86)", "rgb(54, 162, 235)"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        aspectRatio: 3,
        cutout: "70%",
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    const salesStatusData = salesData[0]?.sales;
    const salesStatusLabels = salesStatusData?.map((item) => item.status);
    const salesStatusCounts = salesStatusData?.map((item) => item.count);

    const salesStatusChartCtx = document.getElementById("sales-status-chart");
    Chart.getChart(salesStatusChartCtx)?.destroy();
    new Chart(salesStatusChartCtx, {
      type: "bar",
      data: {
        labels: salesStatusLabels,
        datasets: [
          {
            label: "Sales Status",
            data: salesStatusCounts,
            backgroundColor: "rgb(75, 192, 192)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const weeklyData = visitorsData.map((item) => item.visitors);
    const totalWeeklySales = weeklyData.reduce(
      (total, visitors) => total + visitors,
      0
    );
    setWeeklySales(totalWeeklySales);

    const conversionRateChartCtx = document.getElementById(
      "conversion-rate-chart"
    );
    Chart.getChart(conversionRateChartCtx)?.destroy();
    new Chart(conversionRateChartCtx, {
      type: "line",
      data: {
        labels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        datasets: [
          {
            label: "Weekly Sales",
            data: weeklyData,
            borderColor: "rgb(255, 159, 64)",
            tension: 0.6,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Création du graphique des commandes livrées par rapport à l'objectif
    const deliveredVsTargetCtx = document.getElementById(
      "delivered-vs-target-chart"
    );
    Chart.getChart(deliveredVsTargetCtx)?.destroy();

    const targetDataValues = targetData.map((item) => item.target);
    const fournisseurNames = deliveriesData.map((item) => item.fournisseurName);
  }, [visitorsData]);

  const calculateRevenue = () => {
    const lineChartData = [65, 9, 80, 81, 56, 55, 40];
    const totalRevenue = lineChartData.reduce(
      (total, revenue) => total + revenue,
      0
    );
    return totalRevenue;
  };

  const calculateSales = () => {
    let totalSales = 0;
    if (viewMode === "weekly") {
      const weeklyData = visitorsData.map((item) => item.visitors);
      totalSales = weeklyData.reduce((total, visitors) => total + visitors, 0);
    } else if (viewMode === "monthly") {
      const monthlyVisitors = monthlyData.map((item) => item.visitors);
      totalSales = monthlyVisitors.reduce(
        (total, visitors) => total + visitors,
        0
      );
    }
    return totalSales;
  };

  const calculateCustomers = () => {
    return 100;
  };

  const calculateProducts = () => {
    return 50;
  };

  const calculateRequests = () => {
    return 200;
  };

  return (
    <div>
      <div className="statistics-container1">
        <h1 className="page-title">Statistiques</h1>
        <div className="tile-container first-container">
          <div className="tile">
            <h9>New Visitors</h9>
            <div className="bar-chart">
              {visitorsData.map(({ day, visitors }, index) => (
                <React.Fragment key={index}>
                  <div
                    className="bar"
                    style={{ height: `${visitors}px` }}
                  ></div>
                  <div className="day-label">{day}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">Tri</button>
          <div className="dropdown-content">
            <span onClick={() => handleViewModeChange("weekly")}>Weekly</span>
            <span onClick={() => handleViewModeChange("monthly")}>Monthly</span>
          </div>
        </div>
      </div>
      <div className="statistics-container2">
        <div className="tile-container second-container">
          <div className="tile">
            <h8>Activity</h8>
            <canvas id="line-chart"></canvas>
          </div>
        </div>
      </div>
      <div className="statistics-container3">
        <div className="tile-container third-container">
          <div className="tile">
            <h3>Conversion Rate</h3>
            <input
              type="text"
              value={`Compared to the last month: $${calculateSales()}`}
              readOnly
              className="input-Compared-to-the-last-month"
            />
            <canvas id="conversion-rate-chart"></canvas>
          </div>
        </div>
      </div>
      <div className="statistics-container4">
        <div className="tile-container fourth-container">
          <div className="tile">
            <h8>Sales Status</h8>
            <canvas id="sales-status-chart"></canvas>
          </div>
        </div>
      </div>

      <div className="statistics-container6">
        <div className="tile-container sixth-container">
          <div className="tile">
            <img src={MoneyIcon} alt="Money Icon" className="money-icon" />
            <input
              type="text"
              value={`Proceeds: $${calculateSales()}`}
              readOnly
              className="input-proceeds"
            />
            <canvas id="line-chart"></canvas>
          </div>
        </div>
      </div>

      <div className="statistics-container7">
        <div className="tile-container seventh-container">
          <div className="tile">
            <img src={RevenuIcon} alt="Revenu Icon" className="revenu-icon" />
            <input
              type="text"
              value={`Revenue: $${calculateRevenue()}`}
              readOnly
              className="input-revenue"
            />
          </div>
        </div>
      </div>
      <div className="statistics-container8">
        <div className="tile-container eighth-container">
          <div className="sale-container">
            <div className="sale-item">
              <img src={SalesIcon} alt="Sales Icon" className="sales-icon" />
              <input
                type="text"
                value={`Sales: $${calculateSales()}`}
                readOnly
                className="input-sales"
              />
            </div>
            <div className="sale-item">
              <img
                src={CustomerIcon}
                alt="Customer Icon"
                className="customer-icon"
              />
              <input
                type="text"
                value={`Customers: ${calculateCustomers()}`}
                readOnly
                className="input-customers"
              />
            </div>
            <div className="sale-item">
              <img
                src={ProductIcon}
                alt="Product Icon"
                className="product-icon"
              />
              <input
                type="text"
                value={`Products: ${calculateProducts()}`}
                readOnly
                className="input-products"
              />
            </div>
            <div className="sale-item">
              <img
                src={RequestIcon}
                alt="Request Icon"
                className="request-icon"
              />
              <input
                type="text"
                value={`Requests: ${calculateRequests()}`}
                readOnly
                className="input-requests"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="statistics-container9">
        <div className="tile-container ninth-container">
          <div className="tile">
            <span className="models-label">Models : </span>
            <input
              type="text"
              value={``}
              readOnly
              className="input-Delivered-Models"
            />
            <canvas id="delivered-vs-target-chart"></canvas>
          </div>
        </div>
      </div>
      <div className="statistics-container10">
        <div className="tile-container tenth-container">
          <div className="tile">
            <img src={ReqIcon} alt="Req Icon" className="req-icon" />
            <input
              type="text"
              value={`Request: ${calculateRequests()}`}
              readOnly
              className="input-request"
            />
          </div>
        </div>
      </div>
      <div className="statistics-container12">
        <div className="tile-container twelfth-container">
          <div className="tile">
            <input readOnly />
          </div>
        </div>
      </div>
      <div className="statistics-container13">
        <div className="tile-container thirteenth-container">
          <div className="tile">
            <canvas id="percentage-chart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
