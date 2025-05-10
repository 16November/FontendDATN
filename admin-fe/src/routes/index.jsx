import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from './LandingPages';
import { adminRoutes } from '../admin/routes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  adminRoutes,
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
