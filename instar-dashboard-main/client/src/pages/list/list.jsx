import React, { useState, useEffect } from "react";
import axios from "axios";
import "./list.css"; // Import the CSS for user styles
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [entriesToShow, setEntriesToShow] = useState(5); // Change to 5 for only 5 users
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Add useState for searchTerm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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
      // Handle error here, e.g., display an error message to the user
    }
  };

  const handleEntriesChange = (event) => {
    setEntriesToShow(Number(event.target.value));
    setCurrentPage(1); // Reset to first page on entries change
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

  // Filtering user data based on searchTerm
  const filteredUsers = users.filter((user) => {
    return (
      user.Firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const startIndex = (currentPage - 1) * entriesToShow;
  const endIndex = startIndex + entriesToShow;

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
          <span className="c">{filteredUsers.length} Users </span>
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
            {filteredUsers.slice(startIndex, endIndex).map((user) => (
              <tr key={user._id}>
                <td>{user.Firstname}</td>
                <td>{user.Lastname}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClick(user)}
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
