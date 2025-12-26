import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Error parsing stored user:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token, username, email: userEmail, role, _id, roleDocumentId } = response.data;

            const userData = { id: _id, username, email: userEmail, role, roleDocumentId };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await authAPI.signup(userData);
            const { token, username, email, role, _id, roleDocumentId } = response.data;

            const newUser = { id: _id, username, email, role, roleDocumentId };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(newUser));

            setUser(newUser);
            setIsAuthenticated(true);

            return { success: true, user: newUser };
        } catch (error) {
            // Handle validation errors array from express-validator
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                const validationErrors = error.response.data.errors.map(err => err.msg).join('. ');
                return {
                    success: false,
                    error: validationErrors
                };
            }

            // Handle single error message
            return {
                success: false,
                error: error.response?.data?.error || 'Signup failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;
