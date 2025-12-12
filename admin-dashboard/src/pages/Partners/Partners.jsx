import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  CalendarIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UsersIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { partnersAPI } from '../../services/api';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    ngo: 0,
    corporate: 0,
    government: 0,
    community: 0
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    if (partners.length > 0) {
      const total = partners.length;
      const active = partners.filter(p => p.isActive === true || p.status === 'active').length;
      const inactive = partners.filter(p => p.isActive === false || p.status === 'inactive').length;
      const ngo = partners.filter(p => p.type === 'NGO' || p.type?.toLowerCase().includes('ngo')).length;
      const corporate = partners.filter(p => p.type === 'Corporate' || p.type?.toLowerCase().includes('corporate')).length;
      const government = partners.filter(p => p.type === 'Government' || p.type?.toLowerCase().includes('government')).length;
      const community = partners.filter(p => p.type === 'Community' || p.type?.toLowerCase().includes('community')).length;
      
      setStats({
        total,
        active,
        inactive,
        ngo,
        corporate,
        government,
        community
      });
    }
  }, [partners]);

  useEffect(() => {
    // Filter partners based on search and filters
    const filtered = partners.filter(partner => {
      const matchesSearch = 
        (partner.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (partner.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (partner.type || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && (partner.isActive === true || partner.status === 'active')) ||
        (statusFilter === 'inactive' && (partner.isActive === false || partner.status === 'inactive'));
      
      const matchesType = 
        typeFilter === 'all' || 
        (partner.type || '').toLowerCase().includes(typeFilter.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesType;
    });
    
    setFilteredPartners(filtered);
  }, [partners, searchTerm, statusFilter, typeFilter]);

  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await partnersAPI.getAll();
      const payload = res.data && res.data.data ? res.data.data : res.data;
      setPartners(Array.isArray(payload) ? payload : []);
      toast.success('Partners loaded successfully');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load partners');
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete partner "${name}"? This action cannot be undone.`)) return;
    try {
      await partnersAPI.delete(id);
      setPartners(prev => prev.filter(p => p._id !== id && p.id !== id));
      toast.success('Partner deleted successfully');
    } catch (err) {
      toast.error('Failed to delete partner');
    }
  };

  const getStatusColor = (status, isActive) => {
    if (isActive === true || status === 'active') {
      return 'bg-gradient-to-r from-green-100 to-emerald-50 text-emerald-800 border border-emerald-200';
    } else if (isActive === false || status === 'inactive') {
      return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-300';
    }
    return 'bg-gradient-to-r from-yellow-100 to-amber-50 text-amber-800 border border-amber-200';
  };

  const getTypeColor = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'ngo':
        return 'bg-gradient-to-r from-blue-100 to-indigo-50 text-indigo-800 border border-indigo-200';
      case 'corporate':
        return 'bg-gradient-to-r from-purple-100 to-violet-50 text-violet-800 border border-violet-200';
      case 'government':
        return 'bg-gradient-to-r from-emerald-100 to-teal-50 text-teal-800 border border-teal-200';
      case 'community':
        return 'bg-gradient-to-r from-orange-100 to-amber-50 text-amber-800 border border-amber-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-300';
    }
  };

  const formatDate = (val) => {
    if (!val) return 'Not specified';
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val).slice(0, 10);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading partners...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Partners</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchPartners}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 lg:mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30"></div>
                <div className="relative p-3 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <UsersIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Partner Organizations
                </h1>
                <p className="text-gray-600 mt-2">Manage and collaborate with partner organizations</p>
              </div>
            </div>
            
            {/* Stats Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl border border-blue-200">
                👥 {stats.total} total partners
              </span>
              <span className="px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-xl border border-green-200">
                ✅ {stats.active} active
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl border border-blue-200">
                📋 {stats.ngo} NGOs
              </span>
              <span className="px-4 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-xl border border-purple-200">
                🏢 {stats.corporate} corporates
              </span>
              <span className="px-4 py-2 bg-teal-50 text-teal-700 text-sm font-medium rounded-xl border border-teal-200">
                🏛️ {stats.government} government
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchPartners}
              className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-gray-200 hover:border-blue-200"
              title="Refresh partners"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
            <Link
              to="/partners/create"
              className="inline-flex items-center px-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Partner
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200/80 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total Partners</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-inner">
              <UsersIcon className="h-7 w-7 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-blue-600 font-medium">
            <ArrowPathIcon className="h-3 w-3 mr-1" />
            Updated just now
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200/80 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Active Partners</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl shadow-inner">
              <CheckCircleIcon className="h-7 w-7 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.active / Math.max(stats.total, 1)) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {Math.round((stats.active / Math.max(stats.total, 1)) * 100)}% active rate
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200/80 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">NGO Partners</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.ngo}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl shadow-inner">
              <ShieldCheckIcon className="h-7 w-7 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            {Math.round((stats.ngo / Math.max(stats.total, 1)) * 100)}% of total
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200/80 hover:border-amber-200 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Corporate Partners</p>
              <p className="text-3xl font-bold text-violet-600">{stats.corporate}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-violet-100 to-violet-50 rounded-xl shadow-inner">
              <BriefcaseIcon className="h-7 w-7 text-violet-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Major business collaborations
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200/80">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search partners by name, description, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Status Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-gray-50/50"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-gray-50/50"
              >
                <option value="all">All Types</option>
                <option value="ngo">NGO</option>
                <option value="corporate">Corporate</option>
                <option value="government">Government</option>
                <option value="community">Community</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredPartners.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{partners.length}</span> partners
            {searchTerm && (
              <>
                {' '}matching "<span className="font-semibold text-blue-600">{searchTerm}</span>"
              </>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {filteredPartners.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 border border-gray-200 text-center">
          <div className="text-8xl mb-6 opacity-20">🤝</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No partners found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding your first partner organization to build your network'}
          </p>
          <Link
            to="/partners/create"
            className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Your First Partner
          </Link>
        </div>
      ) : (
        /* Partners Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => {
            const isActive = partner.isActive === true || partner.status === 'active';
            const partnerType = partner.type || 'Unknown';
            
            return (
              <div 
                key={partner._id || partner.id} 
                className="group bg-white rounded-2xl shadow-sm border border-gray-200/80 hover:border-blue-200 transition-all duration-300 hover:shadow-xl overflow-hidden"
              >
                {/* Partner Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {partner.logo ? (
                        <div className="h-16 w-16 rounded-xl overflow-hidden border border-gray-200">
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border border-blue-200">
                          <span className="text-2xl font-bold text-blue-600">
                            {getInitials(partner.name)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                          {partner.name || 'Unnamed Partner'}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(partnerType)}`}>
                            {partnerType}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(partner.status, partner.isActive)}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Partner Description */}
                  {partner.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {truncateText(partner.description, 120)}
                    </p>
                  )}
                </div>

                {/* Partner Details */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    {/* Contact Person */}
                    {(partner.contactPerson?.name || partner.contact) && (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <UsersIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">
                            {partner.contactPerson?.name || partner.contact}
                          </div>
                          {(partner.contactPerson?.title || partner.contactPerson?.role) && (
                            <div className="text-xs text-gray-500">
                              {partner.contactPerson.title || partner.contactPerson.role}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    {(partner.contactPerson?.email || partner.email) && (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <EnvelopeIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900 truncate">
                            {partner.contactPerson?.email || partner.email}
                          </div>
                          <div className="text-xs text-gray-500">Email</div>
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    {(partner.contactPerson?.phone || partner.phone) && (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <PhoneIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900">
                            {partner.contactPerson?.phone || partner.phone}
                          </div>
                          <div className="text-xs text-gray-500">Phone</div>
                        </div>
                      </div>
                    )}

                    {/* Website */}
                    {partner.website && (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                          <GlobeAltIcon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 truncate block"
                          >
                            {partner.website.replace(/^https?:\/\//, '')}
                          </a>
                          <div className="text-xs text-gray-500">Website</div>
                        </div>
                      </div>
                    )}

                    {/* Partnership Start */}
                    {partner.partnershipStart && (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                          <CalendarIcon className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900">
                            Since {formatDate(partner.partnershipStart)}
                          </div>
                          <div className="text-xs text-gray-500">Partnership started</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/partners/view/${partner._id || partner.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/partners/edit/${partner._id || partner.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit partner"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                    </div>
                    <button
                      onClick={() => handleDelete(partner._id || partner.id, partner.name)}
                      className="px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-all border border-red-200 hover:border-red-600"
                      title="Delete partner"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Partners;
















// // import React from 'react';

// // const Partners = () => {
// //   const partners = [
// //     { id: 1, name: 'Tech Solutions Ltd', type: 'corporate', status: 'active', contact: 'John Doe' },
// //     { id: 2, name: 'Green Earth NGO', type: 'ngo', status: 'active', contact: 'Jane Smith' },
// //     { id: 3, name: 'County Government', type: 'government', status: 'active', contact: 'Mike Johnson' },
// //     { id: 4, name: 'Farmers Cooperative', type: 'community', status: 'pending', contact: 'Sarah Williams' },
// //     { id: 5, name: 'Education First', type: 'ngo', status: 'inactive', contact: 'Robert Brown' },
// //   ];

// //   const getStatusColor = (status) => {
// //     switch (status) {
// //       case 'active': return 'bg-green-100 text-green-800';
// //       case 'inactive': return 'bg-red-100 text-red-800';
// //       case 'pending': return 'bg-yellow-100 text-yellow-800';
// //       default: return 'bg-gray-100 text-gray-800';
// //     }
// //   };

// //   const getTypeColor = (type) => {
// //     switch (type) {
// //       case 'corporate': return 'bg-blue-100 text-blue-800';
// //       case 'ngo': return 'bg-purple-100 text-purple-800';
// //       case 'government': return 'bg-indigo-100 text-indigo-800';
// //       case 'community': return 'bg-teal-100 text-teal-800';
// //       default: return 'bg-gray-100 text-gray-800';
// //     }
// //   };

// //   return (
// //     <div className="p-6">
// //       <div className="flex justify-between items-center mb-8">
// //         <div>
// //           <h1 className="text-3xl font-bold text-gray-800">Partners</h1>
// //           <p className="text-gray-600 mt-2">Manage partner organizations</p>
// //         </div>
// //         <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
// //           Add Partner
// //         </button>
// //       </div>

// //       {/* Partners Grid */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {partners.map((partner) => (
// //           <div key={partner.id} className="bg-white rounded-lg shadow overflow-hidden">
// //             <div className="p-6">
// //               <div className="flex items-start justify-between mb-4">
// //                 <div>
// //                   <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
// //                   <div className="flex items-center space-x-2 mt-2">
// //                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(partner.type)}`}>
// //                       {partner.type.toUpperCase()}
// //                     </span>
// //                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(partner.status)}`}>
// //                       {partner.status.toUpperCase()}
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
// //                   <span className="text-blue-600 font-bold text-xl">{partner.name.charAt(0)}</span>
// //                 </div>
// //               </div>
              
// //               <div className="space-y-3">
// //                 <div className="flex items-center text-sm text-gray-600">
// //                   <span className="mr-2">👤</span>
// //                   <span>Contact: {partner.contact}</span>
// //                 </div>
                
// //                 <div className="flex space-x-2 pt-4 border-t">
// //                   <button className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
// //                     View Details
// //                   </button>
// //                   <button className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
// //                     Edit
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Empty State */}
// //       {partners.length === 0 && (
// //         <div className="text-center py-12">
// //           <div className="text-6xl mb-4">🤝</div>
// //           <h3 className="text-xl font-medium text-gray-900 mb-2">No partners yet</h3>
// //           <p className="text-gray-600">Add your first partner organization to get started</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Partners;



// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   UserGroupIcon, 
//   PencilIcon, 
//   TrashIcon, 
//   PlusIcon,
//   GlobeAltIcon,
//   PhoneIcon,
//   BuildingOfficeIcon 
// } from '@heroicons/react/24/outline';

// import { useEffect } from 'react';
// import { partnersAPI } from '../../services/api';

// const Partners = () => {
//   const [partners, setPartners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPartners = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await partnersAPI.getAll();
//         // API returns { success, data: [...] }, accept either shape
//         const payload = res.data && res.data.data ? res.data.data : res.data;
//         setPartners(Array.isArray(payload) ? payload : []);
//         console.log(res);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message || 'Failed to load partners');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPartners();
//   }, []);
//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//         </div>
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div className="p-6 text-center text-red-500">{error}</div>
//     );
//   }

//   const getStatusColor = (status) => {
//     return status === true || status === 'active' || status === 1
//       ? 'bg-green-100 text-green-800'
//       : 'bg-gray-100 text-gray-800';
//   };

//   const formatDate = (val) => {
//     if (!val) return '—';
//     const d = new Date(val);
//     if (Number.isNaN(d.getTime())) return String(val).slice(0,10);
//     return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
//   };

//   const getTypeColor = (type) => {
//     const colors = {
//       'NGO': 'bg-primary-100 text-primary-600',
//       'Corporate': 'bg-purple-100 text-purple-800',
//       'Health Organization': 'bg-red-100 text-red-800',
//     };
//     return colors[type] || 'bg-gray-100 text-gray-800';
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Partners</h1>
//           <p className="text-gray-600 mt-2">Manage partner organizations</p>
//         </div>
//         <Link
//           to="/partners/create"
//           className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
//         >
//           <PlusIcon className="h-5 w-5 mr-2" />
//           Add Partner
//         </Link>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
//               <UserGroupIcon className="h-5 w-5 text-primary-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Partners</p>
//               <p className="text-2xl font-bold">24</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
//               <UserGroupIcon className="h-5 w-5 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Active Partners</p>
//               <p className="text-2xl font-bold">22</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
//               <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">NGOs</p>
//               <p className="text-2xl font-bold">15</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center">
//             <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
//               <BuildingOfficeIcon className="h-5 w-5 text-yellow-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Corporates</p>
//               <p className="text-2xl font-bold">9</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Partners Table */}
//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <div className="px-4 py-5 sm:px-6">
//           <h3 className="text-lg leading-6 font-medium text-gray-900">Partner Organizations</h3>
//           <p className="mt-1 max-w-2xl text-sm text-gray-500">All partner organizations and their details</p>
//         </div>
//         <div className="border-t border-gray-200">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Since</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {partners.map((partner) => (
//                 <tr key={partner._id || partner.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-start">
//                       {partner.logo ? (
//                         <img src={partner.logo} alt={partner.name} className="h-12 w-12 rounded-lg object-cover mr-4" />
//                       ) : (
//                         <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
//                           <span className="text-primary-600 font-medium">{(partner.name || '').charAt(0)}</span>
//                         </div>
//                       )}
//                       <div className="flex-1">
//                         <div className="text-sm font-medium text-gray-900">{partner.name || '—'}</div>
//                         {partner.description && (
//                           <div className="text-sm text-gray-500 mt-1 max-w-xl">{partner.description}</div>
//                         )}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
//                     {partner.website ? (
//                       <a href={partner.website} target="_blank" rel="noreferrer" className="underline">
//                         {partner.website.replace(/^https?:\/\//, '')}
//                       </a>
//                     ) : '—'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {partner.contactPerson?.name || partner.contact || '—'}
//                     {partner.contactPerson?.email && (
//                       <div className="text-xs text-gray-500">{partner.contactPerson.email}</div>
//                     )}
//                     {!partner.contactPerson?.email && partner.email && (
//                       <div className="text-xs text-gray-500">{partner.email}</div>
//                     )}
//                     {!partner.contactPerson?.phone && partner.contact && (
//                       <div className="text-xs text-gray-500">{partner.contact}</div>
//                     )}
//                     {partner.contactPerson?.phone && (
//                       <div className="text-xs text-gray-500">{partner.contactPerson.phone}</div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(partner.isActive ?? partner.status)}`}>
//                       { (partner.isActive === true) ? 'Active' : (partner.isActive === false ? 'Inactive' : (partner.status ? (partner.status.charAt(0).toUpperCase() + partner.status.slice(1)) : '—')) }
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {formatDate(partner.partnershipStart || partner.since)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-2">
//                       <Link
//                         to={`/partners/edit/${partner._id || partner.id}`}
//                         className="text-primary-500 hover:text-primary-700"
//                       >
//                         <PencilIcon className="h-5 w-5" />
//                       </Link>
//                       <button
//                         className="text-red-600 hover:text-red-900"
//                         onClick={() => console.log('Delete partner', partner._id || partner.id)}
//                       >
//                         <TrashIcon className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Partners;
