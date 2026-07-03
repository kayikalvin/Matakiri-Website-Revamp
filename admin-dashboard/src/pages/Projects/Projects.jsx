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
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  PhotoIcon,
  MapPinIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

import FilterBar from '../../components/Common/FilterBar';
import DataTable from '../../components/Common/DataTable';
import CardGrid from '../../components/Common/CardGrid';
import StatusBadge from '../../components/Common/StatusBadge';
import StatCard from '../../components/Common/'; // now in Common

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Stats computed automatically
  const stats = {
    total: projects.length,
    planning: projects.filter(p => p.status === 'planning').length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    paused: projects.filter(p => p.status === 'paused').length,
    totalBudget: projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0),
    teamMembers: projects.reduce((sum, p) => sum + (Number(p.teamSize) || 0), 0),
  };

  // Lightbox state
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectsAPI.getAll();
      const payload = res.data?.data || res.data;
      setProjects(Array.isArray(payload) ? payload : []);
      toast.success('Projects loaded');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeletingId(id);
    try {
      await projectsAPI.delete(id);
      setProjects(prev => prev.filter(p => p._id !== id && p.id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = projects.filter(p => {
    const matchesSearch = (p.title || p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 })
      .format(amount || 0).replace('KES', 'KSH');

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const openLightbox = (images, idx = 0) => {
    const urls = images.map(i => (typeof i === 'string' ? i : i.url || '')).filter(Boolean);
    if (!urls.length) return;
    setLightbox({ open: true, images: urls, index: idx });
  };
  const closeLightbox = () => setLightbox({ open: false, images: [], index: 0 });
  const prevImage = () => setLightbox(l => ({ ...l, index: (l.index - 1 + l.images.length) % l.images.length }));
  const nextImage = () => setLightbox(l => ({ ...l, index: (l.index + 1) % l.images.length }));

  // Column definition for DataTable (list view)
  const columns = [
    {
      key: 'title',
      header: 'Project Details',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-sm bg-parchment-100 border border-border flex items-center justify-center overflow-hidden">
            {row.images?.[0] ? (
              <img src={typeof row.images[0] === 'string' ? row.images[0] : row.images[0].url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-mono text-xs text-ink-800">{(row.title || row.name || '?')[0].toUpperCase()}</span>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-ink-800 font-sans">{row.title || row.name}</div>
            <div className="text-xs text-ink-500">{row.category || 'Uncategorized'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge label={row.status || 'Unknown'} variant={row.status === 'active' ? 'success' : row.status === 'planning' ? 'warning' : row.status === 'completed' ? 'acacia' : 'neutral'} />,
    },
    {
      key: 'budget',
      header: 'Budget',
      render: (row) => <span className="tabular-nums">{formatCurrency(row.budget)}</span>,
    },
    {
      key: 'timeline',
      header: 'Timeline',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1"><CalendarIcon className="h-3 w-3 text-ink-500" />{formatDate(row.startDate) || '—'}</div>
          {row.endDate && <div className="text-ink-500">End: {formatDate(row.endDate)}</div>}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-1',
      render: (row) => (
        <div className="flex gap-1">
          <Link to={`/projects/view/${row._id || row.id}`} className="p-1.5 text-ink-500 hover:text-laterite-500" title="View"><EyeIcon className="h-4 w-4" /></Link>
          <Link to={`/projects/edit/${row._id || row.id}`} className="p-1.5 text-ink-500 hover:text-laterite-500" title="Edit"><PencilIcon className="h-4 w-4" /></Link>
          <button onClick={() => handleDelete(row._id || row.id, row.title || row.name)} disabled={deletingId === (row._id || row.id)} className="p-1.5 text-ink-500 hover:text-status-danger disabled:opacity-30" title="Delete"><TrashIcon className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  // Status variant mapping for badges
  const statusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'planning': return 'warning';
      case 'completed': return 'acacia';
      case 'paused': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-laterite-500">Projects</span>
          <h1 className="font-display text-3xl font-medium text-ink-800 mt-1">Project Portfolio</h1>
          <p className="text-ink-500 text-sm mt-1">Manage community development initiatives</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchProjects} className="p-2 border border-border bg-white hover:border-laterite-500 transition-colors" title="Refresh">
            <ArrowPathIcon className="h-4 w-4 text-ink-500" />
          </button>
          <Link to="/projects/create" className="inline-flex items-center gap-2 border border-laterite-500 text-laterite-600 px-4 py-2 text-sm hover:bg-laterite-50 transition-colors">
            <PlusIcon className="h-4 w-4" />
            New Project
          </Link>
        </div>
      </div>

      {/* Stats row — using StatCard (laterite theme) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Projects" value={stats.total} icon={ChartBarIcon} loading={loading} tone="laterite" deltaLabel={`${stats.active} active`} />
        <StatCard label="Total Budget" value={formatCurrency(stats.totalBudget)} icon={CurrencyDollarIcon} loading={loading} tone="acacia" deltaLabel={`${stats.planning} planning`} />
        <StatCard label="Completed" value={stats.completed} icon={UserGroupIcon} loading={loading} tone="maize" deltaLabel={`${stats.paused} paused`} />
        <StatCard label="Team Members" value={stats.teamMembers} icon={UserGroupIcon} loading={loading} tone="laterite" deltaLabel="active workforce" />
      </div>

      {/* Filter bar */}
      <FilterBar
        searchPlaceholder="Search projects by name, description, or category..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            key: 'status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'planning', label: 'Planning' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
              { value: 'paused', label: 'Paused' },
            ],
          },
        ]}
        resultCount={filtered.length}
        totalCount={projects.length}
        resultLabel="projects"
        rightSlot={
          <div className="flex items-center bg-parchment-50 border border-border p-0.5">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 text-xs font-mono ${viewMode === 'grid' ? 'bg-white border border-border text-ink-800' : 'text-ink-500'}`}>Grid</button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 text-xs font-mono ${viewMode === 'list' ? 'bg-white border border-border text-ink-800' : 'text-ink-500'}`}>List</button>
          </div>
        }
      />

      {/* Content area */}
      {error ? (
        <div className="bg-white border border-status-danger/30 p-8 text-center">
          <ExclamationCircleIcon className="h-8 w-8 text-status-danger mx-auto mb-3" />
          <p className="text-status-danger text-sm font-mono">{error}</p>
          <button onClick={fetchProjects} className="mt-4 text-xs font-mono text-laterite-500 underline">Retry</button>
        </div>
      ) : viewMode === 'grid' ? (
        <CardGrid
          items={filtered}
          loading={loading}
          emptyState={
            <div className="text-center py-16">
              <p className="text-ink-500 text-sm font-mono">No projects found</p>
              {searchTerm || statusFilter !== 'all' ? (
                <p className="text-xs text-ink-500 mt-1">Try adjusting filters</p>
              ) : (
                <Link to="/projects/create" className="text-laterite-500 text-xs mt-2 inline-block">Create your first project →</Link>
              )}
            </div>
          }
          renderCard={(project) => (
            <div className="bg-white border border-border hover:border-laterite-500/30 transition-colors group">
              {/* Card image */}
              <div className="relative h-40 bg-parchment-100 flex items-center justify-center overflow-hidden">
                {project.images?.[0] ? (
                  <button onClick={() => openLightbox(project.images, 0)} className="w-full h-full">
                    <img src={typeof project.images[0] === 'string' ? project.images[0] : project.images[0].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </button>
                ) : (
                  <span className="text-5xl opacity-20 font-mono">{(project.title || '?')[0]}</span>
                )}
                <div className="absolute top-3 left-3">
                  <StatusBadge label={project.status || 'Unknown'} variant={statusVariant(project.status)} />
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-sans text-sm font-semibold text-ink-800 line-clamp-1">{project.title || project.name}</h3>
                <p className="text-xs text-ink-500 line-clamp-2">{project.description || ''}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-mono text-xs text-ink-800 tabular-nums">{formatCurrency(project.budget)}</span>
                  <div className="flex items-center gap-1">
                    <Link to={`/projects/view/${project._id || project.id}`} className="p-1.5 text-ink-500 hover:text-laterite-500" title="View"><EyeIcon className="h-4 w-4" /></Link>
                    <Link to={`/projects/edit/${project._id || project.id}`} className="p-1.5 text-ink-500 hover:text-laterite-500" title="Edit"><PencilIcon className="h-4 w-4" /></Link>
                    <button onClick={() => handleDelete(project._id || project.id, project.title || project.name)} disabled={deletingId === (project._id || project.id)} className="p-1.5 text-ink-500 hover:text-status-danger" title="Delete"><TrashIcon className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          emptyState={
            <div className="text-center py-16">
              <p className="text-ink-500 text-sm font-mono">No projects found</p>
              {searchTerm || statusFilter !== 'all' ? (
                <p className="text-xs text-ink-500 mt-1">Try adjusting filters</p>
              ) : (
                <Link to="/projects/create" className="text-laterite-500 text-xs mt-2 inline-block">Create your first project →</Link>
              )}
            </div>
          }
        />
      )}

      {/* Lightbox */}
      {lightbox.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-soil-900/95" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-parchment-50 hover:text-laterite-500">
            <XMarkIcon className="h-8 w-8" />
          </button>
          <div className="max-w-5xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <img src={lightbox.images[lightbox.index]} alt="" className="w-full max-h-[75vh] object-contain" />
            <div className="flex items-center justify-between mt-4 text-parchment-50">
              <button onClick={prevImage} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors"><ChevronLeftIcon className="h-5 w-5" /> Prev</button>
              <span className="font-mono text-xs">{lightbox.index + 1} / {lightbox.images.length}</span>
              <button onClick={nextImage} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors">Next <ChevronRightIcon className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;