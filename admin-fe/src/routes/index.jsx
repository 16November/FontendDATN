import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from './LandingPages';
import Login from './Login';
import Register from './Register';
import { adminRoutes } from '../admin/routes';
import userRoutes  from '../user/route';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path:'/Login',
    element: <Login />

  },
  {
    path:"/Register",
    element:<Register />
  },
  adminRoutes,
  userRoutes,
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
