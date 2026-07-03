import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

/**
 * Standard filter bar with search input and configurable dropdowns.
 * 
 * @param {string} searchPlaceholder
 * @param {string} searchValue
 * @param {function} onSearchChange
 * @param {Array} filters - array of { key, label, value, onChange, options: [{ value, label }] }
 * @param {number} resultCount
 * @param {number} totalCount
 * @param {string} resultLabel - e.g. "projects", "partners"
 * @param {React.ReactNode} rightSlot - optional, e.g. "Create" button
 */
export default function FilterBar({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filters = [],
  resultCount,
  totalCount,
  resultLabel = 'items',
  rightSlot,
}) {
  return (
    <div className="bg-white border border-border p-5 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-border bg-parchment-50 text-sm text-ink-800 placeholder:text-ink-500 focus:outline-none focus:border-laterite-500 transition-colors"
          />
        </div>

        {/* Dropdown filters */}
        <div className="flex flex-wrap gap-3">
          {filters.map((f) => (
            <div key={f.key} className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
              <select
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className="pl-9 pr-4 py-2.5 border border-border bg-parchment-50 text-sm text-ink-800 appearance-none cursor-pointer focus:outline-none focus:border-laterite-500 transition-colors min-w-[150px]"
              >
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {rightSlot}
        </div>
      </div>

      {/* Results summary */}
      {(resultCount !== undefined || totalCount !== undefined) && (
        <div className="flex items-center justify-between text-xs font-mono text-ink-500">
          <span>
            Showing <span className="font-semibold text-ink-800">{resultCount}</span> of{' '}
            <span className="font-semibold text-ink-800">{totalCount}</span> {resultLabel}
          </span>
          <span>updated just now</span>
        </div>
      )}
    </div>
  );
}