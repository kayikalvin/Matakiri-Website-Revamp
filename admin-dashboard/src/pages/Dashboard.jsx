// import { useAuth } from '../context/AuthContext';

// import DashboardStats from '../components/Dashboard/DashboardStats';
// import ProjectsChart from '../components/Dashboard/ProjectsChart';
// import QuickActions from '../components/Dashboard/QuickActions';
// import RecentActivities from '../components/Dashboard/RecentActivities';




// const Dashboard = () => {
//   const { user } = useAuth();

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
//         <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'Admin'}!</p>
//       </div>

//       <div className="mb-8">
//         <DashboardStats />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//         <ProjectsChart />
//         <QuickActions />
//       </div>

//       <RecentActivities />
//     </div>
//   );
// };

// export default Dashboard;




import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardStats from '../components/Dashboard/DashboardStats';
import ProjectsChart from '../components/Dashboard/ProjectsChart';
import QuickActions from '../components/Dashboard/QuickActions';
import RecentActivities from '../components/Dashboard/RecentActivities';
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
  SunIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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
    pending: 3
  };

  return (
    <div className="space-y-6 animate-fadeIn">
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
              <ArrowPathIcon className="h-3 w-3 mr-1" />
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
              <ArrowPathIcon className="h-3 w-3 mr-1" />
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
        <nav className="flex space-x-8" aria-label="Dashboard Tabs">
          {['overview', 'analytics', 'performance', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-3 px-1 border-b-2 text-sm font-medium transition-colors
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

      {/* Main Dashboard Stats */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
              <p className="text-gray-500 text-sm">Key metrics and insights</p>
            </div>
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Last 30 days</option>
            <option>Last quarter</option>
            <option>Year to date</option>
          </select>
        </div>
        <DashboardStats />
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Chart - Takes 2 columns on desktop */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-full border border-gray-200">
            <div className="flex items-center justify-between mb-6">
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
            <ProjectsChart />
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
            <QuickActions />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
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
        <RecentActivities />
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
          <div className="flex items-center gap-4 text-sm text-gray-500">
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