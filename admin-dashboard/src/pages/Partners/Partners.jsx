// import React from 'react';

// const Partners = () => {
//   const partners = [
//     { id: 1, name: 'Tech Solutions Ltd', type: 'corporate', status: 'active', contact: 'John Doe' },
//     { id: 2, name: 'Green Earth NGO', type: 'ngo', status: 'active', contact: 'Jane Smith' },
//     { id: 3, name: 'County Government', type: 'government', status: 'active', contact: 'Mike Johnson' },
//     { id: 4, name: 'Farmers Cooperative', type: 'community', status: 'pending', contact: 'Sarah Williams' },
//     { id: 5, name: 'Education First', type: 'ngo', status: 'inactive', contact: 'Robert Brown' },
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'inactive': return 'bg-red-100 text-red-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getTypeColor = (type) => {
//     switch (type) {
//       case 'corporate': return 'bg-blue-100 text-blue-800';
//       case 'ngo': return 'bg-purple-100 text-purple-800';
//       case 'government': return 'bg-indigo-100 text-indigo-800';
//       case 'community': return 'bg-teal-100 text-teal-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Partners</h1>
//           <p className="text-gray-600 mt-2">Manage partner organizations</p>
//         </div>
//         <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//           Add Partner
//         </button>
//       </div>

//       {/* Partners Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {partners.map((partner) => (
//           <div key={partner.id} className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
//                   <div className="flex items-center space-x-2 mt-2">
//                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(partner.type)}`}>
//                       {partner.type.toUpperCase()}
//                     </span>
//                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(partner.status)}`}>
//                       {partner.status.toUpperCase()}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <span className="text-blue-600 font-bold text-xl">{partner.name.charAt(0)}</span>
//                 </div>
//               </div>
              
//               <div className="space-y-3">
//                 <div className="flex items-center text-sm text-gray-600">
//                   <span className="mr-2">👤</span>
//                   <span>Contact: {partner.contact}</span>
//                 </div>
                
//                 <div className="flex space-x-2 pt-4 border-t">
//                   <button className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
//                     View Details
//                   </button>
//                   <button className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
//                     Edit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Empty State */}
//       {partners.length === 0 && (
//         <div className="text-center py-12">
//           <div className="text-6xl mb-4">🤝</div>
//           <h3 className="text-xl font-medium text-gray-900 mb-2">No partners yet</h3>
//           <p className="text-gray-600">Add your first partner organization to get started</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Partners;



import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  GlobeAltIcon,
  PhoneIcon,
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline';

import { useEffect } from 'react';
import { partnersAPI } from '../../services/api';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await partnersAPI.getAll();
        // API returns { success, data: [...] }, accept either shape
        const payload = res.data && res.data.data ? res.data.data : res.data;
        setPartners(Array.isArray(payload) ? payload : []);
        console.log(res);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load partners');
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 text-center text-red-500">{error}</div>
    );
  }

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      'NGO': 'bg-primary-100 text-primary-600',
      'Corporate': 'bg-purple-100 text-purple-800',
      'Health Organization': 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Partners</h1>
          <p className="text-gray-600 mt-2">Manage partner organizations</p>
        </div>
        <Link
          to="/partners/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Partner
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <UserGroupIcon className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Partners</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <UserGroupIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Partners</p>
              <p className="text-2xl font-bold">22</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">NGOs</p>
              <p className="text-2xl font-bold">15</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <BuildingOfficeIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Corporates</p>
              <p className="text-2xl font-bold">9</p>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Partner Organizations</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">All partner organizations and their details</p>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Since</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {partners.map((partner) => (
                <tr key={partner._id || partner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      {partner.logo ? (
                        <img src={partner.logo} alt={partner.name} className="h-12 w-12 rounded-lg object-cover mr-4" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                          <span className="text-primary-600 font-medium">{(partner.name || '').charAt(0)}</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{partner.name || '—'}</div>
                        {partner.description && (
                          <div className="text-sm text-gray-500 mt-1 max-w-xl">{partner.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                    {partner.website ? (
                      <a href={partner.website} target="_blank" rel="noreferrer" className="underline">
                        {partner.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {partner.contact || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(partner.status)}`}>
                      {partner.status ? (partner.status.charAt(0).toUpperCase() + partner.status.slice(1)) : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {partner.since || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/partners/edit/${partner._id || partner.id}`}
                        className="text-primary-500 hover:text-primary-700"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => console.log('Delete partner', partner._id || partner.id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Partners;