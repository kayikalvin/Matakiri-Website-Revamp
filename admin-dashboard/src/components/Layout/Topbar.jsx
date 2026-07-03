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
  MoonIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Topbar = ({ onMenuClick, sidebarCollapsed, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('admin-dashboard-dark-mode');
    return saved === 'true';
  });
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [recentContacts, setRecentContacts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activityTab, setActivityTab] = useState('contacts');

  const fetchRecentActivities = async () => {
    try {
      if (user?.role !== 'admin') {
        setRecentActivities([]);
        return;
      }
      const res = await api.get('/users', { params: { page: 1, limit: 6, sort: '-createdAt' } });
      const users = res?.data?.data ?? res?.data ?? [];
      const activities = Array.isArray(users)
        ? users.map(u => ({ type: 'user', message: `New user registered: ${u.name || u.email}`, time: u.createdAt }))
        : [];
      setRecentActivities(activities);
    } catch (err) {
      setRecentActivities([]);
    }
  };
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem('admin-dashboard-dark-mode', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchContactStats();
    } else {
      setNotificationCount(0);
    }
  }, [user]);

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
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const fetchContactStats = async () => {
    try {
      const res = await api.get('/contact/stats');
      const stats = res?.data?.data ?? res?.data ?? {};
      setNotificationCount(stats?.newContacts ?? 0);
    } catch (err) {
      setNotificationCount(0);
      console.error('Failed to fetch contact stats', err);
    }
  };

  const fetchRecentContacts = async () => {
    try {
      const res = await api.get('/contact/recent');
      const payload = res?.data?.data ?? res?.data ?? [];
      setRecentContacts(Array.isArray(payload) ? payload : payload.data || []);
    } catch (err) {
      console.error('Failed to fetch recent contacts', err);
      setRecentContacts([]);
    }
  };

  const clearNotifications = async () => {
    try {
      const idsToClear = recentContacts.filter(c => c.status === 'new').map(c => c._id || c.id);
      if (idsToClear.length === 0) {
        setNotificationCount(0);
        toast.success('No new notifications');
        return;
      }
      await api.put('/contact/bulk/update', { contactIds: idsToClear, status: 'read' });
      setNotificationCount(0);
      await fetchRecentContacts();
      toast.success('Notifications cleared');
    } catch (err) {
      console.error('Failed to clear notifications', err);
      toast.error('Failed to clear notifications');
    }
  };

  const bg = darkMode ? 'bg-soil-900' : 'bg-white';
  const borderClr = darkMode ? 'border-white/10' : 'border-border';
  const textMuted = darkMode ? 'text-parchment-100/50' : 'text-ink-500';
  const textMain = darkMode ? 'text-parchment-50' : 'text-ink-800';

  return (
    <div className={`sticky top-0 z-50 flex-shrink-0 flex h-16 ${bg} border-b ${borderClr} transition-colors duration-200`}>
      {/* Mobile menu button */}
      <button
        type="button"
        className={`px-4 border-r ${borderClr} ${textMuted} focus:outline-none focus:ring-1 focus:ring-inset focus:ring-laterite-500 md:hidden transition-colors`}
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Desktop collapse button */}
      <button
        type="button"
        className={`hidden md:flex items-center justify-center px-4 border-r ${borderClr} ${textMuted} hover:text-laterite-500 focus:outline-none transition-colors`}
        onClick={onToggleSidebar}
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? (
          <ChevronDoubleRightIcon className="h-4 w-4" />
        ) : (
          <ChevronDoubleLeftIcon className="h-4 w-4" />
        )}
      </button>

      <div className="flex-1 px-4 md:px-6 flex justify-between items-center">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className={`h-4 w-4 ${textMuted}`} aria-hidden="true" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border ${borderClr} ${darkMode ? 'bg-white/5 text-parchment-50 placeholder-parchment-100/40' : 'bg-parchment-50 text-ink-800 placeholder-ink-500/60'} focus:outline-none focus:ring-1 focus:ring-laterite-500 focus:border-laterite-500 text-sm font-mono transition-colors`}
                placeholder="Search projects, documents, users…"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className={`text-sm ${textMuted} hover:text-laterite-500`}>✕</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right side controls */}
        <div className="ml-4 flex items-center space-x-3 md:space-x-4">
          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className={`p-2 border ${borderClr} ${darkMode ? 'text-maize-400 hover:bg-white/5' : 'text-ink-500 hover:bg-parchment-100'} focus:outline-none transition-colors`}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              className={`p-2 border ${borderClr} ${textMuted} hover:text-laterite-500 focus:outline-none transition-colors relative`}
              onClick={async () => {
                const willOpen = !notificationsOpen;
                setNotificationsOpen(willOpen);
                if (willOpen) {
                  if (user?.role === 'admin') {
                    await fetchRecentContacts();
                  } else {
                    setRecentContacts([]);
                  }
                  await fetchRecentActivities();
                }
              }}
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-4 w-4" aria-hidden="true" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-laterite-500 text-parchment-50 text-[10px] font-mono flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-96 bg-white border border-border shadow-lg py-0 z-50">
                <div className="px-4 py-3 flex items-center justify-between border-b border-border">
                  <div className="flex gap-1">
                    <button
                      className={`px-3 py-1 text-xs font-mono uppercase tracking-wide ${activityTab === 'contacts' ? 'bg-laterite-50 text-laterite-600 border border-laterite-500/30' : 'text-ink-500 border border-transparent'}`}
                      onClick={() => setActivityTab('contacts')}
                    >Contacts</button>
                    <button
                      className={`px-3 py-1 text-xs font-mono uppercase tracking-wide ${activityTab === 'activity' ? 'bg-laterite-50 text-laterite-600 border border-laterite-500/30' : 'text-ink-500 border border-transparent'}`}
                      onClick={() => setActivityTab('activity')}
                    >Activity</button>
                  </div>
                  <button className="text-xs font-mono text-ink-500 hover:text-laterite-500" onClick={clearNotifications}>clear all</button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-border">
                  {activityTab === 'contacts' ? (
                    recentContacts.length === 0 ? (
                      <div className="px-4 py-4 text-sm text-ink-500">No contact notifications</div>
                    ) : (
                      recentContacts.map((c) => (
                        <div key={c._id || c.id} className="px-4 py-3 hover:bg-parchment-50">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-ink-800 truncate">{c.name}</div>
                              <div className="text-xs text-ink-500 truncate">{c.subject}</div>
                              <div className="text-[11px] font-mono text-ink-500/70 mt-1">{new Date(c.createdAt).toLocaleString()}</div>
                            </div>
                            <span className={`text-[10px] font-mono uppercase flex-shrink-0 ${c.status === 'new' ? 'text-laterite-600' : 'text-ink-500/60'}`}>{c.status}</span>
                          </div>
                        </div>
                      ))
                    )
                  ) : recentActivities.length === 0 ? (
                    <div className="px-4 py-4 text-sm text-ink-500">No recent activity</div>
                  ) : (
                    recentActivities.map((a, idx) => (
                      <div key={idx} className="px-4 py-3 hover:bg-parchment-50">
                        <div className="text-sm text-ink-800">{a.message}</div>
                        <div className="text-[11px] font-mono text-ink-500/70 mt-1">{a.time ? new Date(a.time).toLocaleString() : ''}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center max-w-xs focus:outline-none"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className={`text-sm font-medium ${textMain}`}>{user?.name || 'Admin User'}</p>
                  <p className={`text-[11px] font-mono ${textMuted} uppercase`}>{user?.role || 'Administrator'}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-laterite-500 flex items-center justify-center text-parchment-50 text-xs font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              </div>
            </button>

            {showDropdown && (
              <div className="origin-top-right absolute right-0 mt-2 w-60 bg-white border border-border shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-laterite-500 flex items-center justify-center text-parchment-50 font-semibold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-800 truncate">{user?.name || 'Admin User'}</p>
                      <p className="text-xs text-ink-500 truncate">{user?.email || 'admin@matakiritrust.org'}</p>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-ink-800 hover:bg-parchment-50 transition-colors group"
                  >
                    <UserCircleIcon className="mr-3 h-4 w-4 text-ink-500 group-hover:text-laterite-500 transition-colors" />
                    My Profile
                  </button>
                  <button
                    onClick={() => { navigate('/settings'); setShowDropdown(false); }}
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-ink-800 hover:bg-parchment-50 transition-colors group"
                  >
                    <Cog6ToothIcon className="mr-3 h-4 w-4 text-ink-500 group-hover:text-laterite-500 transition-colors" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-border py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-laterite-600 hover:bg-laterite-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                    Logout
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