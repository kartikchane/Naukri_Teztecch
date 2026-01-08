import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

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

  useEffect(() => {
    const validateAndLoadUser = () => {
      const adminUser = localStorage.getItem('adminUser');
      const adminToken = localStorage.getItem('adminToken');
      
      if (adminUser && adminToken) {
        try {
          // Validate JWT format
          const tokenParts = adminToken.split('.');
          if (tokenParts.length !== 3) {
            console.log('Invalid token format, clearing...');
            localStorage.removeItem('adminUser');
            localStorage.removeItem('adminToken');
            setLoading(false);
            return;
          }
          setUser(JSON.parse(adminUser));
        } catch (error) {
          console.log('Error parsing user data, clearing...');
          localStorage.removeItem('adminUser');
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };
    
    validateAndLoadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/admin-login', { email, password });
      
      if (data.role !== 'admin') {
        return { success: false, message: 'Access denied. Admin only.' };
      }
      
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data));
      setUser(data);
      
      return { success: true, user: data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    window.location.href = '/login';
  };

  const forceLogout = () => {
    console.log('Force logout triggered');
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, forceLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
