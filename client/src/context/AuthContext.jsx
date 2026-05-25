import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // ടോക്കൺ ഉണ്ടെങ്കിൽ യൂസർ പ്രൊഫൈൽ ബാക്ക്-എൻഡിൽ നിന്ന് എടുക്കാം (വേണമെങ്കിൽ)
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        if (res.data.success) {
            setToken(res.data.token);
            setUser({ email }); // ബേസിക് യൂസർ ഡാറ്റ സെറ്റ് ചെയ്യുന്നു
            return true;
        }
        return false;
    };

    const logout = () => {
        setToken('');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};