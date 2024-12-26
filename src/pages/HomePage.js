// src/pages/HomePage.js
import React from 'react';
import AssignedUsersTable from '../components/home/AssignedUserTable';
import InviteUser from '../components/home/InviteUser';

const HomePage = () => {
  return (
    <section className="home-main-page">
      <header>
        <h1>EquiLedger Dashboard</h1>
      </header>
      <section className="home-items">
        <AssignedUsersTable />
        <InviteUser />
      </section>
    </section>
  );
};

export default HomePage;
