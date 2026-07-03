import React from 'react';

const FieldLog = ({ entries, loading }) => {
  if (loading) {
    return (
      <div className="h-9 flex items-center px-4 bg-soil-900 text-parchment-100/60 font-mono text-xs tracking-wide">
        reading log&hellip;
      </div>
    );
  }
  if (!entries || entries.length === 0) {
    return (
      <div className="h-9 flex items-center px-4 bg-soil-900 text-parchment-100/60 font-mono text-xs tracking-wide">
        no recent entries
      </div>
    );
  }
  return (
    <div className="h-9 overflow-hidden bg-soil-900 relative">
      <div className="absolute inset-0 flex items-center whitespace-nowrap animate-ticker">
        {[...entries, ...entries].map((e, i) => (
          <span key={i} className="inline-flex items-center font-mono text-xs text-parchment-100/85 px-6 tracking-wide">
            <span className="text-maize-400 mr-2">›</span>
            {e}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FieldLog;