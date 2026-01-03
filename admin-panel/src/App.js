import React from 'react';
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

function App() {
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
            <Route path="jobs" element={<div className="p-6"><h1 className="text-2xl font-bold">Jobs Management</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
            <Route path="applications" element={<div className="p-6"><h1 className="text-2xl font-bold">Applications</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
            <Route path="users" element={<div className="p-6"><h1 className="text-2xl font-bold">Users Management</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
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
