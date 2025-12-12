import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BellIcon, 
  CalendarIcon, 
  ArrowPathIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PhotoIcon,
  UserPlusIcon,
  ArrowUpTrayIcon,
  PencilIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { projectsAPI, partnersAPI, usersAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [projPage, setProjPage] = useState(0);
  const [partnersPage, setPartnersPage] = useState(0);
  const [usersPage, setUsersPage] = useState(0);
  const pageSize = 5;
  const [selectedRange, setSelectedRange] = useState('30'); // days or 'ytd' or 'custom'

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Update current time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const performanceData = {
    score: 94,
    users: 1247,
    revenue: 42800,
    pending: 3,
    projects: 18,
    partners: 47,
    news: 24
  };

  useEffect(() => {
    let mounted = true;
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      try {
        // compute date range params
        const params = {};
        if (selectedRange && selectedRange !== 'all') {
          const end = new Date();
          let start = new Date();
          if (selectedRange === '7') start.setDate(end.getDate() - 7);
          else if (selectedRange === '30') start.setDate(end.getDate() - 30);
          else if (selectedRange === '90') start.setDate(end.getDate() - 90);
          else if (selectedRange === 'ytd') start = new Date(new Date().getFullYear(), 0, 1);
          else start = null;
          if (start) {
            params.startDate = start.toISOString();
            params.endDate = end.toISOString();
          }
        }

        const [projRes, partnersRes, usersRes] = await Promise.all([
          projectsAPI.getStats(params),
          partnersAPI.getStats(params),
          usersAPI.getStats(params)
        ]);

        if (!mounted) return;

        const projData = projRes?.data?.data ?? projRes?.data ?? null;
        const partnersData = partnersRes?.data?.data ?? partnersRes?.data ?? null;
        const usersData = usersRes?.data?.data ?? usersRes?.data ?? null;

        setAnalytics({ projects: projData, partners: partnersData, users: usersData });
      } catch (err) {
        if (!mounted) return;
        setAnalyticsError(err.response?.data?.message || err.message || 'Failed to load analytics');
      } finally {
        if (mounted) setAnalyticsLoading(false);
      }
    };

    if (activeTab === 'analytics') fetchAnalytics();
    return () => { mounted = false; };
  }, [activeTab]);

  const exportAnalyticsCSV = () => {
    if (!analytics) return;
    const rows = [];
    rows.push(['Projects Summary']);
    rows.push(['Total Projects', analytics.projects?.totalProjects ?? '']);
    rows.push([]);
    rows.push(['Category','Count']);
    (analytics.projects?.categoryDistribution || []).forEach(c => rows.push([c._id || 'Unknown', c.count]));
    rows.push([]);
    rows.push(['Partners Summary']);
    rows.push(['Total Partners', analytics.partners?.totalPartners ?? '']);
    rows.push([]);
    rows.push(['Partnership Level','Count']);
    (analytics.partners?.partnershipLevelDistribution || []).forEach(p => rows.push([p._id || 'Unknown', p.count]));
    rows.push([]);
    rows.push(['Users Summary']);
    rows.push(['Total Users', analytics.users?.totalUsers ?? '']);
    rows.push([]);
    rows.push(['Role','Count']);
    (analytics.users?.roleDistribution || []).forEach(r => rows.push([r._id || 'Unknown', r.count]));

    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn p-4 md:p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-20"></div>
                <div className="relative bg-white p-2 rounded-lg shadow-xs">
                  <SparklesIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-600">
                    {greeting}, <span className="font-semibold text-blue-600">{user?.name || 'Admin'}</span>
                  </p>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    Admin
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Here's what's happening with your organization today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Display */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <div className="text-sm">
                <div className="font-medium text-gray-900">{currentTime}</div>
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <BellIcon className="h-5 w-5 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-5 w-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData.users.toLocaleString()}</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-blue-500 opacity-80" />
            </div>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
              +12% this week
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${(performanceData.revenue / 1000).toFixed(1)}K</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-500 opacity-80" />
            </div>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
              +18% this month
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Performance</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData.score}%</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-amber-500 opacity-80" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-amber-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${performanceData.score}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Actions</p>
                <p className="text-2xl font-bold text-gray-900">{performanceData.pending}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500 opacity-80" />
            </div>
            <div className="mt-2 text-xs text-red-600">
              Requires attention
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto pb-1" aria-label="Dashboard Tabs">
          {['overview', 'analytics', 'performance', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-3 px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap
                ${activeTab === tab 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Dashboard Content (switch by tab) */}
      {activeTab === 'overview' ? (
        <>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
                  <p className="text-gray-500 text-sm">Key metrics and insights</p>
                </div>
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option>Last 30 days</option>
                <option>Last quarter</option>
                <option>Year to date</option>
              </select>
            </div>

            {/* DashboardStats Component */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Projects</p>
                    <p className="text-3xl font-bold text-gray-900">{performanceData.projects}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  <span>+5 from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Active Partners</p>
                    <p className="text-3xl font-bold text-gray-900">{performanceData.partners}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <UserGroupIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  <span>+3 new this quarter</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">News Articles</p>
                    <p className="text-3xl font-bold text-gray-900">{performanceData.news}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  <span>8 published this month</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border border-amber-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Media Library</p>
                    <p className="text-3xl font-bold text-gray-900">248</p>
                  </div>
                  <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <PhotoIcon className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  <span>+42 items added</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects Chart - Takes 2 columns on desktop */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6 h-full border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <ChartBarIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Project Analytics</h2>
                      <p className="text-gray-500 text-sm">Real-time project performance</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                    View details →
                  </button>
                </div>
                
                {/* ProjectsChart Component */}
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                  <div className="text-center">
                    <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Project chart visualization</p>
                    <p className="text-sm text-gray-400 mt-1">Interactive chart showing project progress</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-sm p-6 h-full text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg">
                    <RocketLaunchIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                    <p className="text-gray-300 text-sm">Frequently used tasks</p>
                  </div>
                </div>
                
                {/* QuickActions Component */}
                <div className="space-y-3">
                  <button className="flex items-center justify-between w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <PencilIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Create News</div>
                        <div className="text-sm text-gray-400">Write a new article</div>
                      </div>
                    </div>
                    <ArrowUpTrayIcon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                  </button>

                  <button className="flex items-center justify-between w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <UserPlusIcon className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Add User</div>
                        <div className="text-sm text-gray-400">Create new user account</div>
                      </div>
                    </div>
                    <ArrowUpTrayIcon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                  </button>

                  <button className="flex items-center justify-between w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <ArrowUpTrayIcon className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Upload Media</div>
                        <div className="text-sm text-gray-400">Add files to gallery</div>
                      </div>
                    </div>
                    <ArrowUpTrayIcon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                  </button>

                  <button className="flex items-center justify-between w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <EyeIcon className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">View Reports</div>
                        <div className="text-sm text-gray-400">System analytics</div>
                      </div>
                    </div>
                    <ArrowUpTrayIcon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : activeTab === 'analytics' ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
                  <p className="text-gray-500 text-sm">Project and user analytics</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)} className="px-3 py-1 border rounded text-sm">
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="ytd">Year to date</option>
                  <option value="all">All time</option>
                </select>
                <button onClick={() => exportAnalyticsCSV()} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Export CSV</button>
              </div>
          </div>

          {analyticsLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : analyticsError ? (
            <div className="text-red-500">{analyticsError}</div>
          ) : analytics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600">Projects</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.projects?.totalProjects ?? analytics.projects?.total ?? '—'}</p>
                <div className="mt-3 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={(analytics.projects?.categoryDistribution || []).map(d => ({ name: d._id || 'Unknown', count: d.count }))}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4F46E5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3">
                  <ul className="space-y-1 text-sm text-gray-700">
                    {((analytics.projects?.categoryDistribution || []).slice(projPage * pageSize, (projPage + 1) * pageSize)).map((d, i) => (
                      <li key={i} className="flex justify-between"><span>{d._id || 'Unknown'}</span><span className="font-medium">{d.count}</span></li>
                    ))}
                  </ul>
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <button disabled={projPage === 0} onClick={() => setProjPage(p => Math.max(0, p - 1))} className="px-2 py-1 text-xs bg-gray-100 rounded disabled:opacity-50">Prev</button>
                    <button disabled={(projPage + 1) * pageSize >= (analytics.projects?.categoryDistribution || []).length} onClick={() => setProjPage(p => p + 1)} className="px-2 py-1 text-xs bg-gray-100 rounded disabled:opacity-50">Next</button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100">
                <p className="text-sm text-gray-600">Partners</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.partners?.totalPartners ?? analytics.partners?.total ?? '—'}</p>
                <div className="mt-3 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={(analytics.partners?.partnershipLevelDistribution || []).map(d => ({ name: d._id || 'Unknown', count: d.count }))}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#059669" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3">
                  <ul className="space-y-1 text-sm text-gray-700">
                    {((analytics.partners?.partnershipLevelDistribution || []).slice(partnersPage * pageSize, (partnersPage + 1) * pageSize)).map((d, i) => (
                      <li key={i} className="flex justify-between"><span>{d._id || 'Unknown'}</span><span className="font-medium">{d.count}</span></li>
                    ))}
                  </ul>
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <button disabled={partnersPage === 0} onClick={() => setPartnersPage(p => Math.max(0, p - 1))} className="px-2 py-1 text-xs bg-gray-100 rounded disabled:opacity-50">Prev</button>
                    <button disabled={(partnersPage + 1) * pageSize >= (analytics.partners?.partnershipLevelDistribution || []).length} onClick={() => setPartnersPage(p => p + 1)} className="px-2 py-1 text-xs bg-gray-100 rounded disabled:opacity-50">Next</button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-100">
                <p className="text-sm text-gray-600">Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.users?.totalUsers ?? '—'}</p>
                <div className="mt-3 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip />
                      <Legend />
                      <Pie data={(analytics.users?.roleDistribution || []).map(d => ({ name: d._id || 'Unknown', value: d.count }))} dataKey="value" nameKey="name" outerRadius={80} fill="#8B5CF6" label />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3">
                  <ul className="space-y-1 text-sm text-gray-700">
                    {((analytics.users?.roleDistribution || []).slice(usersPage * pageSize, (usersPage + 1) * pageSize)).map((d, i) => (
                      <li key={i} className="flex justify-between"><span>{d._id || 'Unknown'}</span><span className="font-medium">{d.count}</span></li>
                    ))}
                  </ul>
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <button disabled={usersPage === 0} onClick={() => setUsersPage(p => Math.max(0, p - 1))} className="px-2 py-1 text-xs bg-gray-100 rounded disabled:opacity-50">Prev</button>
                    <button disabled={(usersPage + 1) * pageSize >= (analytics.users?.roleDistribution || []).length} onClick={() => setUsersPage(p => p + 1)} className="px-2 py-1 text-xs bg-gray-100 rounded disabled:opacity-50">Next</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-500">No analytics data</div>
          )}
        </div>
      ) : activeTab === 'performance' ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-lg border border-amber-100">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.score}%</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${performanceData.revenue.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100">
              <p className="text-sm text-gray-600">Users</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.users.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-100">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.pending}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Reports</h2>
          <p className="text-gray-500 mb-4">Generate or view system reports.</p>
          <ul className="space-y-2">
            <li className="p-3 border rounded-md">Monthly performance report <span className="text-xs text-gray-400">(PDF)</span></li>
            <li className="p-3 border rounded-md">User activity export <span className="text-xs text-gray-400">(CSV)</span></li>
            <li className="p-3 border rounded-md">Project completion report <span className="text-xs text-gray-400">(PDF)</span></li>
          </ul>
        </div>
      )}

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
              <p className="text-gray-500 text-sm">Latest updates and notifications</p>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
            View all activities →
          </button>
        </div>
        
        {/* RecentActivities Component */}
        <div className="space-y-4">
          {[
            { 
              user: 'Jane Cooper', 
              action: 'created a new project', 
              time: '5 minutes ago',
              type: 'project',
              icon: DocumentTextIcon,
              color: 'text-blue-600',
              bgColor: 'bg-blue-50'
            },
            { 
              user: 'John Doe', 
              action: 'uploaded media files', 
              time: '1 hour ago',
              type: 'media',
              icon: PhotoIcon,
              color: 'text-purple-600',
              bgColor: 'bg-purple-50'
            },
            { 
              user: 'Sarah Wilson', 
              action: 'published a news article', 
              time: '2 hours ago',
              type: 'news',
              icon: DocumentTextIcon,
              color: 'text-green-600',
              bgColor: 'bg-green-50'
            },
            { 
              user: 'Michael Chen', 
              action: 'updated partner information', 
              time: '3 hours ago',
              type: 'partner',
              icon: UserGroupIcon,
              color: 'text-indigo-600',
              bgColor: 'bg-indigo-50'
            },
            { 
              user: 'Admin', 
              action: 'added a new user', 
              time: '5 hours ago',
              type: 'user',
              icon: UserPlusIcon,
              color: 'text-amber-600',
              bgColor: 'bg-amber-50'
            }
          ].map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className={`p-2 ${activity.bgColor} rounded-lg`}>
                  <Icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.user}</div>
                  <div className="text-sm text-gray-600">{activity.action}</div>
                </div>
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {activity.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Status Footer */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium text-gray-900">All systems operational</p>
              <p className="text-sm text-gray-500">Last updated just now</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>Server uptime: 99.9%</span>
            <span>•</span>
            <span>Response time: 124ms</span>
            <span>•</span>
            <span>Active sessions: 247</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;