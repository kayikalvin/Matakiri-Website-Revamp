import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * DataTable — consistent table for list views.
 * Uses mono font for data cells, rectangular borders, and ledger-like styling.
 *
 * @param {Array} columns - [ { key, header, render?, className? } ]
 * @param {Array} data - rows to display
 * @param {boolean} loading - show loading skeleton
 * @param {React.ReactNode} emptyState - rendered when no data and not loading
 * @param {string} keyField - unique field for row keys (default '_id')
 * @param {function} onRowClick - optional row click handler
 * @param {string} className - extra classes on wrapper
 */
const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyState = null,
  keyField = '_id',
  onRowClick,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`bg-white border border-border ${className}`}>
        <div className="flex items-center justify-center py-20 text-ink-500 text-sm font-mono gap-2">
          <ArrowPathIcon className="h-4 w-4 animate-spin" />
          loading records&hellip;
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`bg-white border border-border ${className}`}>
        {emptyState || (
          <div className="text-center py-16 text-ink-500 text-sm font-mono">
            no records found
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white border border-border overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-parchment-100 border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="py-3 px-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row) => (
              <tr
                key={row[keyField] || row.id}
                className={`hover:bg-parchment-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-3 px-4 text-sm font-mono text-ink-800 ${col.className || ''}`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;