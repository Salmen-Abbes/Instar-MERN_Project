import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiSearch2Line } from "react-icons/ri";
import "./products.css";

const renderStars = (numStars) => {
  const fullStars = "★".repeat(numStars);
  const emptyStars = "☆".repeat(5 - numStars);
  return (
    <span style={{ color: "#FFEE54" }}>
      {fullStars}
      <span style={{ color: "#777" }}>{emptyStars}</span>
    </span>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [user, setUser] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    subCategory: "",
    image: "",
    image3DInfo: [],
    fournisseur: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const uid = localStorage.getItem("Uid");
    if (token) {
      axios.get(`/api/users/${uid}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user by ID:", error);
        });
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchFournisseurs();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const response = await axios.get("/api/fournisseurs");
      setFournisseurs(response.data);
    } catch (error) {
      console.error("Error fetching fournisseurs:", error);
    }
  };

  useEffect(() => {
    const filterProducts = () => {
      const filtered = products.filter((product) => {
        const nameMatch = product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        if (filterOption === "In Stock") {
          return nameMatch && product.quantity > 0;
        } else if (filterOption === "Out of Stock") {
          return nameMatch && product.quantity === 0;
        } else {
          return nameMatch;
        }
      });
      setFilteredProducts(filtered);
    };
    filterProducts();
  }, [products, searchTerm, filterOption]);

  const handleFilterChange = (option) => {
    setFilterOption(option);
    setShowFilterOptions(false);
  };

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowConfirmDialog(true);
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setShowEditDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/products/${productToDelete._id}`);
      setProducts(
        products.filter((product) => product._id !== productToDelete._id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    setShowConfirmDialog(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setProductToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    try {
      await axios.put(`/api/products/${productToEdit._id}`, productToEdit, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setProducts(
        products.map((product) =>
          product._id === productToEdit._id ? productToEdit : product
        )
      );
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && value < 0) {
      return;
    }
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const addProduct = () => {
    const saveProduct = async () => {
      try {
        await axios.post("/api/products", JSON.stringify(newProduct), {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await axios.get("/api/products");
        setProducts(response.data); // Refresh product list after adding new product
      } catch (error) {
        console.error("Error adding product:", error);
      }
    };
    saveProduct();
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      category: "",
      subCategory: "",
      image: "",
      image3DInfo: [],
      fournisseur: "",
    });
    setShowAddDialog(false);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredProducts.length);

  return (
    <div>
      <span className="title">Products</span>
      <div className="search">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <RiSearch2Line className="iicon" />
      </div>
      <div>
        <button className="filter-button" onClick={toggleFilterOptions}>
          Filter {showFilterOptions ? "▲" : "▼"}
        </button>
        {showFilterOptions && (
          <ul className="filter-options">
            <li onClick={() => handleFilterChange("All")}>Show All</li>
            <li onClick={() => handleFilterChange("In Stock")}>In Stock</li>
            <li onClick={() => handleFilterChange("Out of Stock")}>
              Out of Stock
            </li>
          </ul>
        )}
      </div>
      <button className="add-button" onClick={() => setShowAddDialog(true)}>
        Add Product
      </button>
      <div className="background">
        <div className="tablew">
          <table className="table">
            <thead>
              <tr>
                <th>Id code</th>
                <th>Product Name</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Category</th>
                <th>Status</th>
                <th>Reviews</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.slice(startIndex, endIndex).map((product) => {
                const supplier = fournisseurs.find(
                  (f) => f._id === product.fournisseur
                );
                return (
                  <tr key={product._id}>
                    <td>#{product._id.toString().slice(-7).toUpperCase()}</td>
                    <td>{product.name}</td>
                    <td>{supplier ? supplier.name : "Unknown"}</td>
                    <td>{product.price} DT</td>
                    <td>{product.category}</td>
                    <td>
                      <span
                        className="status"
                        style={{
                          backgroundColor:
                            product.quantity > 0 ? "#47aacd" : "#D55500",
                        }}
                      >
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td>{renderStars(product.rating)}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <button onClick={() => handleEdit(product)}>Edit</button>
                      <button onClick={() => handleDelete(product)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pagination">
        <button onClick={goToPreviousPage}>Previous</button>
        <span>{currentPage}</span>
        <button onClick={goToNextPage}>Next</button>
      </div>

      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to delete this product?</p>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={() => setShowConfirmDialog(false)}>No</button>
          </div>
        </div>
      )}

      {showEditDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Product</h3>
            <label>
              Product Name:
              <input
                type="text"
                name="name"
                value={productToEdit.name}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                name="description"
                value={productToEdit.description}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={productToEdit.price}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Category:
              <input
                type="text"
                name="category"
                value={productToEdit.category}
                onChange={handleEditChange}
              />
            </label>
            <label>
              SubCategory:
              <input
                type="text"
                name="subCategory"
                value={productToEdit.subCategory}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Image:
              <input
                type="text"
                name="image"
                value={productToEdit.image}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={productToEdit.quantity}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Fournisseur:
              <select
                name="fournisseur"
                value={productToEdit.fournisseur}
                onChange={handleEditChange}
              >
                <option value="">Select Fournisseur</option>
                {fournisseurs.map((fournisseur) => (
                  <option key={fournisseur._id} value={fournisseur._id}>
                    {fournisseur.name}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={saveEdit}>Save</button>
            <button onClick={() => setShowEditDialog(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showAddDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Product</h3>
            <label>
              Product Name:
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleAddChange}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                name="description"
                value={newProduct.description}
                onChange={handleAddChange}
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleAddChange}
                min="0"
              />
            </label>
            <label>
              Category:
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleAddChange}
              />
            </label>
            <label>
              SubCategory:
              <input
                type="text"
                name="subCategory"
                value={newProduct.subCategory}
                onChange={handleAddChange}
              />
            </label>
            <label>
              Image:
              <input
                type="text"
                name="image"
                value={newProduct.image}
                onChange={handleAddChange}
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleAddChange}
                min="0"
              />
            </label>
            <label>
              Fournisseur:
              <select
                name="fournisseur"
                value={newProduct.fournisseur}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, fournisseur: e.target.value })
                }
              >
                <option value="">Select Fournisseur</option>
                {fournisseurs.map((fournisseur) => (
                  <option key={fournisseur._id} value={fournisseur._id}>
                    {fournisseur.name}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={addProduct}>Add Product</button>
            <button onClick={() => setShowAddDialog(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
