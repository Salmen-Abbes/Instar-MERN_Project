import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./list.css";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [entriesToShow, setEntriesToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}/delete`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEntriesChange = (event) => {
    setEntriesToShow(Number(event.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(users.length / entriesToShow);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const generateTablePagination = () => {
    const pagination = [];
    for (let i = 1; i <= totalPages; i++) {
      pagination.push(
        <span
          key={i}
          className={i === currentPage ? "active" : ""}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </span>
      );
    }
    return pagination;
  };

  const filteredUsers = users.filter((user) =>
    user.Firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * entriesToShow;
  const endIndex = startIndex + entriesToShow;
  const usersToShow = filteredUsers.slice(startIndex, endIndex);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteUser(userToDelete._id);
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleUserClick = (userId) => {
    navigate(`/details/${userId}`); // Navigate to the Requests page with userId as a param
  };

  return (
    <div>
      <div className="users-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="c">{filteredUsers.length} Users</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersToShow.map((user) => (
              <tr key={user._id} onClick={() => handleUserClick(user._id)}>
                <td>{user.Firstname}</td>
                <td>{user.Lastname}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering row click
                      handleDeleteClick(user);
                    }}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <span onClick={handlePreviousPage}>&laquo; Previous</span>
          {generateTablePagination()}
          <span onClick={handleNextPage}>Next &raquo;</span>
        </div>
      </div>
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Users;
