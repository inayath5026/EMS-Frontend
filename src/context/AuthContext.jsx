import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/auth/current-user', {
        withCredentials: true
      });
      
      if (data.isAuthenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
      return data;
    } catch (error) {
      setUser(null);
      return { isAuthenticated: false, user: null };
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    checkAuth();
  }, []);

  // Initiate Google login
  const login = () => {
    window.location.href = 'http://localhost:8080/auth/google';
  };

  // Handle logout
  const logout = async () => {
    try {
      await axios.get('http://localhost:8080/auth/logout', {
        withCredentials: true
      });
      setUser(null);
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
      return false;
    }
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create the custom hook
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 4. Single export statement with all components
export { AuthProvider, useAuth };