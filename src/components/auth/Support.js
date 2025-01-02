// src/components/Support.js
import React, { useState } from 'react';
import axios from 'axios';

const Support = () => {
  const [userEmail, setUserEmail] = useState('');
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // <-- new state

  const handleSendSupport = async (e) => {
    e.preventDefault();

    if (!userEmail || !issueType || !issueDescription) {
        setInfoMessage('Email, Type, and Issue are required for sending a support request.');
        return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/support`,
        {
          userEmail,
          issueType,
          issueDescription,
        }
      );

      if (response.status === 200) {
        setInfoMessage('Your support request has been sent! We will be in touch soon.');
        setAlertType('success');
        setIssueDescription('');
      } else {
        setInfoMessage('Oops, something went wrong. Please try again later.');
        setAlertType('error');
      }
    } catch (error) {
      setInfoMessage('An error occurred. Please try again.');
      setAlertType('error');
    }
  };

  return (
    <section className="support-main-page">
      <header>
        <h1>EquiLedger Support</h1>
      </header>
      <main>
        <form onSubmit={handleSendSupport}>
        {infoMessage && (
            <div
                className={
                    alertType === 'success' ? 'info-message success' : 'info-message error'
                }>
                {infoMessage}
            </div>
           )}
          <input
            type="email"
            placeholder="Your Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
            <option value="">-- Select an issue type --</option>
            <option value="Login Issue">Login Issue</option>
            <option value="Billing Issue">Billing Issue</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            style={{ height: '100px', marginBottom: '1em' }}
            placeholder="Describe your issue in detail..."
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
          ></textarea>
          <button type="submit">Send</button>
        </form>
      </main>
    </section>
  );
};

export default Support;
