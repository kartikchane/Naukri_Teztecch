import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';
import SavedJobs from './pages/SavedJobs';
import Profile from './pages/Profile';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import PostJob from './pages/PostJob';
import CreateCompany from './pages/CreateCompany';

// Footer Pages
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Founder from './pages/Founder';
import FAQ from './pages/FAQ';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Careers from './pages/Careers';
import Pricing from './pages/Pricing';
import EmployerResources from './pages/EmployerResources';
import RecruitmentSolutions from './pages/RecruitmentSolutions';
import Blog from './pages/Blog';

// Admin Panel Imports
import AdminLayout from './pages/admin/Layout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminJobs from './pages/admin/Jobs';
import AdminApplications from './pages/admin/Applications';

import AdminUsers from './pages/admin/Users';
import EmployerJobs from './pages/EmployerJobs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/companies/:id" element={<CompanyDetails />} />
              
              {/* Footer Pages */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/founder" element={<Founder />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/employer-resources" element={<EmployerResources />} />
              <Route path="/recruitment-solutions" element={<RecruitmentSolutions />} />
              
              {/* Protected Routes */}
              <Route
                path="/messages"
                element={
                  <PrivateRoute>
                    <Messages />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <PrivateRoute>
                    <MyApplications />
                  </PrivateRoute>
                }
              />
              <Route
                path="/saved-jobs"
                element={
                  <PrivateRoute>
                    <SavedJobs />
                  </PrivateRoute>
                }
              />
              <Route
                path="/post-job"
                element={
                  <PrivateRoute requiredRole="employer">
                    <PostJob />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-company"
                element={
                  <PrivateRoute requiredRole="employer">
                    <CreateCompany />
                  </PrivateRoute>
                }
              />

              <Route
                path="/my-jobs"
                element={
                  <PrivateRoute requiredRole="employer">
                    <EmployerJobs />
                  </PrivateRoute>
                }
              />
              
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                <Route
                  path="dashboard"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="jobs"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AdminJobs />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="applications"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AdminApplications />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="users"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AdminUsers />
                    </PrivateRoute>
                  }
                />
              </Route>
              
              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                    <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn-primary">Go Home</a>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
