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
import JobDetails from './pages/JobDetails';
import Applications from './pages/Applications';
import Companies from './pages/Companies';
import Settings from './pages/Settings';
// Advanced Admin Features
import ContentModeration from './pages/ContentModeration';
import UserControl from './pages/UserControl';
import Analytics from './pages/Analytics';
import JobApprovalWorkflow from './pages/JobApprovalWorkflow';
import NotificationSystem from './pages/NotificationSystem';
import ReportExport from './pages/ReportExport';
import AuditLogs from './pages/AuditLogs';
import ApplicationBatchActions from './pages/ApplicationBatchActions';
import SupportTickets from './pages/SupportTickets';
import ReviewModeration from './pages/ReviewModeration';
import PerformanceMonitoring from './pages/PerformanceMonitoring';
import FeatureFlagsManagement from './pages/FeatureFlagsManagement';
import SystemSettings from './pages/SystemSettings';
import GalleryManagement from './pages/GalleryManagement';

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
            <Route path="jobs/:id" element={<JobDetails />} />
            <Route path="applications" element={<Applications />} />
            <Route path="companies" element={<Companies />} />
            <Route path="gallery/:companyId" element={<GalleryManagement />} />
            <Route path="settings" element={<Settings />} />
            {/* Advanced Admin Features */}
            <Route path="content-moderation" element={<ContentModeration />} />
            <Route path="user-control" element={<UserControl />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="job-approval" element={<JobApprovalWorkflow />} />
            <Route path="notifications" element={<NotificationSystem />} />
            <Route path="reports" element={<ReportExport />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="batch-actions" element={<ApplicationBatchActions />} />
            <Route path="support-tickets" element={<SupportTickets />} />
            <Route path="review-moderation" element={<ReviewModeration />} />
            <Route path="performance" element={<PerformanceMonitoring />} />
            <Route path="feature-flags" element={<FeatureFlagsManagement />} />
            <Route path="platform-settings" element={<SystemSettings />} />
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
