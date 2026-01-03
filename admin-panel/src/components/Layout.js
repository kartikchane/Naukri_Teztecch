
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4">
            {/* Hamburger menu for mobile */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none active:bg-gray-200 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <FaBars className="text-lg text-gray-700" />
            </button>
            
            {/* Logo/Brand for mobile */}
            <div className="flex items-center md:hidden">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-base font-bold text-gray-800">Admin</span>
            </div>
            
            {/* Page Title for desktop */}
            <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
              Admin Dashboard
            </h1>
            
            {/* Right side - User info */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800 truncate max-w-[120px]">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm md:text-base shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-3 md:p-6 overflow-auto bg-gray-50">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-3 md:py-4 px-4 md:px-6">
          <div className="text-center text-xs md:text-sm text-gray-600">
            © 2026 Naukri Platform. Admin Panel.
            <span className="hidden sm:inline"> All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
