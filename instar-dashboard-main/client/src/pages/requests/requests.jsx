import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'; // Import de Chart.js
import './requests.css';
import BestsellingIcon from './bestselling.png';
import User1Image from './user1.png';
import User2Image from './user2.png';
import User3Image from './user3.png';

const Requests = () => {
  const monthlyIncomeChartRef = useRef(null);
  const totalIncomeChartRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // État pour stocker l'ID de l'utilisateur sélectionné

  useEffect(() => {
    // Données de revenu mensuel (exemples)
    const monthlyIncomeData = [120, 250, 200, 30, 35, 38, 40, 70, 100, 160, 250, 300];

    // Configuration de l'histogramme pour le revenu mensuel
    const monthlyIncomeCtx = monthlyIncomeChartRef.current;
    if (monthlyIncomeCtx) {
      // Vérifier s'il existe une instance Chart associée au canvas
      if (monthlyIncomeCtx.chart) {
        // Détruire l'instance Chart existante
        monthlyIncomeCtx.chart.destroy();
      }

      // Créer un nouveau Chart instance
      monthlyIncomeCtx.chart = new Chart(monthlyIncomeCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Monthly Income',
            data: monthlyIncomeData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2 // Ajuster l'épaisseur de la bordure
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            },
            x: {
              display: false // Masquer les étiquettes de l'axe x
            }
          },
          plugins: {
            legend: {
              display: false // Masquer la légende
            }
          },
          layout: {
            padding: {
              left: 50,
              right: 50,
              top: 35,
              bottom: 100
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          barPercentage: 0.5, // Réduire l'espace entre les barres
          categoryPercentage: 0.2 // Réduire l'espace entre les catégories
        }
      });
    }

    // Données de revenu total (exemples)
    const totalIncomeData = [150, 75, 95, 130, 100, 120, 70, 50, 100, 300, 254, 100];

    // Configuration du graphique pour le revenu total
    const totalIncomeCtx = totalIncomeChartRef.current;
    if (totalIncomeCtx) {
      // Vérifier s'il existe une instance Chart associée au canvas
      if (totalIncomeCtx.chart) {
        // Détruire l'instance Chart existante
        totalIncomeCtx.chart.destroy();
      }

      // Créer un nouveau Chart instance
      totalIncomeCtx.chart = new Chart(totalIncomeCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Total Income',
            data: totalIncomeData,
            fill: false,
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 3, // Augmenter l'épaisseur des bordures
            pointRadius: 0, // Éliminer les points à la fin de chaque ligne
            pointHoverRadius: 0, // Éliminer les points au survol
            borderCapStyle: 'round' // Rendre les coins doux

          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false // Masquer la légende
            }
          },
          layout: {
            padding: {
              left: 25,
              right: 35,
              top: 35,
              bottom: 100
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: false // Masquer les étiquettes de l'axe x
            }
          }
        }
      });
    }
  }, []);

  // Exemple de données utilisateur
  const users = [
    {
      id: 1,
      username: "Mohamed Ali Yacoubi",
      email: "medali4@gmail.com",
      products: ["Product A", "Product B"],
      pending: false,
      company: "BX DECO",
      country: "Tunisie",
      city: "Tunis",
      phoneNumber: "56478025",
      birthday: "25/02/1980",
      zipCode: "1075",
      subscription: "Silver",
      registrationDate: "20/04/2021"
    },
    {
      id: 2,
      username: "Wissem Yahia",
      email: "wissemyahia@gmail.com",
      products: ["Product C", "Product D"],
      pending: true,
      company: "ARTEFACT",
      country: "Tunisie",
      city: "Manouba",
      phoneNumber: "1080",
      birthday: "05/06/1998",
      zipCode: "2004",
      subscription: "Gold",
      registrationDate: "14/01/2020"
    },
    {
      id: 3,
      username: "Mouhib Ben Hassen",
      email: "mouhibnh44@gmail.com",
      products: ["Product E", "Product F"],
      pending: false,
      company: "SSD DECO",
      country: "Tunisie",
      city: "Djerba",
      phoneNumber: "58470045",
      birthday: "27/04/2001",
      zipCode: "4115",
      subscription: "Platinium",
      registrationDate: "27/04/2022"
    },
    // Ajoutez d'autres utilisateurs au besoin
  ];

  // Fonction pour obtenir l'image de l'utilisateur correspondant
  const getUserImage = (userId) => {
    switch (userId) {
      case 1:
        return User1Image;
      case 2:
        return User2Image;
      case 3:
        return User3Image;
      default:
        return null; // Image par défaut ou aucune image
    }
  };

  // Fonction de gestion du changement de sélection de l'utilisateur
  const handleUserChange = (event) => {
    const userId = parseInt(event.target.value);
    setSelectedUserId(userId);
  };

  // Afficher les options de sélection des utilisateurs
  const userOptions = users.map(user => (
    <option key={user.id} value={user.id}>{user.username}</option>
  ));

  // Récupérer les données de l'utilisateur sélectionné
  useEffect(() => {
    const userData = users.find(user => user.id === selectedUserId);
    setUserData(userData);
  }, [selectedUserId]);

  return (
    <div className="requests-container">
      <div className="tile-container first">
        <div className="tile">
          <div className="user-frame">
            {selectedUserId && <img src={getUserImage(selectedUserId)} alt="User" className="user-image" />}
          </div>
          <select value={selectedUserId} onChange={handleUserChange}>
            <option value="">Sélectionnez un utilisateur</option>
            {userOptions}
          </select>
          {userData && (
            <>
              <p><strong>Username:</strong> {userData.username}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Products:</strong> {userData.products.join(", ")}</p>
              <p><strong>Pending:</strong> {userData.pending ? "Yes" : "No"}</p>
            </>
          )}
        </div>
      </div>
      <div className="tile-container second">
        <div className="tile">
          {userData && (
            <>
              <p><strong>Company:</strong> {userData.company}</p>
              <p><strong>Country:</strong> {userData.country}</p>
              <p><strong>City:</strong> {userData.city}</p>
              <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>
              <p><strong>Birthday:</strong> {userData.birthday}</p>
              <p><strong>ZIP Code:</strong> {userData.zipCode}</p>
              <p><strong>Subscription:</strong> {userData.subscription}</p>
              <p><strong>Registration Date:</strong> {userData.registrationDate}</p>
            </>
          )}
        </div>
      </div>
      <div className="tile-container third">
        <div className="tile">
          <img src={BestsellingIcon} alt="Bestselling Icon" className="bestselling-icon" />
          <h2>Best Selling Product</h2>
          {/* Ajoutez d'autres éléments au besoin */}
        </div>
      </div>
      <div className="tile-container fourth">
        <div className="tile">
          <h2>Monthly Income</h2>
          <canvas ref={monthlyIncomeChartRef} width="100" height="300"></canvas> {/* Utilisation de useRef pour référencer le canvas */}
        </div>
      </div>
      <div className="tile-container fifth">
        <div className="tile">
          <h2>Total Income</h2>
          <canvas ref={totalIncomeChartRef} width="100" height="300"></canvas> {/* Utilisation de useRef pour référencer le canvas */}
        </div>
      </div>
    </div>
  );
};

export default Requests;
