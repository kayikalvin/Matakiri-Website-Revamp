import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { usersAPI } from '../../services/api';

import FilterBar from '../../components/Common/FilterBar';
import DataTable from '../../components/Common/DataTable';
import StatusBadge from '../../components/Common/StatusBadge';
import StatCard from '../../components/Common/StatCard';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersAPI.getAll();
      const payload = res.data?.data || res.data;
      const usersData = Array.isArray(payload) ? payload : [];
      setUsers(usersData);
      toast.success('Users loaded');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeletingId(id);
    try {
      await usersAPI.delete(id);
      setUsers(prev => prev.filter(u => u._id !== id && u.id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleStatusToggle = async (id, currentActive) => {
    try {
      const newStatus = !currentActive;
      await usersAPI.update(id, { isActive: newStatus });
      setUsers(prev => prev.map(u =>
        (u._id === id || u.id === id) ? { ...u, isActive: newStatus } : u
      ));
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive === true || u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    editors: users.filter(u => u.role === 'editor').length,
    pending: users.filter(u => u.status === 'pending').length,
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && (user.isActive === true || user.status === 'active')) ||
      (statusFilter === 'inactive' && (user.isActive === false || user.status === 'inactive')) ||
      (statusFilter === 'pending' && user.status === 'pending');
    return matchSearch && matchRole && matchStatus;
  });

  const uniqueRoles = [...new Set(users.map(u => u.role).filter(Boolean))];

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const statusVariant = (user) => {
    const active = user.isActive === true || user.status === 'active';
    return active ? 'success' : 'neutral';
  };

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-parchment-100 border border-border flex items-center justify-center">
            <span className="font-mono text-xs text-ink-800">{getInitials(row.name)}</span>
          </div>
          <div>
            <div className="text-sm font-medium text-ink-800 font-sans">{row.name || 'Unnamed'}</div>
            <div className="flex items-center gap-3 text-xs text-ink-500">
              <span className="flex items-center gap-1"><EnvelopeIcon className="h-3 w-3" />{row.email || 'No email'}</span>
              {row.phone && <span className="flex items-center gap-1"><PhoneIcon className="h-3 w-3" />{row.phone}</span>}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <StatusBadge
          label={(row.role || 'unassigned').toUpperCase()}
          variant={row.role === 'admin' ? 'laterite' : row.role === 'editor' ? 'acacia' : 'neutral'}
        />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <div className="flex items-center gap-2">
          <StatusBadge
            label={row.isActive === true || row.status === 'active' ? 'Active' : 'Inactive'}
            variant={statusVariant(row)}
          />
          <button
            onClick={() => handleStatusToggle(row._id || row.id, row.isActive)}
            className="p-1 text-ink-400 hover:text-laterite-500"
            title={row.isActive ? 'Deactivate' : 'Activate'}
          >
            {row.isActive ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
          </button>
        </div>
      ),
    },
    {
      key: 'joined',
      header: 'Joined',
      render: (row) => (
        <span className="flex items-center gap-1 text-xs text-ink-500">
          <CalendarIcon className="h-3.5 w-3.5" />
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-1',
      render: (row) => (
        <div className="flex gap-1">
          <Link to={`/users/${row._id || row.id}`} className="p-1.5 text-ink-500 hover:text-laterite-500"><EyeIcon className="h-4 w-4" /></Link>
          <Link to={`/users/edit/${row._id || row.id}`} className="p-1.5 text-ink-500 hover:text-laterite-500"><PencilIcon className="h-4 w-4" /></Link>
          <button
            onClick={() => handleDelete(row._id || row.id, row.name)}
            disabled={deletingId === (row._id || row.id)}
            className="p-1.5 text-ink-500 hover:text-status-danger disabled:opacity-30"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-laterite-500">Users</span>
          <h1 className="font-display text-3xl font-medium text-ink-800 mt-1">User Management</h1>
          <p className="text-ink-500 text-sm mt-1">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 border border-border bg-white hover:border-laterite-500 transition-colors"
            title="Refresh"
          >
            <ArrowPathIcon className={`h-4 w-4 text-ink-500 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <Link to="/users/create" className="inline-flex items-center gap-2 border border-laterite-500 text-laterite-600 px-4 py-2 text-sm hover:bg-laterite-50 transition-colors">
            <UserPlusIcon className="h-4 w-4" />
            Add User
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Users" value={stats.total} icon={UserIcon} loading={loading} tone="laterite" />
        <StatCard label="Active" value={stats.active} icon={ShieldCheckIcon} loading={loading} tone="acacia" />
        <StatCard label="Admins" value={stats.admins} icon={ShieldCheckIcon} loading={loading} tone="laterite" />
        <StatCard label="Editors" value={stats.editors} icon={PencilIcon} loading={loading} tone="maize" />
        <StatCard label="Pending" value={stats.pending} icon={CalendarIcon} loading={loading} tone="maize" />
      </div>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Search users by name, email, or phone..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            key: 'role',
            value: roleFilter,
            onChange: setRoleFilter,
            options: [
              { value: 'all', label: 'All Roles' },
              ...uniqueRoles.map(role => ({ value: role, label: role.charAt(0).toUpperCase() + role.slice(1) })),
            ],
          },
          {
            key: 'status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'pending', label: 'Pending' },
            ],
          },
        ]}
        resultCount={filteredUsers.length}
        totalCount={users.length}
        resultLabel="users"
      />

      {/* Data */}
      {error ? (
        <div className="bg-white border border-status-danger/30 p-8 text-center">
          <p className="text-status-danger text-sm font-mono">{error}</p>
          <button onClick={fetchUsers} className="mt-4 text-laterite-500 underline text-xs font-mono">Retry</button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredUsers}
          loading={loading}
          emptyState={
            <div className="text-center py-16">
              <p className="text-ink-500 text-sm font-mono">No users found</p>
              <Link to="/users/create" className="text-laterite-500 text-xs mt-2 inline-block">Add first user →</Link>
            </div>
          }
        />
      )}
    </div>
  );
};

export default Users;