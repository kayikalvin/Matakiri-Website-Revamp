
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { projectsAPI } from '../../services/api';
// import { Toaster, toast } from 'react-hot-toast';

// const Projects = () => {

//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deletingId, setDeletingId] = useState(null);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await projectsAPI.getAll();
//         // API returns an object { success, data: [...] , pagination, ... }
//         // Accept either shape: res.data.data (preferred) or res.data (legacy)
//         const payload = res.data && res.data.data ? res.data.data : res.data;
//         setProjects(Array.isArray(payload) ? payload : []);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to load projects.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this project?')) return;
//     setDeletingId(id);
//     try {
//       await projectsAPI.delete(id);
//       setProjects(projects => projects.filter(p => p._id !== id && p.id !== id));
//       toast.success('Project deleted successfully!');
//     } catch (err) {
//       toast.error('Failed to delete project.');
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'ongoing': return 'bg-green-100 text-green-800';
//       case 'completed': return 'bg-primary-100 text-primary-600';
//       case 'planned': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="p-6">
//       <Toaster />
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
//           <p className="text-gray-600 mt-2">Manage community development projects</p>
//         </div>
//         <Link
//           to="/projects/create"
//           className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
//         >
//           Create Project
//         </Link>
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//         </div>
//       ) : error ? (
//         <div className="max-w-xl mx-auto bg-white rounded shadow p-6">
//           <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
//           <p className="text-gray-700 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
//           >
//             Retry
//           </button>
//         </div>
//       ) : (
//         <>
//           {/* Projects Table */}
//           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Project Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Category
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Start Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Budget
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {projects.map((project) => (
//                   <tr key={project._id || project.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10">
//                           <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
//                             <span className="text-primary-600 font-bold">{(project.title || project.name || '').charAt(0)}</span>
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{project.title || project.name}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
//                         {project.status ? project.status.toUpperCase() : ''}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {project.category}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {project.startDate ? project.startDate.slice(0, 10) : ''}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       KSH {project.budget ? Number(project.budget).toLocaleString() : ''}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <Link
//                         to={`/projects/edit/${project._id || project.id}`}
//                         className="text-primary-500 hover:text-primary-700 mr-3"
//                       >
//                         Edit
//                       </Link>
//                       <button
//                         className="text-red-600 hover:text-red-900"
//                         onClick={() => handleDelete(project._id || project.id)}
//                         disabled={deletingId === (project._id || project.id)}
//                       >
//                         {deletingId === (project._id || project.id) ? 'Deleting...' : 'Delete'}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Empty State */}
//             {projects.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="text-6xl mb-4">🏗️</div>
//                 <h3 className="text-xl font-medium text-gray-900 mb-2">No projects yet</h3>
//                 <p className="text-gray-600">Create your first project to get started</p>
//               </div>
//             )}
//           </div>

//           {/* Stats Summary */}
//           <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-white p-6 rounded-lg shadow">
//               <h3 className="text-lg font-semibold text-gray-800">Total Projects</h3>
//               <p className="text-3xl font-bold text-primary-600 mt-2">{projects.length}</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow">
//               <h3 className="text-lg font-semibold text-gray-800">Active Projects</h3>
//               <p className="text-3xl font-bold text-green-600 mt-2">
//                 {projects.filter(p => p.status === 'ongoing').length}
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow">
//               <h3 className="text-lg font-semibold text-gray-800">Total Budget</h3>
//               <p className="text-3xl font-bold text-purple-600 mt-2">
//                 KSH {projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Projects;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../../services/api';
import { Toaster, toast } from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    planning: 0,
    active: 0,
    completed: 0,
    paused: 0,
    totalBudget: 0
  });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Calculate stats whenever projects change
    if (projects.length > 0) {
      const total = projects.length;
      const planning = projects.filter(p => p.status === 'planning').length;
      const active = projects.filter(p => p.status === 'active').length;
      const completed = projects.filter(p => p.status === 'completed').length;
      const paused = projects.filter(p => p.status === 'paused').length;
      const totalBudget = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
      setStats({
        total,
        planning,
        active,
        completed,
        paused,
        totalBudget
      });
    }
  }, [projects]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectsAPI.getAll();
      const payload = res.data && res.data.data ? res.data.data : res.data;
      setProjects(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects.');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await projectsAPI.delete(id);
      setProjects(projects => projects.filter(p => p._id !== id && p.id !== id));
      toast.success('Project deleted successfully!', {
        icon: '🗑️',
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
    } catch (err) {
      toast.error('Failed to delete project.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused': return 'bg-gray-200 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'planning': return '📅';
      case 'active': return '🟢';
      case 'completed': return '✅';
      case 'paused': return '⏸️';
      default: return '⚪';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      (project.title || project.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openGallery = (images = [], index = 0) => {
    if (!images || images.length === 0) return;
    // normalize images array to have url strings
    const urls = images.map(img => (typeof img === 'string' ? img : img.url || ''))
      .filter(Boolean);
    if (!urls.length) return;
    setLightboxImages(urls);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeGallery = () => setLightboxOpen(false);

  const showPrev = () => setLightboxIndex(i => (i - 1 + lightboxImages.length) % lightboxImages.length);
  const showNext = () => setLightboxIndex(i => (i + 1) % lightboxImages.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8 lg:mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-25"></div>
                <div className="relative p-2 bg-white rounded-full shadow-lg">
                  <BuildingOfficeIcon className="h-7 w-7 text-blue-600" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Projects</h1>
                <p className="text-gray-600 mt-1">Manage community development initiatives</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                {stats.total} total projects
              </span>
              <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-full">
                {stats.planning} planning
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                {stats.active} active
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                {stats.paused} paused
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                {stats.completed} completed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/projects/create"
              className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Project
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 transform transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-blue-600">
            <span className="flex items-center gap-1">
              <ArrowPathIcon className="h-3 w-3" />
              Last updated just now
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 transform transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.ongoing}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-green-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.ongoing / Math.max(stats.total, 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 transform transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {formatCurrency(stats.totalBudget).replace('KES', 'KSH')}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Across all projects
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 transform transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">
                {projects.reduce((sum, p) => sum + (Number(p.teamSize) || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl">
              <UserGroupIcon className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-green-600 flex items-center gap-1">
            <ArrowPathIcon className="h-3 w-3" />
            Active workforce
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="relative max-w-xl">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'planning', 'active', 'completed', 'paused'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredProjects.length} of {projects.length} projects
          {searchTerm && ` matching "${searchTerm}"`}
          {statusFilter !== 'all' && ` with status "${statusFilter}"`}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 border border-gray-200">
          <div className="flex flex-col items-center justify-center">
            <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Projects</h3>
            <p className="text-gray-500">Fetching your project data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
          <div className="flex flex-col items-center text-center max-w-md mx-auto">
            <div className="p-3 bg-gradient-to-br from-red-100 to-red-50 rounded-xl mb-4">
              <ExclamationCircleIcon className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Projects</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchProjects}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Lightbox modal for viewing project images */}
          {lightboxOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={closeGallery}>
              <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <button onClick={closeGallery} className="absolute top-3 right-3 text-white bg-black/40 rounded-full p-2">✕</button>
                <div className="bg-black rounded-lg overflow-hidden">
                  <img src={lightboxImages[lightboxIndex]} alt={`img-${lightboxIndex}`} className="w-full h-[60vh] object-contain bg-black" />
                </div>
                <div className="flex items-center justify-between mt-2 text-white">
                  <button onClick={showPrev} className="px-4 py-2 bg-black/40 rounded">Prev</button>
                  <div className="text-sm">{lightboxIndex + 1} / {lightboxImages.length}</div>
                  <button onClick={showNext} className="px-4 py-2 bg-black/40 rounded">Next</button>
                </div>
              </div>
            </div>
          )}
          {/* Projects Grid/Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏗️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Create your first project to get started'}
                </p>
                <Link
                  to="/projects/create"
                  className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create New Project
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Project Details
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Timeline
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProjects.map((project) => (
                      <tr key={project._id || project.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-5 px-6">
                          <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                {project.images && project.images.length > 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => openGallery(project.images, 0)}
                                    className="h-12 w-12 rounded-xl overflow-hidden shadow-sm"
                                  >
                                    <img
                                      src={project.images[0].url || project.images[0]}
                                      alt={project.title}
                                      className="h-full w-full object-cover"
                                    />
                                  </button>
                                ) : (
                                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm">
                                    <span className="text-xl font-bold text-blue-600">
                                      {(project.title || project.name || '').charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            <div className="ml-4">
                              <div className="text-base font-semibold text-gray-900">
                                {project.title || project.name}
                              </div>
                              <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {project.category || 'Uncategorized'}
                                </span>
                                {project.teamSize && (
                                  <span className="flex items-center gap-1 text-xs">
                                    <UserGroupIcon className="h-3 w-3" />
                                    {project.teamSize} members
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getStatusIcon(project.status)}</span>
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${getStatusColor(project.status)}`}>
                              {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="text-base font-semibold text-gray-900">
                            {formatCurrency(project.budget).replace('KES', 'KSH')}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {project.fundingSource || 'Self-funded'}
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4 text-gray-400" />
                              {formatDate(project.startDate)}
                            </div>
                            {project.endDate && (
                              <div className="text-xs text-gray-500 mt-1">
                                Ends: {formatDate(project.endDate)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/projects/view/${project._id || project.id}`}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View details"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </Link>
                            <Link
                              to={`/projects/edit/${project._id || project.id}`}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit project"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(project._id || project.id)}
                              disabled={deletingId === (project._id || project.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                deletingId === (project._id || project.id)
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                              }`}
                              title="Delete project"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;