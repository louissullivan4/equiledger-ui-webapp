import axios from 'axios';

const AuthService = {
    async login(email, password) {
        try {
            console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
            console.log(`${process.env.REACT_APP_BACKEND_URL}/users/dashboard-login`)
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/dashboard-login`, { email, password });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
                return { status_code: 200, message: 'Login successful' };
            } else {
                return { status_code: 401, message: 'Login failed' };
            }
        } catch (error) {
            return { status_code: 500, message: 'Login failed' };
        }
    }, 

    async signup(email, password, token) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/signup`, { email, password, token });
            if (response.status === 201) {
                return { status_code: 201, message: 'Signup successful' };
            } else {
                return { status_code: 500, message: 'Signup failed' };
            }
        } catch (error) {
            return { status_code: 500, message: 'Signup failed' };
        }
    },

    logout() {
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export default AuthService;