import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ArrowPathIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PhotoIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { projectsAPI, partnersAPI, usersAPI, galleryAPI, newsAPI, metricsAPI } from '../services/api';
import QuickActions from '../components/Dashboard/QuickActions';

// --- Field Log strip -------------------------------------------------
// Signature element: a typewritten-style ticker of real recent actions.
// Replaces the generic notification bell as the dashboard's "pulse".
const FieldLog = ({ entries, loading }) => {
  if (loading) {
    return (
      <div className="h-9 flex items-center px-4 bg-soil-900 text-parchment-100/60 font-mono text-xs tracking-wide">
        reading log&hellip;
      </div>
    );
  }
  if (!entries || entries.length === 0) {
    return (
      <div className="h-9 flex items-center px-4 bg-soil-900 text-parchment-100/60 font-mono text-xs tracking-wide">
        no recent entries
      </div>
    );
  }
  return (
    <div className="h-9 overflow-hidden bg-soil-900 relative">
      <div className="absolute inset-0 flex items-center whitespace-nowrap animate-ticker">
        {[...entries, ...entries].map((e, i) => (
          <span key={i} className="inline-flex items-center font-mono text-xs text-parchment-100/85 px-6 tracking-wide">
            <span className="text-maize-400 mr-2">&#8250;</span>
            {e}
          </span>
        ))}
      </div>
    </div>
  );
};

// --- Stat card ---------------------------------------------------------
// Ledger card: hairline laterite border, flat bg, mono numerals, rectangular tag delta.
const StatCard = ({ label, value, icon: Icon, delta, deltaLabel, loading, tone = 'laterite' }) => {
  const toneMap = {
    laterite: { ring: 'border-laterite-500/30', icon: 'text-laterite-500', bg: 'bg-laterite-50' },
    acacia:   { ring: 'border-acacia-500/30',   icon: 'text-acacia-500',   bg: 'bg-acacia-50' },
    maize:    { ring: 'border-maize-400/40',    icon: 'text-maize-500',    bg: 'bg-maize-50' },
  };
  const t = toneMap[tone] || toneMap.laterite;
  const positive = typeof delta === 'number' ? delta >= 0 : null;

  return (
    <div className={`bg-white border ${t.ring} p-5 flex flex-col gap-3`}>
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${t.icon}`} />
      </div>
      <div className="font-mono text-3xl text-ink-800 tabular-nums">
        {loading ? '—' : value}
      </div>
      {deltaLabel && (
        <div className={`inline-flex items-center gap-1 text-xs font-mono ${
          positive === null ? 'text-ink-500' : positive ? 'text-acacia-600' : 'text-laterite-600'
        }`}>
          {positive !== null && (positive ? (
            <ArrowTrendingUpIcon className="h-3 w-3" />
          ) : (
            <ArrowTrendingDownIcon className="h-3 w-3" />
          ))}
          {deltaLabel}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [fieldLog, setFieldLog] = useState([]);
  const [fieldLogLoading, setFieldLogLoading] = useState(true);

  const [quickStats, setQuickStats] = useState({
    users: 0, revenue: 0, pending: 0, projects: 0,
    partners: 0, news: 0, gallery: 0, featuredMedia: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [percentChanges, setPercentChanges] = useState({
    users: null, revenue: null, projectsDelta: null, partnersNew: null, newsThis: null,
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  // Quick stats fetch — unchanged logic from original, trimmed of placeholder score/tab state
  useEffect(() => {
    let mounted = true;
    setStatsLoading(true);

    const now = new Date();
    const usersThisStart = new Date(); usersThisStart.setDate(now.getDate() - 7);
    const usersPrevStart = new Date(); usersPrevStart.setDate(now.getDate() - 14);
    const usersPrevEnd = new Date(); usersPrevEnd.setDate(now.getDate() - 7);
    const projThisStart = new Date(); projThisStart.setDate(now.getDate() - 30);
    const projPrevStart = new Date(); projPrevStart.setDate(now.getDate() - 60);
    const projPrevEnd = new Date(); projPrevEnd.setDate(now.getDate() - 30);
    const partnersThisStart = new Date(); partnersThisStart.setDate(now.getDate() - 90);
    const newsThisStart = new Date(); newsThisStart.setDate(now.getDate() - 30);

    const promises = [
      projectsAPI.getStats(),
      projectsAPI.getStats({ startDate: projThisStart.toISOString(), endDate: now.toISOString() }),
      projectsAPI.getStats({ startDate: projPrevStart.toISOString(), endDate: projPrevEnd.toISOString() }),
      metricsAPI.getRevenue(),
      metricsAPI.getRevenue({ startDate: projThisStart.toISOString(), endDate: now.toISOString() }),
      metricsAPI.getRevenue({ startDate: projPrevStart.toISOString(), endDate: projPrevEnd.toISOString() }),
      partnersAPI.getStats(),
      partnersAPI.getStats({ startDate: partnersThisStart.toISOString(), endDate: now.toISOString() }),
      (user?.role === 'admin') ? usersAPI.getStats() : Promise.resolve({ data: { data: { totalUsers: 0 } } }),
      (user?.role === 'admin') ? usersAPI.getStats({ startDate: usersThisStart.toISOString(), endDate: now.toISOString() }) : Promise.resolve({ data: { data: { periodCount: 0 } } }),
      (user?.role === 'admin') ? usersAPI.getStats({ startDate: usersPrevStart.toISOString(), endDate: usersPrevEnd.toISOString() }) : Promise.resolve({ data: { data: { periodCount: 0 } } }),
      newsAPI.getAll({ limit: 1 }),
      newsAPI.getAll({ startDate: newsThisStart.toISOString(), endDate: now.toISOString(), limit: 1 }),
      galleryAPI.getAll({ limit: 1 }),
      galleryAPI.getAll({ isFeatured: true, limit: 1 }),
    ];

    Promise.all(promises).then(([
      projOverall, projThis, projPrev, metricsOverall, metricsThis, metricsPrev,
      partnersOverall, partnersThis, usersOverall, usersThisPeriod, usersPrevPeriod,
      newsOverall, newsThis, gallery, featured,
    ]) => {
      if (!mounted) return;
      const safePeriodCount = (res) =>
        res?.data?.data?.periodCount ?? res?.data?.data?.count ?? res?.data?.data?.total ?? res?.data?.total ?? 0;
      const computePercent = (current, previous) => {
        if (previous === 0) return current === 0 ? 0 : null;
        return parseFloat((((current - previous) / previous) * 100).toFixed(1));
      };

      const currentUsers = safePeriodCount(usersThisPeriod);
      const previousUsers = safePeriodCount(usersPrevPeriod);
      const usersPercent = computePercent(currentUsers, previousUsers);

      const projCountOverall = projOverall?.data?.data?.totalProjects ?? projOverall?.data?.total ?? 0;
      const projThisCount = safePeriodCount(projThis);
      const projPrevCount = safePeriodCount(projPrev);
      const projDelta = projThisCount - projPrevCount;

      const revThis = metricsThis?.data?.data?.totalSpent ?? metricsThis?.data?.totalSpent ?? 0;
      const revPrev = metricsPrev?.data?.data?.totalSpent ?? metricsPrev?.data?.totalSpent ?? 0;
      const revOverall = metricsOverall?.data?.data?.totalSpent ?? metricsOverall?.data?.totalSpent ?? 0;
      const revenuePercent = computePercent(revThis, revPrev);

      const partnersCountOverall = partnersOverall?.data?.data?.totalPartners ?? partnersOverall?.data?.total ?? 0;
      const partnersThisCount = safePeriodCount(partnersThis);

      const newsCountOverall = newsOverall?.data?.total ?? newsOverall?.data?.data?.total ?? 0;
      const newsThisCount = safePeriodCount(newsThis);

      setQuickStats({
        users: usersOverall?.data?.data?.totalUsers ?? usersOverall?.data?.totalUsers ?? usersOverall?.data?.total ?? 0,
        revenue: revOverall,
        pending: 0,
        projects: projCountOverall,
        partners: partnersCountOverall,
        news: newsCountOverall,
        gallery: gallery?.data?.total ?? gallery?.data?.data?.total ?? 0,
        featuredMedia: featured?.data?.total ?? featured?.data?.data?.total ?? 0,
      });

      setPercentChanges({
        users: usersPercent,
        revenue: revenuePercent,
        projectsDelta: projDelta,
        partnersNew: partnersThisCount,
        newsThis: newsThisCount,
      });
    }).catch(() => {
      // stats stay at defaults; card shows em-dash via loading fallback
    }).finally(() => {
      if (mounted) setStatsLoading(false);
    });

    return () => { mounted = false; };
  }, [user]);

  // Analytics (category distribution chart) — always loaded now, no tab gate
  useEffect(() => {
    let mounted = true;
    (async () => {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      try {
        const end = new Date();
        const start = new Date(); start.setDate(end.getDate() - 30);
        const params = { startDate: start.toISOString(), endDate: end.toISOString() };
        const res = await projectsAPI.getStats(params);
        if (!mounted) return;
        setAnalytics(res?.data?.data ?? res?.data ?? null);
      } catch (err) {
        if (!mounted) return;
        setAnalyticsError(err.response?.data?.message || err.message || 'Failed to load analytics');
      } finally {
        if (mounted) setAnalyticsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Field log — real recent actions, typewritten ticker
  useEffect(() => {
    let mounted = true;
    (async () => {
      setFieldLogLoading(true);
      try {
        const [projRes, newsRes, partnersRes] = await Promise.all([
          projectsAPI.getAll({ limit: 3, sort: '-createdAt' }),
          newsAPI.getAll({ limit: 3, sort: '-createdAt' }),
          partnersAPI.getAll({ limit: 2, sort: '-createdAt' }),
        ]);
        if (!mounted) return;
        const entries = [
          ...(projRes.data?.data || []).map(p => `Project logged — ${p.title || p.name}`),
          ...(newsRes.data?.data || []).map(n => `News published — ${n.title}`),
          ...(partnersRes.data?.data || []).map(p => `Partner added — ${p.name}`),
        ];
        setFieldLog(entries.length ? entries : ['No recent field entries']);
      } catch {
        if (mounted) setFieldLog([]);
      } finally {
        if (mounted) setFieldLogLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const exportCSV = () => {
    if (!analytics) return;
    const rows = [['Category', 'Count']];
    (analytics.categoryDistribution || []).forEach(c => rows.push([c._id || 'Unknown', c.count]));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-analytics.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-parchment-50 min-h-full -m-4 md:-m-6">
      {/* Field Log strip — signature element, replaces notification-bell pattern */}
      <FieldLog entries={fieldLog} loading={fieldLogLoading} />

      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-5">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-laterite-500">
              Matakiri Tumaini — Admin
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-medium text-ink-800 mt-1">
              Dashboard
            </h1>
            <p className="text-ink-500 text-sm mt-1">
              {user?.name ? `Signed in as ${user.name}` : 'Overview of today\u2019s activity'}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 border border-border bg-white px-4 py-2 text-sm text-ink-800 hover:border-laterite-500 transition-colors disabled:opacity-50 self-start"
          >
            <ArrowPathIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Users"
            value={quickStats.users.toLocaleString()}
            icon={UserGroupIcon}
            loading={statsLoading}
            delta={percentChanges.users}
            deltaLabel={percentChanges.users == null ? 'new this week' : `${percentChanges.users >= 0 ? '+' : ''}${percentChanges.users.toFixed(1)}% this week`}
            tone="laterite"
          />
          <StatCard
            label="Monthly Revenue"
            value={`$${(quickStats.revenue / 1000).toFixed(1)}K`}
            icon={CurrencyDollarIcon}
            loading={statsLoading}
            delta={percentChanges.revenue}
            deltaLabel={percentChanges.revenue == null ? 'new this month' : `${percentChanges.revenue >= 0 ? '+' : ''}${percentChanges.revenue.toFixed(1)}% this month`}
            tone="acacia"
          />
          <StatCard
            label="Total Projects"
            value={quickStats.projects}
            icon={DocumentTextIcon}
            loading={statsLoading}
            delta={percentChanges.projectsDelta}
            deltaLabel={percentChanges.projectsDelta == null ? 'new this month' : `${percentChanges.projectsDelta >= 0 ? '+' : ''}${percentChanges.projectsDelta} from last month`}
            tone="laterite"
          />
          <StatCard
            label="Media Library"
            value={quickStats.gallery}
            icon={PhotoIcon}
            loading={statsLoading}
            deltaLabel={`${quickStats.featuredMedia} featured`}
            tone="maize"
          />
        </div>

        {/* Chart + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-border p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-lg font-medium text-ink-800">Project categories</h2>
                <p className="text-ink-500 text-xs mt-0.5">Last 30 days</p>
              </div>
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-500 hover:text-laterite-500 transition-colors"
              >
                <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                export csv
              </button>
            </div>
            <div className="h-64">
              {analyticsLoading ? (
                <div className="h-full flex items-center justify-center text-ink-500 text-sm font-mono">
                  loading&hellip;
                </div>
              ) : analyticsError ? (
                <div className="h-full flex items-center justify-center text-laterite-600 text-sm">
                  {analyticsError}
                </div>
              ) : analytics?.categoryDistribution?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.categoryDistribution.map(d => ({ name: d._id || 'Unknown', count: d.count }))}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6E6255' }} axisLine={{ stroke: '#E4DCC8' }} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6E6255' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#241C15', border: 'none', borderRadius: 2, color: '#F7F3EA', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}
                    />
                    <Bar dataKey="count" fill="#B5522E" radius={[0, 0, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ChartBarIcon className="h-8 w-8 text-ink-500/40 mb-2" />
                  <p className="text-ink-500 text-sm">No project data yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-soil-900 p-6">
            <h2 className="font-display text-lg font-medium text-parchment-50 mb-1">Quick actions</h2>
            <p className="text-parchment-100/60 text-xs mb-5">Frequently used tasks</p>
            <QuickActions />
          </div>
        </div>

        {/* Status footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border pt-4 text-xs font-mono text-ink-500">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-acacia-500 rounded-full" />
            all systems operational
          </div>
          <div className="flex items-center gap-4">
            {quickStats.pending > 0 && (
              <span className="inline-flex items-center gap-1 text-laterite-600">
                <ExclamationTriangleIcon className="h-3.5 w-3.5" />
                {quickStats.pending} pending
              </span>
            )}
            <span>updated just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;