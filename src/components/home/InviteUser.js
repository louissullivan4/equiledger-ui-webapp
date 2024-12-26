// src/components/InviteUser.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { env } from '../../config/env';

const apiUrl = env.apiUrl;

const InviteUser = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const token = currentUser?.token;
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!token) {
      alert('Invalid or missing token. Please login again.');
      navigate('/login');
    }
  }, [navigate, token]);

  const handleInviteUser = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter an email.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/users/invite`,
        { email, inviterId: currentUser?.id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      console.log('Invited User successfully:', response.data);
      alert('User invited successfully!');
      setEmail('');
    } catch (error) {
      console.error('Error inviting user:', error);
      if (error.response && error.response.data) {
        console.error('Error details:', error.response.data.error);
        alert(`Error inviting user: ${error.response.data.error}`);
      } else {
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <section className="invite-user-section">
      <header>
        <h1>Invite User</h1>
      </header>
      <form onSubmit={handleInviteUser}>
        <input
          type="email"
          id="email"
          placeholder="Enter Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
};

export default InviteUser;
