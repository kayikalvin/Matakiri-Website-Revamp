import React from 'react';
import {
  FolderIcon,
  UserGroupIcon,
  NewspaperIcon,
  PhotoIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Projects',
    value: '24',
    icon: FolderIcon,
    color: 'bg-blue-500'
  },
  {
    name: 'Active Partners',
    value: '12',
    icon: UserGroupIcon,
    color: 'bg-green-500'
  },
  {
    name: 'News Articles',
    value: '18',
    icon: NewspaperIcon,
    color: 'bg-yellow-500'
  },
  {
    name: 'Gallery Items',
    value: '156',
    icon: PhotoIcon,
    color: 'bg-purple-500'
  },
  {
    name: 'Team Members',
    value: '8',
    icon: UsersIcon,
    color: 'bg-pink-500'
  }
];

const DashboardStats = ({ stats: apiStats }) => {
  // Use API stats if available, otherwise use default stats
  const displayStats = apiStats ? [
    {
      name: 'Total Projects',
      value: apiStats.totalProjects?.toString() || '0',
      icon: FolderIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Projects',
      value: apiStats.activeProjects?.toString() || '0',
      icon: FolderIcon,
      color: 'bg-green-500'
    },
    {
      name: 'AI Projects',
      value: apiStats.aiProjects?.toString() || '0',
      icon: FolderIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Beneficiaries',
      value: apiStats.totalBeneficiaries?.toLocaleString() || '0',
      icon: UsersIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Communities',
      value: apiStats.totalCommunities?.toString() || '0',
      icon: UserGroupIcon,
      color: 'bg-pink-500'
    }
  ] : stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {displayStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
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
