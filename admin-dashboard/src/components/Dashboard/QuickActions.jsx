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
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <Link
          key={action.title}
          to={action.href}
          className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-laterite-500/50 p-4 transition-colors"
        >
          <action.icon className="h-5 w-5 text-maize-400 mb-3" aria-hidden="true" />
          <h3 className="text-sm font-medium text-parchment-50">
            <span className="absolute inset-0" aria-hidden="true" />
            {action.title}
          </h3>
          <p className="mt-1 text-xs text-parchment-100/60">{action.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;