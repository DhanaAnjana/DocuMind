// components/Navbar.tsx
import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2c3e50' }}>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-6 h-6"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
              <path d="M12 8v8M8 12h8" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold docintel-title">DocIntel</h1>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search documents..."
            className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 custom-focus-ring"
            onFocus={(e) => e.target.style.borderColor = '#3498db'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'Member'}</p>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm text-white" style={{ backgroundColor: '#2c3e50' }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;