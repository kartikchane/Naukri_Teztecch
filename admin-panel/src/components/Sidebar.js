
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaTachometerAlt, FaBriefcase, FaUser, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="inline mr-2" /> },
  { to: '/jobs', label: 'Jobs', icon: <FaBriefcase className="inline mr-2" /> },
  { to: '/applications', label: 'Applications', icon: <FaClipboardList className="inline mr-2" /> },
  { to: '/users', label: 'Users', icon: <FaUser className="inline mr-2" /> },
];

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const linkClass = (path) =>
    `flex items-center px-4 py-2 rounded mb-2 transition-colors duration-150 ${location.pathname === path ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 text-gray-800'}`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Sidebar content
  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header with Logo */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        {/* Close button for mobile */}
        <button
          className="md:hidden text-2xl p-2 focus:outline-none text-gray-600 hover:text-gray-800"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
      </div>

      {/* User Info */}
      <div className="mb-6 p-3 md:p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-lg shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full shadow-sm">
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={linkClass(link.to)}
            onClick={() => setMobileOpen(false)}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 rounded text-red-600 hover:bg-red-50 transition-colors duration-150"
        >
          <FaSignOutAlt className="inline mr-2" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-300 md:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-72 md:w-64 bg-white shadow-2xl md:shadow-lg transform transition-transform duration-300 md:static md:translate-x-0 h-full p-4 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ minWidth: '256px' }}
        aria-label="Sidebar"
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default AdminSidebar;
