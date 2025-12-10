import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, ArrowUpTrayIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const actions = [
  { title: 'Create Project', description: 'Add new community project', icon: PlusIcon, href: '/projects/create' },
  { title: 'Add Partner', description: 'Register new partner organization', icon: UserPlusIcon, href: '/partners/create' },
  { title: 'Post News', description: 'Publish news article', icon: PencilIcon, href: '/news/create' },
  { title: 'Upload Media', description: 'Add images to gallery', icon: ArrowUpTrayIcon, href: '/gallery/upload' },
];

const QuickActions = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className="group relative bg-white p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-primary-100 hover:border-primary-500 transition-colors"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-700 ring-4 ring-white">
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                {action.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
