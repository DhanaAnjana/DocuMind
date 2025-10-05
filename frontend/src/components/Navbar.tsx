// src/components/Navbar.tsx
import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Search, LogOut } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import Notifications from './Notifications';

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const { currentTheme } = useTheme();
  const isDarkMode = currentTheme.id === 'dark';
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className={`shadow-soft border-b border-border sticky top-0 z-50 ${
      isDarkMode ? 'bg-surface' : 'bg-white'
    }`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-medium">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth="2.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary tracking-tight">DocIntel</h1>
              <p className={`text-xs ${isDarkMode ? 'text-text-muted' : 'text-text-muted'}`}>
                Document Intelligence
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                isDarkMode 
                  ? 'text-text-muted group-focus-within:text-primary' 
                  : 'text-text-muted group-focus-within:text-primary'
              }`} />
              <input
                type="text"
                placeholder="Search documents..."
                className={`w-full pl-12 pr-4 py-3 border border-transparent rounded-xl text-sm 
                         focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 
                         transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-surface-muted/30 text-white placeholder:text-text-muted focus:bg-surface-muted'
                    : 'bg-surface-muted/30 text-text-primary placeholder:text-text-muted focus:bg-white'
                }`}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Theme Selector */}
            <ThemeSelector />

            {/* Notifications */}
            <Notifications />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                  isDarkMode
                    ? 'hover:bg-surface-muted/50'
                    : 'hover:bg-surface-muted/50'
                }`}
              >
                <div className="text-right hidden sm:block">
                  <p className={`text-sm font-semibold transition-colors ${
                    isDarkMode
                      ? 'text-white group-hover:text-primary'
                      : 'text-text-primary group-hover:text-primary'
                  }`}>
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-text-muted">{user?.role || 'Member'}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-semibold text-sm shadow-medium group-hover:shadow-large transition-all duration-200">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-large border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${
                    isDarkMode
                      ? 'bg-surface border-surface-muted'
                      : 'bg-white border-border'
                  }`}>
                    <div className={`px-4 py-3 border-b ${
                      isDarkMode ? 'border-surface-muted' : 'border-border'
                    }`}>
                      <p className={`text-sm font-semibold ${
                        isDarkMode ? 'text-white' : 'text-text-primary'
                      }`}>{user?.name}</p>
                      <p className="text-xs text-text-muted">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;