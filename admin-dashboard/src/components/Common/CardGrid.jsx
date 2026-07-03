import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * CardGrid — responsive grid of cards.
 *
 * @param {Array} items - data items
 * @param {function} renderCard - (item, index) => ReactNode
 * @param {boolean} loading
 * @param {React.ReactNode} emptyState
 * @param {string} className
 */
const CardGrid = ({
  items = [],
  renderCard,
  loading = false,
  emptyState = null,
  className = '',
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-ink-500 text-sm font-mono gap-2">
        <ArrowPathIcon className="h-4 w-4 animate-spin" />
        loading records&hellip;
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16 text-ink-500 text-sm font-mono">
        {emptyState || 'no records found'}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {items.map((item, idx) => renderCard(item, idx))}
    </div>
  );
};

export default CardGrid;