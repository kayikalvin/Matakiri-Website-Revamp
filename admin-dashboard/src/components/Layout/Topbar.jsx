import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  BellIcon, 
  ChevronDoubleLeftIcon, 
  ChevronDoubleRightIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Topbar = ({ onMenuClick, sidebarCollapsed, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/login');
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Searching for: ${searchQuery}`);
      // Implement search functionality here
    }
  };

  const clearNotifications = () => {
    setNotificationCount(0);
    toast.success('Notifications cleared');
  };

  return (
    <div className={`sticky top-0 z-50 flex-shrink-0 flex h-16 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg transition-colors duration-200`}>
      {/* Mobile menu button */}
      <button
        type="button"
        className={`px-4 border-r ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-500'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden transition-colors duration-200`}
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Desktop collapse button */}
      <button
        type="button"
        className={`hidden md:flex items-center justify-center px-4 border-r ${darkMode ? 'border-gray-700 text-gray-300 hover:text-white' : 'border-gray-200 text-gray-500 hover:text-gray-700'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200 hover:scale-105`}
        onClick={onToggleSidebar}
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <ChevronDoubleRightIcon className="h-5 w-5" />
        ) : (
          <ChevronDoubleLeftIcon className="h-5 w-5" />
        )}
      </button>

      <div className="flex-1 px-4 md:px-6 flex justify-between items-center">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} aria-hidden="true" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-400' : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-colors duration-200`}
                placeholder="Search for projects, documents, or users..."
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                    ✕
                  </span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right side controls */}
        <div className="ml-4 flex items-center space-x-4 md:space-x-6">
          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications with badge */}
          <div className="relative">
            <button
              type="button"
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 relative`}
              onClick={clearNotifications}
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-5 w-5" aria-hidden="true" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-xs text-white items-center justify-center">
                    {notificationCount}
                  </span>
                </span>
              )}
            </button>
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:scale-105"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user?.name || 'Admin User'}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user?.role || 'Administrator'}
                  </p>
                </div>
                <div className="relative">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ${darkMode ? 'ring-2 ring-gray-700' : 'ring-2 ring-white'}`}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 ${darkMode ? 'border-gray-900' : 'border-white'} bg-green-500`}></div>
                </div>
              </div>
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className={`origin-top-right absolute right-0 mt-3 w-64 rounded-xl shadow-xl py-2 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in-0 zoom-in-95`}>
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold`}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.name || 'Admin User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email || 'admin@matakiritrust.org'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Menu items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 group"
                  >
                    <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-150" />
                    <span>My Profile</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 group"
                  >
                    <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-150" />
                    <span>Settings</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-100 dark:border-gray-700"></div>
                
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 group"
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-150" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;