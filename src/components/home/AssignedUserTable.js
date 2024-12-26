// src/components/AssignedUsersTable.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AuthService from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';

const AssignedUsersTable = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = AuthService.getCurrentUser();
  const token = currentUser?.token;

  const searchTimeout = useRef(null);

  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/accountant/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsers(response.data);
        setAllUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchAssignedUsers();
    } else {
      setError('Unauthorized');
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error fetching users: {error}</p>;
  }

  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (search === '') {
        setUsers(allUsers);
      } else {
        const filteredUsers = allUsers.filter(user => {
          return (
            user.fname.toLowerCase().includes(search) || 
            user.sname.toLowerCase().includes(search) || 
            user.email.toLowerCase().includes(search)
          );
        });
        setUsers(filteredUsers);
      }
    }, 300);
  }

  const handleRowClick = (user) => {
    navigate(`/user/${user.id}`, { state: { user } });
  };

  return (
    <section className="assigned-table-section">
      <header>
        <h1>Your Clients</h1>
        <div>
          <input 
            type="text" 
            placeholder="Search users" 
            onChange={handleSearch}
          />
        </div>
      </header>
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Occupation</th>
              <th>Phone No.</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} onClick={() => handleRowClick(user)} className="user-row">
                  <td>
                    {capitalize(user.fname)} {capitalize(user.sname)}
                  </td>
                  <td>{user.email}</td>
                  <td>{capitalize(user.occupation)}</td>
                  <td>{user.phone_number}</td>
                  <td>{capitalize(user.account_status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AssignedUsersTable;