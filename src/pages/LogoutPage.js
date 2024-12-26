import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        AuthService.logout();
        navigate('/');
      });

    return(
        <br></br>
    )

};
export default LogoutPage;
