import React, { useState, useEffect } from "react";
import axios from "axios";
import "./sales.css"; // Import the CSS file for sales styles

const Sales = ({user}) => {
  const [salesData, setSalesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(4);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [lastSelectedDate, setLastSelectedDate] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [popupStep, setPopupStep] = useState(1);
  const [newStatus, setNewStatus] = useState("");
  const [role,setRole] = useState(null)
  useEffect(() => {
    // Fetch sales data
    setRole(user.role)
    const fetchSalesData = async () => {
      try {
        const response = await axios.get("/api/sales");
        const sales = response.data;

        // Fetch products data
        const productsResponse = await axios.get("/api/products");
        const products = productsResponse.data;
        
        // Map sales to include product details and calculate total price
        const mappedSales = sales.map((sale) => {
          const product = products.find((p) => p._id === sale.productId);
          return {
            ...sale,
            product,
            total: product.price * sale.quantity,
          };
        });
        
        setSalesData(mappedSales);
      } catch (error) {
        console.error("Error fetching sales or products data", error);
      }
    };
    
    fetchSalesData();
  }, []);
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleEntriesChange = (event) => {
    setEntriesToShow(event.target.value);
  };
  
  const handleDateFilterChange = (date) => {
    setDateFilter(date);
    setLastSelectedDate(date);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("");
    setLastSelectedDate("");
  };

  useEffect(() => {
    
    if (dateFilter === "") {
      setLastSelectedDate("");
    }
  }, [dateFilter,user]);
  
  const handleStatusChange = (idCode, status) => {
    setSelectedSaleId(idCode);
    setNewStatus(status);
    setShowConfirmDialog(true);
  };

  const confirmAction = async () => {
    try {
      await axios.put(`/api/sales/${selectedSaleId}/status`, {
        status: newStatus,
      });

      setSalesData(
        salesData.map((sale) =>
          sale._id === selectedSaleId ? { ...sale, status: newStatus } : sale
        )
      );

      setShowConfirmDialog(false);
      setSelectedSaleId(null);
    } catch (error) {
      console.error("Error updating sale status", error);
    }
  };

  const cancelAction = () => {
    setShowConfirmDialog(false);
    setSelectedSaleId(null);
  };

  const generateTablePagination = () => {
    const totalPages = Math.ceil(salesData.length / entriesToShow);
    const pagination = [];

    for (let i = 1; i <= totalPages; i++) {
      pagination.push(<span key={i}>{i}</span>);
    }

    return pagination;
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setPopupStep(1);
    setShowOrderPopup(true);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setPopupStep(2);
    setShowProductPopup(true);
  };

  const handleBack = () => {
    setPopupStep(1);
    setShowProductPopup(false);
    setShowOrderPopup(true);
  };

  const filteredSalesData = salesData
    .filter((sale) => {
      return (
        (statusFilter === "all" || sale.status === statusFilter) &&
        (dateFilter === "" || sale.timestamp.includes(dateFilter)) &&
        (sale._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .slice(0, entriesToShow);
    const filteredSalesData2 = salesData
    .filter((sale) => {
      return (
        (statusFilter === "all" || sale.status === statusFilter) &&
        (dateFilter === "" || sale.timestamp.includes(dateFilter)) &&
        (sale._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (role !== "user" || sale.UserId === user?._id) // Filter by UserId if the role is "user"
      );
    })
    .slice(0, entriesToShow);
    return (
      <div>
        <div className="sales-header">
          <h1 className="page-title">Sales</h1>
          <input onChange={handleSearchChange} />
        </div>
        <div className="sales-container">
          <h2 className="sales-title">All Sales</h2>
          <div className="search-and-pagination">
            <input
              className="search-input-left"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <select
              className="pagination-select"
              value={entriesToShow}
              onChange={handleEntriesChange}
            >
              <option value="5">Show 5 entries</option>
              <option value="10">Show 10 entries</option>
              <option value="20">Show 20 entries</option>
            </select>
          </div>
          <div className="filter-buttons">
            <select
              className="date-filter"
              value={lastSelectedDate}
              onChange={(e) => handleDateFilterChange(e.target.value)}
            >
              <option value="">Date</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
            <button onClick={handleClearFilters}>Clear Filters</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Commande</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                {role === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredSalesData.map((sale, index) => (
                <tr key={index}>
                  <td
                    className="order-id-button"
                    onClick={() => handleOrderClick(sale)}
                  >
                    {sale._id}
                  </td>
                  <td>{new Date(sale.timestamp).toLocaleDateString()}</td>
                  <td>{sale.total}</td>
                  <td>
                    {role === "admin" ? (
                      <select
                        value={sale.status || ""}
                        onChange={(e) =>
                          handleStatusChange(sale._id, e.target.value)
                        }
                      >
                        <option value="En cours de livraison">
                          En cours de livraison
                        </option>
                        <option value="Livrée">Livrée</option>
                        <option value="Autre">Autre</option>
                      </select>
                    ) : (
                      sale.status
                    )}
                  </td>
                  {role === "admin" && (
                    <td>
                      {sale.status === "En cours de livraison" && (
                        <div className="bouton">
                          <button
                            onClick={() =>
                              handleStatusChange(sale._id, "Livrée")
                            }
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(sale._id, "Autre")}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {sale.status === "Livrée" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(
                                sale._id,
                                "En cours de livraison"
                              )
                            }
                          >
                            Back
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">{generateTablePagination()}</div>
        </div>
        {showConfirmDialog && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>
                Are you sure you want to change the status of this order to{" "}
                {newStatus}?
              </p>
              <button onClick={confirmAction}>Yes</button>
              <button onClick={cancelAction}>No</button>
            </div>
          </div>
        )}
        {showOrderPopup && popupStep === 1 && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Order Details</h2>
              <p>Order ID: {selectedOrder._id}</p>
              <p>Date: {new Date(selectedOrder.timestamp).toLocaleDateString()}</p>
              <p>Total: {selectedOrder.total}</p>
              <button
                onClick={() => handleProductClick(selectedOrder.product)}
              >
                View Product Details
              </button>
              <button onClick={() => setShowOrderPopup(false)}>Close</button>
            </div>
          </div>
        )}
        {showProductPopup && popupStep === 2 && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Product Details</h2>
              <p>Name: {selectedProduct.name}</p>
              <p>Price: {selectedProduct.price}</p>
              <p>Description: {selectedProduct.description}</p>
              <button onClick={handleBack}>Back to Order</button>
              <button onClick={() => setShowProductPopup(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
export default Sales;
