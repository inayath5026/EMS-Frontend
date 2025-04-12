import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/api/current-user', {
        withCredentials: true
      });
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.open(
      'http://localhost:8080/auth/google',
      'Google Login',
      'width=500,height=600'
    );

    const checkAuthInterval = setInterval(() => {
      checkAuth().then(() => {
        if (user) clearInterval(checkAuthInterval);
      });
    }, 1000);
  };

  const logout = async () => {
    await axios.get('http://localhost:8080/logout', { withCredentials: true });
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);