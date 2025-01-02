// src/pages/HomePage.js
import React from 'react';

const GetStartedPage = () => {
  return (
    <section className="home-main-page">
      <header>
        <h1>EquiLedger Dashboard</h1>
      </header>
      <section className="home-items">
        <div className="get-started-container">
          <h2>Account created!</h2>
          <p>
            To get started, please login to your account on the EquiLedger app.
          </p>
        </div>
      </section>
    </section>
  );
};

export default GetStartedPage;
