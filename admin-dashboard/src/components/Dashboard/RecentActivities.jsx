import React from 'react';

const RecentActivities = () => {
  const activities = [
    { id: 1, user: 'John Doe', action: 'Created new project', time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', action: 'Updated partner information', time: '4 hours ago' },
    { id: 3, user: 'Mike Johnson', action: 'Added news article', time: '1 day ago' },
    { id: 4, user: 'Sarah Wilson', action: 'Uploaded gallery image', time: '2 days ago' },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activities</h3>
        <div className="mt-5">
          <ul className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <li key={activity.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-700 font-semibold text-sm">{activity.user.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.user}</p>
                    <p className="text-sm text-gray-500 truncate">{activity.action}</p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">{activity.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
