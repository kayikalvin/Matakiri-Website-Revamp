import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PencilIcon, 
  TrashIcon, 
  UserPlusIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { usersAPI } from '../../services/api';
import { Toaster, toast } from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    admins: 0,
    editors: 0,
    pending: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersAPI.getAll();
      const payload = res.data && res.data.data ? res.data.data : res.data;
      const usersData = Array.isArray(payload) ? payload : [];
      setUsers(usersData);
      
      // Calculate stats
      const total = usersData.length;
      const active = usersData.filter(u => u.isActive === true || u.status === 'active').length;
      const admins = usersData.filter(u => u.role === 'admin').length;
      const editors = usersData.filter(u => u.role === 'editor').length;
      const pending = usersData.filter(u => u.status === 'pending').length;
      
      setStats({ total, active, admins, editors, pending });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = (id, name) => {
    toast((t) => (
      <span>
        Are you sure you want to delete <b>{name}</b>?
        <div className="mt-2 flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setDeletingId(id);
              toast.promise(
                usersAPI.delete(id).then(() => {
                  setUsers(users => users.filter(u => u._id !== id && u.id !== id));
                  fetchUsers();
                }),
                {
                  loading: 'Deleting user...',
                  success: 'User deleted successfully!',
                  error: (err) => err?.response?.data?.message || err?.message || 'Failed to delete user.',
                }
              ).finally(() => setDeletingId(null));
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-xs"
          >
            Cancel
          </button>
        </div>
      </span>
    ), { duration: 8000 });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus ? false : true;
      await usersAPI.update(id, { isActive: newStatus });
      
      setUsers(users.map(user => 
        (user._id === id || user.id === id) 
          ? { ...user, isActive: newStatus }
          : user
      ));
      
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'editor': return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'viewer': return 'bg-green-100 text-green-800 border-green-200';
      case 'manager': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contributor': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (user) => {
    const status = typeof user.isActive === 'boolean' 
      ? (user.isActive ? 'active' : 'inactive')
      : (user.status || 'inactive');
    
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (typeof user.isActive === 'boolean'
        ? (statusFilter === 'active' ? user.isActive === true : user.isActive === false)
        : (user.status || '') === statusFilter);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const uniqueRoles = [...new Set(users.map(user => user.role).filter(Boolean))];

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 font-medium text-lg mb-2">Error Loading Users</div>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchUsers}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/users/create"
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add User
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-primary-50 rounded-xl flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">All registered users</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.active}</p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Currently active</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Admins</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.admins}</p>
              </div>
              <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Administrators</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Editors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.editors}</p>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <PencilIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Content editors</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Awaiting approval</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('all');
              setStatusFilter('all');
            }}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear filters
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            <p className="text-sm text-gray-600 mt-1">All registered users in the system</p>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="py-16 text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">No users found</p>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms' 
                  : 'Get started by adding your first user'}
              </p>
              <Link
                to="/users/create"
                className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Add First User
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center border-2 border-white shadow">
                            <span className="text-primary-600 font-semibold text-sm">
                              {getInitials(user.name)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{user.name || 'Unnamed User'}</div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <EnvelopeIcon className="h-4 w-4 mr-1" />
                                {user.email || 'No email'}
                              </div>
                              {user.phone && (
                                <div className="flex items-center">
                                  <PhoneIcon className="h-4 w-4 mr-1" />
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(user)}`}>
                            {typeof user.isActive === 'boolean' 
                              ? (user.isActive ? 'Active' : 'Inactive')
                              : (user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown')}
                          </span>
                          <button
                            onClick={() => handleStatusToggle(user._id || user.id, user.isActive)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title={user.isActive ? 'Deactivate user' : 'Activate user'}
                          >
                            {user.isActive ? (
                              <XCircleIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                            ) : (
                              <CheckCircleIcon className="h-5 w-5 text-gray-400 hover:text-green-500" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/users/${user._id || user.id}`}
                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/users/edit/${user._id || user.id}`}
                            className="p-1.5 text-primary-500 hover:text-primary-700 transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                            onClick={() => handleDelete(user._id || user.id, user.name)}
                            disabled={deletingId === (user._id || user.id)}
                            title="Delete"
                          >
                            {deletingId === (user._id || user.id) ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                            ) : (
                              <TrashIcon className="h-5 w-5" />
                            )}
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
      </div>
    </div>
  );
};

export default Users;


















// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   PencilIcon, 
//   TrashIcon, 
//   UserPlusIcon,
//   UserIcon,
//   EnvelopeIcon,
//   ShieldCheckIcon,
//   CalendarIcon 
// } from '@heroicons/react/24/outline';
// import { usersAPI } from '../../services/api';
// import { Toaster, toast } from 'react-hot-toast';

// const Users = () => {

//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deletingId, setDeletingId] = useState(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await usersAPI.getAll();
//         // Accept either res.data.data (paginated) or res.data (direct array)
//         const payload = res.data && res.data.data ? res.data.data : res.data;
//         setUsers(Array.isArray(payload) ? payload : []);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to load users.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;
//     setDeletingId(id);
//     try {
//       await usersAPI.delete(id);
//       setUsers(users => users.filter(u => u._id !== id && u.id !== id));
//       toast.success('User deleted successfully!');
//     } catch (err) {
//       toast.error('Failed to delete user.');
//     } finally {
//       setDeletingId(null);
//     }
//   };


//   const getRoleColor = (role) => {
//     switch(role) {
//       case 'admin': return 'bg-red-100 text-red-800';
//       case 'editor': return 'bg-primary-100 text-primary-600';
//       case 'viewer': return 'bg-green-100 text-green-800';
//       case 'manager': return 'bg-purple-100 text-purple-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusColor = (status) => {
//     // status can be a boolean `isActive` or a string
//     if (typeof status === 'boolean') {
//       return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
//     }
//     switch (status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'inactive': return 'bg-red-100 text-red-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };


//   return (
//     <div className="p-6">
//       <Toaster />
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Users</h1>
//           <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
//         </div>
//         <Link
//           to="/users/create"
//           className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
//         >
//           <UserPlusIcon className="h-5 w-5 mr-2" />
//           Add User
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
//           {/* Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//             <div className="bg-white p-4 rounded-lg shadow">
//               <div className="flex items-center">
//                 <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
//                   <UserIcon className="h-5 w-5 text-primary-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Total Users</p>
//                   <p className="text-2xl font-bold">{users.length}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow">
//               <div className="flex items-center">
//                 <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
//                   <ShieldCheckIcon className="h-5 w-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Active Users</p>
//                   <p className="text-2xl font-bold">{users.filter(u => u.isActive === true).length}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow">
//               <div className="flex items-center">
//                 <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
//                   <UserIcon className="h-5 w-5 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Admins</p>
//                   <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow">
//               <div className="flex items-center">
//                 <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
//                   <UserIcon className="h-5 w-5 text-yellow-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Editors</p>
//                   <p className="text-2xl font-bold">{users.filter(u => u.role === 'editor').length}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Users Table */}
//           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//             <div className="px-4 py-5 sm:px-6">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">User List</h3>
//               <p className="mt-1 max-w-2xl text-sm text-gray-500">All registered users in the system</p>
//             </div>
//             <div className="border-t border-gray-200">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {users.map((user) => (
//                     <tr key={user._id || user.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
//                             <span className="text-primary-600 font-medium">{(user.name || '').charAt(0)}</span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                             <div className="text-sm text-gray-500 flex items-center">
//                               <EnvelopeIcon className="h-4 w-4 mr-1" />
//                               {user.email}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
//                           {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
//                           {typeof user.isActive === 'boolean' ? (user.isActive ? 'Active' : 'Inactive') : (user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : '')}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
//                         <CalendarIcon className="h-4 w-4 mr-1" />
//                         {user.createdAt ? user.createdAt.slice(0, 10) : ''}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <Link
//                               to={`/users/edit/${user._id || user.id}`}
//                               className="text-primary-500 hover:text-primary-700"
//                             >
//                             <PencilIcon className="h-5 w-5" />
//                           </Link>
//                           <button
//                             className="text-red-600 hover:text-red-900"
//                             onClick={() => handleDelete(user._id || user.id)}
//                             disabled={deletingId === (user._id || user.id)}
//                           >
//                             {deletingId === (user._id || user.id) ? <TrashIcon className="h-5 w-5 animate-spin" /> : <TrashIcon className="h-5 w-5" />}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {/* Empty State */}
//             {users.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="text-6xl mb-4">👥</div>
//                 <h3 className="text-xl font-medium text-gray-900 mb-2">No users yet</h3>
//                 <p className="text-gray-600">Add your first user to get started</p>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Users;