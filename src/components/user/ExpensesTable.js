// src/components/AssignedUsersTable.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; 

import axios from 'axios';
import AuthService from '../../services/AuthService';

const ExpensesTable = ({ user, userId }) => {
  const location = useLocation();
  const pathname = location.pathname; 
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
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
    const fetchExpenses = async () => {
      try {
        const segments = (pathname.endsWith('/') ? pathname.slice(0, -1) : pathname).split('/');
        const lastSegment = segments[segments.length - 1] ||  null;
        const user_id = lastSegment;
        if (!user_id) {
            setLoading(false);
            return;
        }
        const response = await axios.get(`${process.env.BACKEND_URL}/expenses/users/${user_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setExpenses(response.data);
        setAllExpenses(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      }
    };

    if (token) {
        fetchExpenses();
    } else {
      setError('Unauthorized');
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <p>Loading expenses...</p>;
  }

  if (error) {
    return <p>Error fetching expenses: {error}</p>;
  }

  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (search === '') {
        setExpenses(allExpenses);
      } else {
        const filteredExpenses = allExpenses.filter(expenses => {
          return (
            expenses.title.toLowerCase().includes(search) || 
            expenses.description.toLowerCase().includes(search) || 
            expenses.category.toLowerCase().includes(search)
          );
        });
        setExpenses(filteredExpenses);
      }
    }, 300);
  }

  return (
    <section className="expenses-section">
      <header>
        <h1>Your Expenses</h1>
        <div className="expenses-search-container">
          <input 
            type="text" 
            placeholder="Search expenses" 
            onChange={handleSearch}
            size="30"
          />
        </div>
      </header>
      <div className="expenses-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{capitalize(expense.title)}</td>
                  <td>{expense.description}</td>
                  <td>{capitalize(expense.category)}</td>
                  <td>{expense.amount} {expense.currency}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No expenses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ExpensesTable;