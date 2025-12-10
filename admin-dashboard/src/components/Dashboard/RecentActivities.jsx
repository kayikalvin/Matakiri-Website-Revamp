import React, { useEffect, useState } from 'react';
import { usersAPI, projectsAPI, newsAPI } from '../../services/api';

function timeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      setLoading(true);
      try {
        const [usersRes, projectsRes, newsRes] = await Promise.all([
          usersAPI.getAll({ limit: 3, sort: '-createdAt' }),
          projectsAPI.getAll({ limit: 3, sort: '-createdAt' }),
          newsAPI.getAll({ limit: 3, sort: '-createdAt' })
        ]);
        const userActs = (usersRes.data?.data || []).map(u => ({
          id: u._id,
          user: u.name || u.email || 'User',
          action: 'Registered as user',
          time: u.createdAt,
        }));
        const projectActs = (projectsRes.data?.data || []).map(p => ({
          id: p._id,
          user: p.createdBy?.name || 'Admin',
          action: `Created project: ${p.title}`,
          time: p.createdAt,
        }));
        const newsActs = (newsRes.data?.data || []).map(n => ({
          id: n._id,
          user: n.author?.name || 'Admin',
          action: `Published news: ${n.title}`,
          time: n.createdAt,
        }));
        const all = [...userActs, ...projectActs, ...newsActs]
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 6);
        setActivities(all);
      } catch (err) {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-4 sm:px-6 sm:py-5 flex items-center justify-between">
        <h3 className="text-lg leading-6 font-semibold text-gray-900">Recent Activities</h3>
        <div className="text-sm text-gray-500">{activities.length} items</div>
      </div>

      <div className="border-t border-gray-100">
        <div className="px-4 py-3">
          <div className="max-h-72 overflow-y-auto pr-2">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center space-x-4 animate-pulse">
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-2 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="w-12 h-3 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="text-gray-400 text-center py-6">No recent activities found.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {activities.map((activity) => (
                  <li
                    key={activity.id}
                    className="py-3 hover:bg-gray-50 px-2 rounded transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-semibold text-sm">{(activity.user || 'U').charAt(0)}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.user}</p>
                        <p className="text-sm text-gray-500 truncate">{activity.action}</p>
                      </div>
                      <div className="flex-shrink-0 text-xs text-gray-400 text-right">
                        <div>{timeAgo(activity.time)}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="px-4 py-2 border-t border-gray-100 text-right">
        <button className="text-sm text-primary-600 hover:text-primary-700">View all</button>
      </div>
    </div>
  );
};

export default RecentActivities;
