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
    const adminUser = localStorage.getItem('adminUser');
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminUser && adminToken) {
      try {
        setUser(JSON.parse(adminUser));
      } catch (error) {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
      }
    }
    setLoading(false);
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
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
