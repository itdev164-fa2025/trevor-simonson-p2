import * as React from 'react'
import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios'

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = async (email, password) => {
        const response = await axios.post('http://localhost:5000/api/login', { email, password });
        localStorage.setItem('token', response.data.token);
        setUser({ email });
    };

    const register = async (name, email, password) => {
        await axios.post('http://localhost:5000/api/register', { name, email, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const verifyToken = async () => {
        const token = localStorage.getItem('token');
        if (token) {
        try {
            const response = await axios.get('http://localhost:5000/api/protected', {
            headers: { Authorization: `Bearer ${token}` },
            });
            setUser({ id: response.data.userId });
        } catch {
            logout();
        }
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;