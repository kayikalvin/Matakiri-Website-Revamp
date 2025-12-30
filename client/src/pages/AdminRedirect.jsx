import React, { useEffect } from 'react';

const AdminRedirect = ({ openInNewTab = false }) => {
  useEffect(() => {
    const url = process.env.REACT_APP_ADMIN_URL || 'http://localhost:3002';
    if (openInNewTab) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  }, [openInNewTab]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-700">Redirecting to admin dashboard...</p>
      </div>
    </div>
  );
};

export default AdminRedirect;
