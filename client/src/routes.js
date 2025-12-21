import { lazy } from 'react';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const Team = lazy(() => import('./pages/Team'));
const About = lazy(() => import('./pages/About'));
const Programs = lazy(() => import('./pages/Programs'));
const Projects = lazy(() => import('./pages/Projects'));
const AIProjects = lazy(() => import('./pages/AIProjects'));
const Partners = lazy(() => import('./pages/Partners'));
const News = lazy(() => import('./pages/News'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));

export const routes = [
  {
    path: '/',
    component: Home,
    title: 'Home'
  },
  {
    path: '/about',
    component: About,
    title: 'About'
  },
  {
    path: '/programs',
    component: Programs,
    title: 'Programs'
  },
  {
    path: '/projects',
    component: Projects,
    title: 'Projects'
  },
  {
    path: '/ai-projects',
    component: AIProjects,
    title: 'AI Projects'
  },
  {
    path: '/partners',
    component: Partners,
    title: 'Partners'
  },
  {
    path: '/news',
    component: News,
    title: 'News'
  },
  {
    path: '/gallery',
    component: Gallery,
    title: 'Gallery'
  },
  {
    path: '/contact',
    component: Contact,
    title: 'Contact'
  }
];

// Add Team page route
routes.splice(1, 0, {
  path: '/team',
  component: Team,
  title: 'Team'
});
