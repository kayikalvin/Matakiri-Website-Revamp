import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { partnersAPI } from '../../services/api';
import { Toaster, toast } from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  UsersIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import FilterBar from '../../components/Common/FilterBar';
import CardGrid from '../../components/Common/CardGrid';
import DataTable from '../../components/Common/DataTable';
import StatusBadge from '../../components/Common/StatusBadge';
import StatCard from '../../components/Common/StatCard';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => { fetchPartners(); }, []);

  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await partnersAPI.getAll();
      const payload = res.data?.data || res.data;
      setPartners(Array.isArray(payload) ? payload : []);
      toast.success('Partners loaded');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load partners');
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await partnersAPI.delete(id);
      setPartners(prev => prev.filter(p => p._id !== id && p.id !== id));
      toast.success('Partner deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  // Filtered list computed on the fly (no separate state needed)
  const filtered = partners.filter(p => {
    const matchSearch =
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.type || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? (p.isActive === true || p.status === 'active') : (p.isActive === false || p.status === 'inactive'));
    const matchType =
      typeFilter === 'all' || (p.type || '').toLowerCase().includes(typeFilter.toLowerCase());
    return matchSearch && matchStatus && matchType;
  });

  const stats = {
    total: partners.length,
    active: partners.filter(p => p.isActive === true || p.status === 'active').length,
    inactive: partners.filter(p => p.isActive === false || p.status === 'inactive').length,
    ngo: partners.filter(p => (p.type || '').toLowerCase().includes('ngo')).length,
    corporate: partners.filter(p => (p.type || '').toLowerCase().includes('corporate')).length,
    government: partners.filter(p => (p.type || '').toLowerCase().includes('government')).length,
    community: partners.filter(p => (p.type || '').toLowerCase().includes('community')).length,
  };

  const formatDate = (val) => {
    if (!val) return null;
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val).slice(0, 10);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const columns = [
    {
      key: 'name',
      header: 'Partner',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-sm bg-parchment-100 border border-border flex items-center justify-center overflow-hidden">
            {row.logo ? (
              <img src={row.logo} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-mono text-xs text-ink-800">
                {(row.name || '?')[0].toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-ink-800 font-sans">{row.name}</div>
            <div className="text-xs text-ink-500">{row.type || 'N/A'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <StatusBadge
          label={row.isActive !== false ? 'Active' : 'Inactive'}
          variant={row.isActive !== false ? 'success' : 'neutral'}
        />
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <div>{row.contactPerson?.name || row.contact || '—'}</div>
          {row.email && <div className="text-ink-500">{row.email}</div>}
          {row.contactPerson?.email && <div className="text-ink-500">{row.contactPerson.email}</div>}
        </div>
      ),
    },
    {
      key: 'website',
      header: 'Website',
      render: (row) =>
        row.website ? (
          <a
            href={row.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-laterite-500 underline"
          >
            {row.website.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <span className="text-xs text-ink-500">—</span>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-1',
      render: (row) => (
        <div className="flex gap-1">
          <Link to={`/partners/edit/${row._id || row.id}`} className="p-1.5 text-ink-500 hover:text-laterite-500" title="Edit">
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(row._id || row.id, row.name)}
            className="p-1.5 text-ink-500 hover:text-status-danger"
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
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-laterite-500">
            Partners
          </span>
          <h1 className="font-display text-3xl font-medium text-ink-800 mt-1">Partner Organizations</h1>
          <p className="text-ink-500 text-sm mt-1">Manage and collaborate with partner organizations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPartners}
            className="p-2 border border-border bg-white hover:border-laterite-500 transition-colors"
            title="Refresh"
          >
            <ArrowPathIcon className="h-4 w-4 text-ink-500" />
          </button>
          <Link
            to="/partners/create"
            className="inline-flex items-center gap-2 border border-laterite-500 text-laterite-600 px-4 py-2 text-sm hover:bg-laterite-50 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Partner
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Partners" value={stats.total} icon={UsersIcon} loading={loading} tone="laterite" deltaLabel={`${stats.active} active`} />
        <StatCard label="Active" value={stats.active} icon={CheckCircleIcon} loading={loading} tone="acacia" />
        <StatCard label="NGOs" value={stats.ngo} icon={ShieldCheckIcon} loading={loading} tone="maize" />
        <StatCard label="Corporate" value={stats.corporate} icon={BriefcaseIcon} loading={loading} tone="laterite" />
      </div>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Search partners by name, description, or type..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            key: 'status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ],
          },
          {
            key: 'type',
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { value: 'all', label: 'All Types' },
              { value: 'ngo', label: 'NGO' },
              { value: 'corporate', label: 'Corporate' },
              { value: 'government', label: 'Government' },
              { value: 'community', label: 'Community' },
            ],
          },
        ]}
        resultCount={filtered.length}
        totalCount={partners.length}
        resultLabel="partners"
        rightSlot={
          <div className="flex items-center bg-parchment-50 border border-border p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-mono ${viewMode === 'grid' ? 'bg-white border border-border text-ink-800' : 'text-ink-500'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-mono ${viewMode === 'list' ? 'bg-white border border-border text-ink-800' : 'text-ink-500'}`}
            >
              List
            </button>
          </div>
        }
      />

      {/* Content */}
      {error ? (
        <div className="bg-white border border-status-danger/30 p-8 text-center">
          <p className="text-status-danger text-sm font-mono">{error}</p>
          <button onClick={fetchPartners} className="mt-4 text-laterite-500 underline text-xs font-mono">
            Retry
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <CardGrid
          items={filtered}
          loading={loading}
          emptyState={
            <div className="text-center py-16">
              <p className="text-ink-500 text-sm font-mono">No partners found</p>
              <Link to="/partners/create" className="text-laterite-500 text-xs mt-2 inline-block">
                Add first partner →
              </Link>
            </div>
          }
          renderCard={(partner) => (
            <div className="bg-white border border-border hover:border-laterite-500/30 transition-colors p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-sm bg-parchment-100 border border-border flex items-center justify-center overflow-hidden">
                  {partner.logo ? (
                    <img src={partner.logo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-mono text-sm text-ink-800">
                      {(partner.name || '?')[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-sans text-sm font-semibold text-ink-800 truncate">{partner.name}</h3>
                  <p className="text-xs text-ink-500">{partner.type || 'N/A'}</p>
                </div>
              </div>
              <StatusBadge
                label={partner.isActive !== false ? 'Active' : 'Inactive'}
                variant={partner.isActive !== false ? 'success' : 'neutral'}
              />
              {partner.description && (
                <p className="text-xs text-ink-500 line-clamp-2">{partner.description}</p>
              )}
              <div className="space-y-1.5 text-xs">
                {(partner.contactPerson?.name || partner.contact) && (
                  <div className="flex items-center gap-2 text-ink-700">
                    <UsersIcon className="h-3.5 w-3.5 text-ink-500" />
                    {partner.contactPerson?.name || partner.contact}
                  </div>
                )}
                {partner.email && (
                  <div className="flex items-center gap-2 text-ink-700">
                    <EnvelopeIcon className="h-3.5 w-3.5 text-ink-500" />
                    {partner.email}
                  </div>
                )}
                {partner.website && (
                  <div className="flex items-center gap-2">
                    <GlobeAltIcon className="h-3.5 w-3.5 text-ink-500" />
                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-laterite-500 underline truncate">
                      {partner.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {partner.partnershipStart && (
                  <div className="flex items-center gap-2 text-ink-500">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Since {formatDate(partner.partnershipStart)}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Link to={`/partners/edit/${partner._id || partner.id}`} className="p-1.5 text-ink-500 hover:text-laterite-500">
                  <PencilIcon className="h-4 w-4" />
                </Link>
                <button onClick={() => handleDelete(partner._id || partner.id, partner.name)} className="p-1.5 text-ink-500 hover:text-status-danger">
                  <TrashIcon className="h-4 w-4" />
                </button>
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
              <p className="text-ink-500 text-sm font-mono">No partners found</p>
            </div>
          }
        />
      )}
    </div>
  );
};

export default Partners;