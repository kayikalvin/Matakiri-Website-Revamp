import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  MapPinIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  BeakerIcon,
  AcademicCapIcon,
  HeartIcon,
  GlobeAltIcon,
  CpuChipIcon,
  SparklesIcon,
  LightBulbIcon,
  PauseCircleIcon,
  ChartBarIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { projectsAPI } from '../services/api';

// ---------- SVG texture fallbacks ----------
// These replace grey backgrounds with actual patterns derived from the palette.
const LateriteCrack = () => (
  <div className="absolute inset-0 opacity-[0.08] bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M10,10 L25,15 L40,10 L50,30 L30,50 L10,40 Z\" fill=\"none\" stroke=\"%23B5522E\" stroke-width=\"0.5\"/%3E%3C/svg%3E')" }} />
);

const AcaciaScatter = () => (
  <div className="absolute inset-0 opacity-[0.05] bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"80\" height=\"80\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"20\" cy=\"25\" r=\"4\" fill=\"%234F7942\"/%3E%3Cellipse cx=\"60\" cy=\"65\" rx=\"6\" ry=\"2\" fill=\"%234F7942\"/%3E%3Ccircle cx=\"45\" cy=\"15\" r=\"3\" fill=\"%234F7942\"/%3E%3C/svg%3E')" }} />
);

const MaizeRowline = () => (
  <div className="absolute inset-0 opacity-[0.06] bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cline x1=\"0\" y1=\"20\" x2=\"40\" y2=\"20\" stroke=\"%23D6A62C\" stroke-width=\"1.5\"/%3E%3C/svg%3E')" }} />
);

// Choose a texture based on project category or just cycle
const getTextureComponent = (category) => {
  if (category === 'agriculture') return LateriteCrack;
  if (category === 'ai') return MaizeRowline;
  return AcaciaScatter;
};

// ---------- Stat item ----------
const StatItem = ({ value, label, colorClass }) => (
  <div className="text-center">
    <div className={`font-mono text-3xl md:text-4xl tabular-nums font-medium ${colorClass}`}>
      {value}
    </div>
    <div className="text-xs text-parchment-100/60 mt-1">{label}</div>
  </div>
);

// ---------- Filter pill ----------
const FilterPill = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono border transition-colors focus-visible:outline-2 focus-visible:outline-laterite-500 focus-visible:outline-offset-2 ${
      active
        ? 'border-laterite-500 text-laterite-600 bg-laterite-50'
        : 'border-border text-ink-500 hover:border-laterite-400'
    }`}
  >
    <Icon className="h-3.5 w-3.5" />
    {label}
  </button>
);

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const filters = {
    status: [
      { id: 'all', label: 'All Status', icon: GlobeAltIcon },
      { id: 'active', label: 'Active', icon: SparklesIcon },
      { id: 'completed', label: 'Completed', icon: ChartBarIcon },
      { id: 'planning', label: 'Planning', icon: LightBulbIcon },
      { id: 'paused', label: 'Paused', icon: PauseCircleIcon },
    ],
    category: [
      { id: 'all', label: 'All Categories', icon: FunnelIcon },
      { id: 'agriculture', label: 'Agriculture', icon: BeakerIcon },
      { id: 'education', label: 'Education', icon: AcademicCapIcon },
      { id: 'health', label: 'Health', icon: HeartIcon },
      { id: 'water', label: 'Water & Sanitation', icon: GlobeAltIcon },
      { id: 'ai', label: 'AI & Innovation', icon: CpuChipIcon },
      { id: 'community', label: 'Community', icon: UserGroupIcon },
    ],
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await projectsAPI.getAll();
        setProjects(response?.data || response || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to fetch projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === 'active').length,
    completed: projects.filter((p) => p.status === 'completed').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'acacia';
      case 'completed': return 'maize';
      case 'planning': return 'warning';
      case 'paused': return 'neutral';
      default: return 'neutral';
    }
  };

  const getCategoryIcon = (category) => {
    const found = filters.category.find((c) => c.id === category);
    return found ? found.icon : GlobeAltIcon;
  };

  return (
    <>
      <Helmet>
        <title>Our Projects – Matakiri Tumaini Centre</title>
        <meta
          name="description"
          content="Explore our innovative community development projects in Kenya."
        />
      </Helmet>

      {/* Hero – soil-950 for full-bleed dark, with signal accent line */}
      <section className="relative bg-soil-950 text-parchment-50 py-20 md:py-28">
        <div className="absolute top-0 left-0 right-0 h-1 bg-signal" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-maize-400 font-sans">
              Innovation in Action
            </span>
            <h1 className="font-display text-display-xl md:text-display-hero font-medium mt-3 mb-6">
              Our Projects
            </h1>
            <p className="text-parchment-100/70 max-w-xl mx-auto text-sm mb-10">
              Transforming communities through sustainable, tech‑enabled development.
            </p>
            <div className="flex justify-center gap-10">
              <StatItem value={stats.total} label="Total Projects" colorClass="text-laterite-400" />
              <StatItem value={stats.active} label="Active" colorClass="text-acacia-400" />
              <StatItem value={stats.completed} label="Completed" colorClass="text-maize-400" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-parchment-50 border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Search */}
          <div className="relative mb-8">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
            <input
              type="text"
              placeholder="Search projects, locations, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border border-border bg-white text-sm text-ink-800 placeholder:text-ink-400 outline-none focus-visible:ring-2 focus-visible:ring-laterite-500 focus-visible:ring-offset-2 transition-shadow"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 focus-visible:outline-2 focus-visible:outline-laterite-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Status pills + view toggle */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {filters.status.map((f) => (
                <FilterPill
                  key={f.id}
                  {...f}
                  active={selectedStatus === f.id}
                  onClick={() => setSelectedStatus(f.id)}
                />
              ))}
            </div>
            <div className="flex items-center bg-white border border-border p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-mono transition-colors focus-visible:outline-2 focus-visible:outline-laterite-500 ${
                  viewMode === 'grid' ? 'bg-parchment-50 border border-border text-ink-800' : 'text-ink-500'
                }`}
              >
                <Squares2X2Icon className="h-4 w-4 inline mr-1" /> Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-xs font-mono transition-colors focus-visible:outline-2 focus-visible:outline-laterite-500 ${
                  viewMode === 'list' ? 'bg-parchment-50 border border-border text-ink-800' : 'text-ink-500'
                }`}
              >
                <ListBulletIcon className="h-4 w-4 inline mr-1" /> List
              </button>
            </div>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {filters.category.map((f) => (
              <FilterPill
                key={f.id}
                {...f}
                active={selectedCategory === f.id}
                onClick={() => setSelectedCategory(f.id)}
              />
            ))}
          </div>

          {/* Results summary */}
          <div className="flex items-center justify-between mt-6 text-xs font-mono text-ink-500">
            <span>
              Showing <span className="font-semibold text-ink-800">{filteredProjects.length}</span> of{' '}
              <span className="font-semibold text-ink-800">{projects.length}</span> projects
            </span>
            {(selectedStatus !== 'all' || selectedCategory !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('all');
                  setSelectedCategory('all');
                }}
                className="text-laterite-500 hover:underline focus-visible:outline-2 focus-visible:outline-laterite-500"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Projects display – asymmetric grid with textures */}
      <section className="py-16 md:py-20 bg-parchment-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="text-center py-16 text-ink-500 font-mono text-sm">Loading projects…</div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-status-danger font-mono text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-laterite-500 underline text-xs"
              >
                Try again
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ink-500 font-mono text-sm">No projects found.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('all');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-laterite-500 text-xs underline"
              >
                Clear filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Asymmetric grid: first project spans 2 columns on lg, rest 2 columns */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
              {filteredProjects.map((project, index) => {
                const isFirst = index === 0;
                return (
                  <motion.article
                    key={project._id || project.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`bg-white border border-border hover:border-laterite-500/30 transition-colors overflow-hidden group ${
                      isFirst ? 'lg:col-span-2' : ''
                    }`}
                  >
                    <div className="aspect-video relative bg-soil-900/5 overflow-hidden">
                      {project.images?.[0] ? (
                        <img
                          src={typeof project.images[0] === 'string' ? project.images[0] : project.images[0].url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <>
                          {/* SVG texture fallback */}
                          {getTextureComponent(project.category)()}
                          <div className="absolute inset-0 flex items-center justify-center text-5xl font-mono text-ink-300/30">
                            {(project.title || '?')[0]}
                          </div>
                        </>
                      )}
                      {/* Status badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border ${
                            project.status === 'active'
                              ? 'bg-acacia-50 text-acacia-600 border-acacia-500/30'
                              : project.status === 'completed'
                              ? 'bg-maize-50 text-maize-600 border-maize-400/40'
                              : 'bg-ink-500/10 text-ink-500 border-border'
                          }`}
                        >
                          {project.status || 'Active'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-ink-500 font-mono">
                        {React.createElement(getCategoryIcon(project.category), { className: 'h-3.5 w-3.5' })}
                        {project.category?.charAt(0).toUpperCase() + project.category?.slice(1) || 'General'}
                      </div>
                      <h3 className="font-display text-lg font-medium text-ink-800 line-clamp-2 group-hover:text-laterite-600 transition-colors">
                        {project.title || 'Untitled Project'}
                      </h3>
                      <p className="text-ink-500 text-sm line-clamp-2">{project.description || ''}</p>
                      {project.location && (
                        <div className="flex items-center gap-1.5 text-xs text-ink-500">
                          <MapPinIcon className="h-3.5 w-3.5" />
                          {project.location}
                        </div>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            /* List view – asymmetric cards with image on left */
            <div className="space-y-4">
              {filteredProjects.map((project, index) => {
                const CategoryIcon = getCategoryIcon(project.category);
                return (
                  <motion.div
                    key={project._id || project.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white border border-border hover:border-laterite-500/30 transition-colors flex flex-col md:flex-row overflow-hidden group"
                  >
                    <div className="md:w-1/3 h-48 md:h-auto bg-soil-900/5 relative">
                      {project.images?.[0] ? (
                        <img
                          src={typeof project.images[0] === 'string' ? project.images[0] : project.images[0].url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          {getTextureComponent(project.category)()}
                          <div className="absolute inset-0 flex items-center justify-center text-5xl font-mono text-ink-300/30">
                            {(project.title || '?')[0]}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex-1 p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-ink-500 font-mono">
                        <CategoryIcon className="h-3.5 w-3.5" />
                        {project.category?.charAt(0).toUpperCase() + project.category?.slice(1) || 'General'}
                        <span className="mx-1">·</span>
                        <span
                          className={`text-[10px] font-semibold uppercase ${
                            project.status === 'active'
                              ? 'text-acacia-600'
                              : project.status === 'completed'
                              ? 'text-maize-600'
                              : 'text-ink-500'
                          }`}
                        >
                          {project.status || 'Active'}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-medium text-ink-800 group-hover:text-laterite-600 transition-colors">
                        {project.title || 'Untitled Project'}
                      </h3>
                      <p className="text-ink-500 text-sm line-clamp-2">{project.description || ''}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-ink-500 font-mono">
                        {project.location && (
                          <span className="flex items-center gap-1">
                            <MapPinIcon className="h-3.5 w-3.5" /> {project.location}
                          </span>
                        )}
                        {project.startDate && (
                          <span className="flex items-center gap-1">
                            <CalendarDaysIcon className="h-3.5 w-3.5" />{' '}
                            {new Date(project.startDate).getFullYear()}
                          </span>
                        )}
                        {project.beneficiaries && (
                          <span className="flex items-center gap-1">
                            <UserGroupIcon className="h-3.5 w-3.5" />{' '}
                            {parseInt(project.beneficiaries).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA – soil-950 with signal line */}
      <section className="relative bg-soil-950 text-parchment-50 py-16 md:py-20 text-center">
        <div className="absolute top-0 left-0 right-0 h-1 bg-signal" />
        <div className="container mx-auto px-4 relative z-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-maize-400 font-sans">
            Get Involved
          </span>
          <h2 className="font-display text-display-md md:text-display-lg font-medium mt-2 mb-4">
            Want to support a project?
          </h2>
          <p className="text-parchment-100/70 max-w-lg mx-auto text-sm mb-8">
            Your partnership helps us expand our impact and reach more communities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-laterite-500 hover:bg-laterite-600 text-white px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laterite-400"
            >
              Become a Partner <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-parchment-100/30 hover:border-laterite-500 text-parchment-50 px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parchment-50"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;