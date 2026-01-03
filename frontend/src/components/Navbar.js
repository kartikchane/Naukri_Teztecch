import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBell, FaEnvelope, FaBriefcase, FaUser, FaSignOutAlt, FaChevronDown, FaBookmark, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import API from '../utils/api';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (isAuthenticated && user?.role === 'job_seeker') {
        try {
          const { data } = await API.get('/notifications?read=false&limit=1');
          setUnreadCount(data.unreadCount || 0);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      }
    };

    fetchUnreadCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch unread notifications count
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'employer') {
      fetchUnreadCount();
      // Set up polling for real-time updates
      const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await API.get('/notifications?read=false');
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      // Only log error, do not break UI
      setUnreadCount(0);
      // Optionally show a toast or silent fail
      // toast.error('Could not fetch notifications');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <img 
              src="/teztech-logo.svg" 
              alt="Teztech Logo" 
              className="h-12 w-12 rounded-full"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Teztecch</span>
              <span className="text-xs text-gray-600 -mt-1">Naukri Platform</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden lg:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, companies, or keywords..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Search
              </button>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Find Jobs
            </Link>
            {user?.role === 'employer' && (
              <Link to="/post-job" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Post Job
              </Link>
            )}
            <Link to="/companies" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Companies
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4 ml-4">
            {isAuthenticated ? (
              <>
                <Link to="/messages" className="hidden md:block text-gray-600 hover:text-primary transition-colors p-2">
                  <FaEnvelope size={20} />
                </Link>
                <Link to="/notifications" className="hidden md:block text-gray-600 hover:text-primary transition-colors p-2 relative">
                  <FaBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
                <div className="hidden md:block relative ml-2" ref={dropdownRef}>
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors focus:outline-none"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold shadow-md">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-semibold">{user?.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                    </div>
                    <FaChevronDown 
                      className={`text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                      size={14} 
                    />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div 
                    className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 transition-all duration-200 origin-top-right ${
                      dropdownOpen 
                        ? 'opacity-100 scale-100 visible' 
                        : 'opacity-0 scale-95 invisible'
                    }`}
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      to="/profile"
                      onClick={closeDropdown}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors"
                    >
                      <FaUser className="mr-3 text-gray-400" /> 
                      <span className="font-medium">Profile</span>
                    </Link>
                    
                    {user?.role === 'jobseeker' && (
                      <>
                        <Link
                          to="/applications"
                          onClick={closeDropdown}
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors"
                        >
                          <FaBriefcase className="mr-3 text-gray-400" /> 
                          <span className="font-medium">My Applications</span>
                        </Link>
                        <Link
                          to="/saved-jobs"
                          onClick={closeDropdown}
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors"
                        >
                          <FaBookmark className="mr-3 text-gray-400" /> 
                          <span className="font-medium">Saved Jobs</span>
                        </Link>
                      </>
                    )}
                    
                    {user?.role === 'employer' && (
                      <Link
                        to="/my-jobs"
                        onClick={closeDropdown}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors"
                      >
                        <FaBriefcase className="mr-3 text-gray-400" /> 
                        <span className="font-medium">My Jobs</span>
                      </Link>
                    )}

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={closeDropdown}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors"
                      >
                        <FaBriefcase className="mr-3 text-gray-400" /> 
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-2"></div>
                    
                    <button
                      onClick={() => {
                        logout();
                        closeDropdown();
                      }}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt className="mr-3" /> 
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden md:block text-gray-700 hover:text-primary font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="hidden md:block btn-primary">
                  Sign Up
                </Link>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-primary transition-colors p-2"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="py-4 space-y-3 border-t border-gray-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative px-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </form>

            {/* Mobile Navigation Links */}
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
            >
              Find Jobs
            </Link>
            <Link
              to="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
            >
              Companies
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'employer' && (
                  <Link
                    to="/post-job"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                  >
                    Post Job
                  </Link>
                )}
                <Link
                  to="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                >
                  <FaEnvelope className="inline mr-2" /> Messages
                </Link>
                <Link
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors relative"
                >
                  <FaBell className="inline mr-2" /> Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                >
                  <FaUser className="inline mr-2" /> Profile
                </Link>
                {user?.role === 'jobseeker' && (
                  <>
                    <Link
                      to="/applications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                    >
                      <FaBriefcase className="inline mr-2" /> My Applications
                    </Link>
                    <Link
                      to="/saved-jobs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                    >
                      <FaBookmark className="inline mr-2" /> Saved Jobs
                    </Link>
                  </>
                )}
                {user?.role === 'employer' && (
                  <Link
                    to="/my-jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                  >
                    <FaBriefcase className="inline mr-2" /> My Jobs
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block mx-4 py-2 text-center bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
