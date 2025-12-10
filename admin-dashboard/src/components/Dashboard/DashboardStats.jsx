import React, { useEffect, useState } from 'react';
import {
  FolderIcon,
  UserGroupIcon,
  NewspaperIcon,
  PhotoIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { projectsAPI, partnersAPI, newsAPI, galleryAPI, usersAPI } from '../../services/api';

const DashboardStats = () => {
  const [stats, setStats] = useState({ loading: true });

  useEffect(() => {
    async function fetchStats() {
      setStats({ loading: true });
      try {
        const [projectStatsRes, partnersRes, newsRes, galleryRes, usersRes] = await Promise.all([
          projectsAPI.getStats(),
          partnersAPI.getAll({}),
          newsAPI.getAll({}),
          galleryAPI.getAll({}),
          usersAPI.getAll({})
        ]);
        const projectStats = projectStatsRes.data?.data || {};
        setStats({
          loading: false,
          totalProjects: projectStats.totalProjects || 0,
          activeProjects: projectStats.activeProjects || 0,
          aiProjects: projectStats.aiProjects || 0,
          totalBeneficiaries: projectStats.totalBeneficiaries || 0,
          totalCommunities: projectStats.totalCommunities || 0,
          partners: partnersRes.data?.count || 0,
          news: newsRes.data?.count || 0,
          gallery: galleryRes.data?.count || 0,
          users: usersRes.data?.count || 0,
        });
      } catch {
        setStats({ loading: false });
      }
    }
    fetchStats();
  }, []);

  const displayStats = [
    {
      name: 'Total Projects',
      value: stats.totalProjects?.toString() || '0',
      icon: FolderIcon,
      color: 'bg-primary-500'
    },
    {
      name: 'Active Projects',
      value: stats.activeProjects?.toString() || '0',
      icon: FolderIcon,
      color: 'bg-primary-400'
    },
    {
      name: 'AI Projects',
      value: stats.aiProjects?.toString() || '0',
      icon: FolderIcon,
      color: 'bg-primary-300'
    },
    {
      name: 'Beneficiaries',
      value: stats.totalBeneficiaries?.toLocaleString() || '0',
      icon: UsersIcon,
      color: 'bg-primary-200'
    },
    {
      name: 'Communities',
      value: stats.totalCommunities?.toString() || '0',
      icon: UserGroupIcon,
      color: 'bg-primary-100'
    },
    {
      name: 'Partners',
      value: stats.partners?.toString() || '0',
      icon: UserGroupIcon,
      color: 'bg-primary-100'
    },
    {
      name: 'News Articles',
      value: stats.news?.toString() || '0',
      icon: NewspaperIcon,
      color: 'bg-primary-100'
    },
    {
      name: 'Gallery Items',
      value: stats.gallery?.toString() || '0',
      icon: PhotoIcon,
      color: 'bg-primary-100'
    },
    {
      name: 'Team Members',
      value: stats.users?.toString() || '0',
      icon: UsersIcon,
      color: 'bg-primary-100'
    }
  ];

  if (stats.loading) {
    // show a grid of skeleton cards that match the layout
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-md shadow-sm p-4 animate-pulse">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-sm bg-gray-200" />
              <div className="ml-3 w-full">
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {displayStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow-sm rounded-md hover:shadow-md transition-shadow duration-150"
          >
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-sm bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-sm`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-xs font-semibold uppercase text-gray-400 tracking-wide truncate">
                      {stat.name}
                    </dt>
                    <dd className="mt-1 text-xl font-extrabold text-gray-900">
                      {Number(stat.value || 0).toLocaleString()}
                    </dd>
                    <dd className="text-sm text-gray-500 mt-1">&nbsp;</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
