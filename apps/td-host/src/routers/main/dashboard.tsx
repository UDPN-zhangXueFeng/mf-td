import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Dashboard = lazy(() => import('dashboard/Module'));

const DashboardRoute: RouteObject = {
  path: 'dashboard',
  element: <Dashboard />
};

export default DashboardRoute;
