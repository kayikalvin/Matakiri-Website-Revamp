import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { programsAPI } from '../../services/api';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  AcademicCapIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

import FilterBar from '../../components/Common/FilterBar';
import DataTable from '../../components/Common/DataTable';
import StatusBadge from '../../components/Common/StatusBadge';
import StatCard from '../../components/Common/StatCard';

const Programs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const resolveAdminImage = (src) => {
    if (!src) return undefined;
    if (src.startsWith('http')) return src;
    let base = 'http://localhost:5000';
    try {
      if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) base = import.meta.env.VITE_API_URL;
    } catch (e) {}
    if (src.startsWith('/api/uploads')) return `${base}${src.replace('/api/uploads', '/uploads')}`;
    if (src.startsWith('/uploads')) return `${base}${src}`;
    return src;
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await programsAPI.getAll();
      let arr = [];
      if (Array.isArray(res.data)) {
        arr = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        arr = res.data.data;
      }
      setPrograms(arr);
      toast.success('Programs loaded');
    } catch (err) {
      setError(err.message || 'Failed to load programs');
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <span>
        Are you sure you want to delete this program?
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            setDeletingId(id);
            try {
              await programsAPI.delete(id);
              setPrograms(prev => prev.filter(p => p._id !== id));
              toast.success('Program deleted');
            } catch (err) {
              toast.error(err.response?.data?.message || err.message || 'Failed to delete program');
            } finally {
              setDeletingId(null);
            }
          }}
          className="ml-4 px-3 py-1 bg-red-600 text-white rounded-sm hover:bg-red-700"
        >
          Confirm
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-2 px-3 py-1 bg-gray-300 text-gray-800 rounded-sm hover:bg-gray-400"
        >
          Cancel
        </button>
      </span>
    ), { duration: 8000 });
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch =
      (program.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (program.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || program.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: programs.length,
    active: programs.filter(p => p.status === 'active').length,
    completed: programs.filter(p => p.status === 'completed').length,
  };

  const statusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'acacia';
      case 'inactive': return 'neutral';
      default: return 'neutral';
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Program',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-sm bg-parchment-100 border border-border flex items-center justify-center overflow-hidden">
            {row.image ? (
              <img src={resolveAdminImage(row.image)} alt="" className="h-full w-full object-cover" />
            ) : (
              <AcademicCapIcon className="h-5 w-5 text-ink-400" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-ink-800 font-sans">{row.title}</div>
            <div className="text-xs text-ink-500">{row.category || 'General'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge label={row.status || 'Unknown'} variant={statusVariant(row.status)} />,
    },
    {
      key: 'beneficiaries',
      header: 'Beneficiaries',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-sm font-mono tabular-nums">
          <UserGroupIcon className="h-3.5 w-3.5 text-ink-500" />
          {row.beneficiaries || 0}
        </div>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (row) => <span className="text-sm">{row.duration || '—'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-1',
      render: (row) => (
        <div className="flex gap-1">
          <Link to={`/programs/${row._id}/edit`} className="p-1.5 text-ink-500 hover:text-laterite-500" title="Edit">
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(row._id)}
            disabled={deletingId === row._id}
            className="p-1.5 text-ink-500 hover:text-status-danger disabled:opacity-30"
            title="Delete"
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
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-laterite-500">Programs</span>
          <h1 className="font-display text-3xl font-medium text-ink-800 mt-1">Programs</h1>
          <p className="text-ink-500 text-sm mt-1">Manage and track all programs</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchPrograms} className="p-2 border border-border bg-white hover:border-laterite-500 transition-colors" title="Refresh">
            <ArrowPathIcon className="h-4 w-4 text-ink-500" />
          </button>
          <Link to="/programs/create" className="inline-flex items-center gap-2 border border-laterite-500 text-laterite-600 px-4 py-2 text-sm hover:bg-laterite-50 transition-colors">
            <PlusIcon className="h-4 w-4" />
            Add Program
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Programs" value={stats.total} icon={AcademicCapIcon} loading={loading} tone="laterite" />
        <StatCard label="Active" value={stats.active} icon={AcademicCapIcon} loading={loading} tone="acacia" />
        <StatCard label="Completed" value={stats.completed} icon={AcademicCapIcon} loading={loading} tone="maize" />
      </div>

      {/* Filter */}
      <FilterBar
        searchPlaceholder="Search programs by title or category..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            key: 'status',
            value: filterStatus,
            onChange: setFilterStatus,
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'completed', label: 'Completed' },
              { value: 'inactive', label: 'Inactive' },
            ],
          },
        ]}
        resultCount={filteredPrograms.length}
        totalCount={programs.length}
        resultLabel="programs"
      />

      {/* Data */}
      {error ? (
        <div className="bg-white border border-status-danger/30 p-8 text-center">
          <p className="text-status-danger text-sm font-mono">{error}</p>
          <button onClick={fetchPrograms} className="mt-4 text-laterite-500 underline text-xs font-mono">Retry</button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredPrograms}
          loading={loading}
          emptyState={
            <div className="text-center py-16">
              <p className="text-ink-500 text-sm font-mono">No programs found</p>
              {!searchTerm && filterStatus === 'all' && (
                <Link to="/programs/create" className="text-laterite-500 text-xs mt-2 inline-block">Create first program →</Link>
              )}
            </div>
          }
        />
      )}
    </div>
  );
};

export default Programs;