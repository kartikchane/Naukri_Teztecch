
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaTachometerAlt, FaBriefcase, FaUser, FaClipboardList } from 'react-icons/fa';

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="inline mr-2" /> },
  { to: '/admin/jobs', label: 'Jobs', icon: <FaBriefcase className="inline mr-2" /> },
  { to: '/admin/applications', label: 'Applications', icon: <FaClipboardList className="inline mr-2" /> },
  { to: '/admin/users', label: 'Users', icon: <FaUser className="inline mr-2" /> },
];

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const linkClass = (path) =>
    `flex items-center px-4 py-2 rounded mb-2 transition-colors duration-150 ${location.pathname === path ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 text-gray-800'}`;

  // Sidebar content
  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight gradient-text">Admin Panel</h2>
        {/* Close button for mobile */}
        <button
          className="md:hidden text-2xl p-2 focus:outline-none"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
      </div>
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
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 md:static md:translate-x-0 md:w-60 md:shadow h-full p-4 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ minWidth: '200px' }}
        aria-label="Sidebar"
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default AdminSidebar;
