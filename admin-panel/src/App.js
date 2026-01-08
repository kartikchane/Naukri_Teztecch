import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import Companies from './pages/Companies';
import Settings from './pages/Settings';

function App() {
  // Token validation only - Don't clear on every load
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    // Only validate token format if it exists
    if (token) {
      const parts = token.split('.');
      // If invalid JWT format, clear it
      if (parts.length !== 3) {
        console.log('Invalid token format, clearing...');
        localStorage.clear();
      }
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="companies" element={<Companies />} />
            <Route path="settings" element={<Settings />} />
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
