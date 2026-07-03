import React from 'react';

const variantMap = {
  // Ledger-tag colors using new status tokens
  success:  'bg-status-success/10 text-status-success border-status-success/30',
  warning:  'bg-status-warning/10 text-status-warning border-status-warning/30',
  danger:   'bg-status-danger/10 text-status-danger border-status-danger/30',
  neutral:  'bg-ink-500/10 text-ink-500 border-border',
  laterite: 'bg-laterite-100 text-laterite-700 border-laterite-500/30',
  acacia:   'bg-acacia-100 text-acacia-700 border-acacia-500/30',
  maize:    'bg-maize-100 text-maize-700 border-maize-400/40',
};

/**
 * Status badge — rectangular tag with left color bar.
 * @param {string} label  - text inside the badge
 * @param {string} variant - one of: success, warning, danger, neutral, laterite, acacia, maize
 * @param {string} className - additional classes
 */
export default function StatusBadge({ label, variant = 'neutral', className = '' }) {
  const colors = variantMap[variant] || variantMap.neutral;
  return (
    <span
      className={`inline-flex items-center pl-2 pr-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] border ${colors} ${className}`}
      style={{ borderLeftWidth: '3px' }}
    >
      {label}
    </span>
  );
}