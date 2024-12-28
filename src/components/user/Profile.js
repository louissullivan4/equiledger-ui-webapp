// src/components/AssignedUsersTable.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import AuthService from '../../services/AuthService';
import axios from 'axios';
import { formatSimpleDate, capitalise } from '../../utils/gf';

const Profile = ({ user, userId }) => {
    const location = useLocation();
    const pathname = location.pathname; 
    const [fetchedUser, setFetchedUser] = useState(user || null);
    const [loadingUser, setLoadingUser] = useState(!user);
    const [userError, setUserError] = useState(null);
    const currentUser = AuthService.getCurrentUser();
    const token = currentUser?.token;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!fetchedUser) {
                    const segments = (pathname.endsWith('/') ? pathname.slice(0, -1) : pathname).split('/');
                    const lastSegment = segments[segments.length - 1] ||  null;
                    const user_id = lastSegment;
                    if (!user_id) {
                        setUserError('User ID not found.');
                        setLoadingUser(false);
                        return;
                    }
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${user_id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setFetchedUser(response.data);
                } else {
                    setLoadingUser(false);
                }
            } catch (error) {
                setUserError(error.message || 'Error fetching user.');
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, [fetchedUser, userId, token]);

    if (loadingUser) {
        return <div>Loading...</div>;
    }

    if (userError) {
        return <div>Error: {userError}</div>;
    }

    return (
        <section className="profile-section">
            <header>
                <h1>Profile</h1>
            </header>
            <section>
                <div className="profile-container">
                    <h2>Basic Information</h2>
                    <div className="info-list">
                        <div className="info-item">
                            <span className="info-label">Name</span>
                            <span className="info-value">
                                {capitalise(fetchedUser.fname)} {capitalise(fetchedUser.mname)} {capitalise(fetchedUser.sname)}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email</span>
                            <span className="info-value">{fetchedUser.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Phone Number</span>
                            <span className="info-value">{fetchedUser.phone_number}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Date of Birth</span>
                            <span className="info-value">{formatSimpleDate(fetchedUser.date_of_birth)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">PPSNO</span>
                            <span className="info-value">{fetchedUser.ppsno}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Occupation</span>
                            <span className="info-value">{capitalise(fetchedUser.occupation)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Address Line 1</span>
                            <span className="info-value">{capitalise(fetchedUser.address_line1)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Address Line 2</span>
                            <span className="info-value">{capitalise(fetchedUser.address_line2)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">City</span>
                            <span className="info-value">{capitalise(fetchedUser.city)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">County</span>
                            <span className="info-value">{capitalise(fetchedUser.county)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Country</span>
                            <span className="info-value">{capitalise(fetchedUser.country)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Postcode</span>
                            <span className="info-value">{fetchedUser.postal_code}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Tax Status</span>
                            <span className="info-value">{capitalise(fetchedUser.tax_status)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Marital Status</span>
                            <span className="info-value">{capitalise(fetchedUser.marital_status)}</span>
                        </div>
                    </div>

                    <h2>Account Information</h2>
                    <div className="info-list">
                        <div className="info-item">
                            <span className="info-label">Role</span>
                            <span className="info-value">{capitalise(fetchedUser.role)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Account Creation Date</span>
                            <span className="info-value">{formatSimpleDate(fetchedUser.created_at)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Subscription Level</span>
                            <span className="info-value">{capitalise(fetchedUser.subscription_level)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Account Status</span>
                            <span className="info-value">{capitalise(fetchedUser.account_status)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Last Login</span>
                            <span className="info-value">{formatSimpleDate(fetchedUser.last_login)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Auto Renew Date</span>
                            <span className="info-value">{formatSimpleDate(fetchedUser.renewal_date)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Payment Method</span>
                            <span className="info-value">{fetchedUser.payment_method}</span>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
};

export default Profile;
