// src/pages/UserPage.js
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ExpensesTable from '../components/user/ExpensesTable';
import Profile from '../components/user/Profile';
import DownloadExpenses from '../components/user/DownloadExpenses';

const UserPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = location.state || {};

  return (
    <section className="user-main-page">
      <header>
        <h1>EquiLedger Dashboard</h1>
        <DownloadExpenses />
      </header>
        <section className="home-items">
          <Profile user={user} userId={id} />
          <ExpensesTable user={user} userId={id}/>
        </section>
    </section>
  );
};

export default UserPage;
