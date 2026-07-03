import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const toneMap = {
  laterite: { ring: 'border-laterite-500/30', icon: 'text-laterite-500', bg: 'bg-laterite-50' },
  acacia:   { ring: 'border-acacia-500/30',   icon: 'text-acacia-500',   bg: 'bg-acacia-50' },
  maize:    { ring: 'border-maize-400/40',    icon: 'text-maize-500',    bg: 'bg-maize-50' },
};

const StatCard = ({ label, value, icon: Icon, delta, deltaLabel, loading, tone = 'laterite' }) => {
  const t = toneMap[tone] || toneMap.laterite;
  const isPositive = typeof delta === 'number' ? delta >= 0 : null;
  const showDelta = deltaLabel != null;

  return (
    <div className={`bg-white border ${t.ring} p-5 flex flex-col gap-3`}>
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${t.icon}`} strokeWidth={1.5} />
      </div>
      <div className="font-mono text-3xl text-ink-800 tabular-nums">
        {loading ? '—' : value ?? '—'}
      </div>
      {showDelta && (
        <div className={`inline-flex items-center gap-1 text-xs font-mono ${
          isPositive === null ? 'text-ink-500' : isPositive ? 'text-acacia-600' : 'text-laterite-600'
        }`}>
          {isPositive !== null && (isPositive ? (
            <ArrowTrendingUpIcon className="h-3 w-3" />
          ) : (
            <ArrowTrendingDownIcon className="h-3 w-3" />
          ))}
          {deltaLabel}
        </div>
      )}
    </div>
  );
};

export default StatCard;