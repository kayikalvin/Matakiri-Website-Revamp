import React from 'react';
import { useAuth } from '../../context/AuthContext';
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
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Projects', href: '/projects', icon: FolderIcon },
    { name: 'Programs', href: '/programs', icon: FolderIcon },
    { name: 'Partners', href: '/partners', icon: UserGroupIcon },
    { name: 'News', href: '/news', icon: NewspaperIcon },
    { name: 'Gallery', href: '/gallery', icon: PhotoIcon },
    { name: 'Users', href: '/users', icon: UsersIcon, adminOnly: true },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, adminOnly: true },
  ].filter(item => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    return true;
  });

  return (
    <div className="flex flex-col h-0 flex-1 bg-soil-900 relative">
      {/* Woven texture overlay — 4% opacity, matches plan */}
      <div className="absolute inset-0 bg-woven opacity-40 pointer-events-none" />

      {/* Logo and collapse button */}
      <div className="relative flex items-center justify-between h-16 flex-shrink-0 px-4 border-b border-soil-700/50">
        {!collapsed ? (
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg text-parchment-50 font-medium">Matakiri</span>
            <span className="font-display text-lg text-laterite-500 font-medium">Admin</span>
          </div>
        ) : (
          <div className="mx-auto">
            <div className="h-8 w-8 bg-soil-700 rounded-sm flex items-center justify-center">
              <span className="font-display text-xs text-laterite-500">M</span>
            </div>
          </div>
        )}

        <button
          onClick={onCollapse}
          className="hidden md:block text-parchment-100/50 hover:text-parchment-50 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronDoubleRightIcon className="h-4 w-4 stroke-[1.5]" />
          ) : (
            <ChevronDoubleLeftIcon className="h-4 w-4 stroke-[1.5]" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="relative flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="flex-1 px-2 space-y-0.5">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => onNavigate && onNavigate()}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-soil-700/60 text-parchment-50 border-l-2 border-laterite-500'
                    : 'text-parchment-100/70 hover:text-parchment-50 hover:bg-soil-700/30 border-l-2 border-transparent'
                }`
              }
              title={collapsed ? item.name : ''}
            >
              <item.icon
                className={`flex-shrink-0 h-5 w-5 stroke-[1.5] ${
                  collapsed ? 'mx-auto' : 'mr-3'
                }`}
                aria-hidden="true"
              />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User section */}
      <div className="relative flex-shrink-0 border-t border-soil-700/50 p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-sm bg-soil-700 flex items-center justify-center">
              <span className="font-mono text-xs text-laterite-500 font-medium">
                {(user?.name || 'A').substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-parchment-50 truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-parchment-100/50 truncate font-mono">{user?.email || 'admin@matakiritrust.org'}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-sm bg-soil-700 flex items-center justify-center">
              <span className="font-mono text-xs text-laterite-500 font-medium">
                {(user?.name || 'A').substring(0, 1).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;