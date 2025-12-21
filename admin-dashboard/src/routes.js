import { lazy } from 'react';

// Lazy load components for better performance
const AdminLayout = lazy(() => import('./components/Layout/AdminLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));


// Projects
const Projects = lazy(() => import('./pages/Projects/Projects'));
const CreateProject = lazy(() => import('./pages/Projects/CreateProject'));
const EditProject = lazy(() => import('./pages/Projects/EditProject'));

// Programs
const Programs = lazy(() => import('./pages/Programs/Programs'));
const CreateProgram = lazy(() => import('./pages/Programs/CreateProgram'));
const EditProgram = lazy(() => import('./pages/Programs/EditProgram'));

// Partners
const Partners = lazy(() => import('./pages/Partners/Partners'));
const CreatePartner = lazy(() => import('./pages/Partners/CreatePartner'));
const EditPartner = lazy(() => import('./pages/Partners/EditPartner'));

// News
const News = lazy(() => import('./pages/News/News'));
const CreateNews = lazy(() => import('./pages/News/CreateNews'));
const EditNews = lazy(() => import('./pages/News/EditNews'));

// Gallery
const Gallery = lazy(() => import('./pages/Gallery/Gallery'));
const UploadMedia = lazy(() => import('./pages/Gallery/UploadMedia'));
const ViewMedia = lazy(() => import('./pages/Gallery/ViewMedia'));

// Users
const Users = lazy(() => import('./pages/Users/Users'));
const CreateUser = lazy(() => import('./pages/Users/CreateUser'));
const EditUser = lazy(() => import('./pages/Users/EditUser'));


// Settings
const Settings = lazy(() => import('./pages/Settings'));

export const routes = [
  {
    path: '/login',
    component: Login,
    isPublic: true,
    title: 'Login'
  }
  // Programs CRUD
 
];