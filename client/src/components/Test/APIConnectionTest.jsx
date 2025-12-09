import React, { useState } from 'react';
import { 
  useProjects, 
  useNews, 
  usePartners,
  useFeaturedProjects,
  useLatestNews
} from '../../hooks/useAPI';
import { useAuth } from '../../context/AuthContext';

const APIConnectionTest = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [loginEmail, setLoginEmail] = useState('admin@matakiritrust.org');
  const [loginPassword, setLoginPassword] = useState('password123');
  
  const { login, logout, isAuthenticated, user } = useAuth();
  
  // API hooks
  const { data: projects, loading: projectsLoading, error: projectsError } = useProjects({ immediate: true });
  const { data: news, loading: newsLoading, error: newsError } = useNews({ immediate: true });
  const { data: partners, loading: partnersLoading, error: partnersError } = usePartners({ immediate: true });
  const { data: featuredProjects } = useFeaturedProjects({ immediate: true });
  const { data: latestNews } = useLatestNews({ immediate: true });

  const handleLogin = async () => {
    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      alert('Login successful!');
    } else {
      alert(`Login failed: ${result.message}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Projects {projectsLoading ? '(Loading...)' : `(${projects?.length || 0})`}
            </h3>
            {projectsError && <div className="text-red-600 p-3 bg-red-50 rounded mb-4">{projectsError}</div>}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {projects?.map(project => (
                <div key={project._id} className="p-3 border rounded hover:bg-gray-50">
                  <h4 className="font-medium">{project.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{project.category}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">{project.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'news':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              News {newsLoading ? '(Loading...)' : `(${news?.length || 0})`}
            </h3>
            {newsError && <div className="text-red-600 p-3 bg-red-50 rounded mb-4">{newsError}</div>}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {news?.map(article => (
                <div key={article._id} className="p-3 border rounded hover:bg-gray-50">
                  <h4 className="font-medium">{article.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">{article.category}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{article.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'partners':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Partners {partnersLoading ? '(Loading...)' : `(${partners?.length || 0})`}
            </h3>
            {partnersError && <div className="text-red-600 p-3 bg-red-50 rounded mb-4">{partnersError}</div>}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {partners?.map(partner => (
                <div key={partner._id} className="p-3 border rounded hover:bg-gray-50">
                  <h4 className="font-medium">{partner.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">{partner.partnershipLevel}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">{partner.category}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{partner.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'auth':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Authentication Test</h3>
            {isAuthenticated ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h4 className="font-medium text-green-800">✓ Authenticated</h4>
                <div className="mt-2 text-sm">
                  <p><span className="font-medium">User:</span> {user?.name}</p>
                  <p><span className="font-medium">Email:</span> {user?.email}</p>
                  <p><span className="font-medium">Role:</span> {user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                <h4 className="font-medium text-gray-800 mb-4">Login Test</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="admin@matakiritrust.org"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="password123"
                    />
                  </div>
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Test Login
                  </button>
                  <div className="text-sm text-gray-600 mt-2">
                    <p>Test credentials:</p>
                    <p>Email: admin@matakiritrust.org</p>
                    <p>Password: password123</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Backend API Connection Test</h2>
      <p className="text-gray-600 mb-6">Testing connection to your Node.js backend</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stats Panel */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">API Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Backend URL:</span>
                <span className="text-sm bg-blue-100 px-2 py-1 rounded">{process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}</span>
              </div>
              <div className={`flex items-center justify-between ${projectsError ? 'text-red-600' : 'text-green-600'}`}>
                <span>Projects API:</span>
                <span>{projectsError ? '❌ Error' : '✅ Working'}</span>
              </div>
              <div className={`flex items-center justify-between ${newsError ? 'text-red-600' : 'text-green-600'}`}>
                <span>News API:</span>
                <span>{newsError ? '❌ Error' : '✅ Working'}</span>
              </div>
              <div className={`flex items-center justify-between ${partnersError ? 'text-red-600' : 'text-green-600'}`}>
                <span>Partners API:</span>
                <span>{partnersError ? '❌ Error' : '✅ Working'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Total Projects:</span>
                <span className="font-medium">{projects?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total News:</span>
                <span className="font-medium">{news?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Partners:</span>
                <span className="font-medium">{partners?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Featured Projects:</span>
                <span className="font-medium">{featuredProjects?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Latest News:</span>
                <span className="font-medium">{latestNews?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow">
            {/* Tabs */}
            <div className="flex border-b">
              {['projects', 'news', 'partners', 'auth'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium capitalize ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Content */}
            <div className="p-6">
              {renderContent()}
            </div>
          </div>
          
          {/* Debug Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
            <h4 className="font-medium mb-2">Debug Information:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Projects Loading:</span> {projectsLoading ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">Projects Error:</span> {projectsError || 'None'}</p>
                <p><span className="font-medium">Projects Data Structure:</span> {projects ? typeof projects : 'null'}</p>
              </div>
              <div>
                <p><span className="font-medium">Authentication:</span> {isAuthenticated ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">Token:</span> {localStorage.getItem('token') ? 'Present' : 'Not present'}</p>
                <p><span className="font-medium">User Data:</span> {user ? 'Present' : 'Not present'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIConnectionTest;