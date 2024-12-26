import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { SignupProvider } from './context/SignupContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LogoutPage from './pages/LogoutPage';
import CreateAccountPage from './pages/CreateAccountPage';
import UserPage from './pages/UserPage';

import HomePage from './pages/HomePage';

import './styles/styles.css';

const App = () => {
  return (
    <SignupProvider>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/createaccount" element={<CreateAccountPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Route>
      </Routes>
    </SignupProvider>
  );
};

export default App;