import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('skillproof_token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.get('/auth/me')
                .then(res => {
                    setUser(res.data);
                })
                .catch(() => {
                    setToken(null);
                    localStorage.removeItem('skillproof_token');
                    localStorage.removeItem('skillproof_user');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('skillproof_token', jwtToken);
        localStorage.setItem('skillproof_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('skillproof_token');
        localStorage.removeItem('skillproof_user');
    };

    const updateUser = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
