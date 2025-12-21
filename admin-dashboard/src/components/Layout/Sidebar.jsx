import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon,
  FolderIcon,
  UserGroupIcon,
  NewspaperIcon,
  PhotoIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ collapsed, onCollapse, onNavigate }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Projects', href: '/projects', icon: FolderIcon },
    { name: 'Programs', href: '/programs', icon: FolderIcon },
    { name: 'Partners', href: '/partners', icon: UserGroupIcon },
    { name: 'News', href: '/news', icon: NewspaperIcon },
    { name: 'Gallery', href: '/gallery', icon: PhotoIcon },
    { name: 'Users', href: '/users', icon: UsersIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex flex-col h-0 flex-1 bg-gray-800">
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-gray-900">
        {!collapsed ? (
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary-600 rounded-md"></div>
            <h1 className="ml-3 text-white text-lg font-semibold">Matakiri Admin</h1>
          </div>
        ) : (
          <div className="mx-auto">
            <div className="h-8 w-8 bg-primary-600 rounded-md"></div>
          </div>
        )}
        
        {/* Collapse button - only show on desktop */}
        <button
          onClick={onCollapse}
          className="hidden md:block text-gray-400 hover:text-white focus:outline-none"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronDoubleRightIcon className="h-5 w-5" />
          ) : (
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => onNavigate && onNavigate()}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              title={collapsed ? item.name : ''}
            >
              <item.icon
                className={`flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300 ${
                  collapsed ? 'mx-auto' : 'mr-3'
                }`}
                aria-hidden="true"
              />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User profile - only show when not collapsed */}
      {!collapsed && (
        <div className="flex-shrink-0 flex bg-gray-700 p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs font-medium text-gray-300">admin@matakiritrust.org</p>
            </div>
          </div>
        </div>
      )}

      {/* Mini user profile when collapsed */}
      {collapsed && (
        <div className="flex-shrink-0 flex bg-gray-700 p-2 justify-center">
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
