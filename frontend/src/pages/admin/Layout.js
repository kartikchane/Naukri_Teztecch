
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Hamburger menu for mobile */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow md:hidden focus:outline-none"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <FaBars className="text-2xl text-blue-700" />
      </button>
      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {/* Main content */}
      <main className="flex-1 p-4 md:ml-60 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
