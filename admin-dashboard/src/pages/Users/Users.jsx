// import React from 'react';

// const Users = () => {
//   const users = [
//     { id: 1, name: 'Admin User', email: 'admin@matakiritrust.org', role: 'admin', status: 'active', lastLogin: '2024-01-20' },
//     { id: 2, name: 'Project Manager', email: 'manager@matakiritrust.org', role: 'manager', status: 'active', lastLogin: '2024-01-19' },
//     { id: 3, name: 'Content Editor', email: 'editor@matakiritrust.org', role: 'editor', status: 'active', lastLogin: '2024-01-18' },
//     { id: 4, name: 'Viewer User', email: 'viewer@matakiritrust.org', role: 'viewer', status: 'inactive', lastLogin: '2023-12-15' },
//     { id: 5, name: 'New User', email: 'new@matakiritrust.org', role: 'viewer', status: 'pending', lastLogin: 'Never' },
//   ];

//   const getRoleColor = (role) => {
//     switch (role) {
//       case 'admin': return 'bg-red-100 text-red-800';
//       case 'manager': return 'bg-blue-100 text-blue-800';
//       case 'editor': return 'bg-green-100 text-green-800';
//       case 'viewer': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'inactive': return 'bg-red-100 text-red-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Users</h1>
//           <p className="text-gray-600 mt-2">Manage system users and permissions</p>
//         </div>
//         <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//           Add User
//         </button>
//       </div>

//       {/* Users Table */}
//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 User
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Role
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Last Login
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10">
//                       <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                         <span className="text-blue-600 font-bold">{user.name.charAt(0)}</span>
//                       </div>
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                       <div className="text-sm text-gray-500">{user.email}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
//                     {user.role.toUpperCase()}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
//                     {user.status.toUpperCase()}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {user.lastLogin}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button className="text-blue-600 hover:text-blue-900 mr-3">
//                     Edit
//                   </button>
//                   <button className="text-red-600 hover:text-red-900">
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Empty State */}
//         {users.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">👥</div>
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No users yet</h3>
//             <p className="text-gray-600">Add your first user to get started</p>
//           </div>
//         )}
//       </div>

//       {/* User Roles Summary */}
//       <div className="mt-8">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">User Roles Summary</h3>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
//                 <span className="text-red-600 font-bold">A</span>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">Administrators</h4>
//                 <p className="text-2xl font-bold text-red-600">
//                   {users.filter(u => u.role === 'admin').length}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
//                 <span className="text-blue-600 font-bold">M</span>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">Managers</h4>
//                 <p className="text-2xl font-bold text-blue-600">
//                   {users.filter(u => u.role === 'manager').length}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
//                 <span className="text-green-600 font-bold">E</span>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">Editors</h4>
//                 <p className="text-2xl font-bold text-green-600">
//                   {users.filter(u => u.role === 'editor').length}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
//                 <span className="text-gray-600 font-bold">V</span>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">Viewers</h4>
//                 <p className="text-2xl font-bold text-gray-600">
//                   {users.filter(u => u.role === 'viewer').length}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Users;



import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PencilIcon, 
  TrashIcon, 
  UserPlusIcon,
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

const Users = () => {
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@matakiritrust.org', role: 'admin', status: 'active', createdAt: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@matakiritrust.org', role: 'editor', status: 'active', createdAt: '2024-01-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@matakiritrust.org', role: 'viewer', status: 'inactive', createdAt: '2024-02-01' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@matakiritrust.org', role: 'editor', status: 'active', createdAt: '2024-02-10' },
    { id: 5, name: 'David Brown', email: 'david@matakiritrust.org', role: 'admin', status: 'active', createdAt: '2024-02-15' },
  ]);

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
        </div>
        <Link
          to="/users/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add User
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <UserIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <ShieldCheckIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold">4</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <UserIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <UserIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Editors</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">User List</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">All registered users in the system</p>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/users/edit/${user.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => console.log('Delete user', user.id)}
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

export default Users;