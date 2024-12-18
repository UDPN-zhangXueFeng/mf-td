import { Navigate, RouteObject } from 'react-router-dom';
import MainGuardRoutes from '../guard/main.guard';
import DashboardRoute from './dashboard';
import TodoListRoute from './todolist';
export const MainRoute: RouteObject = {
  path: 'main',
  element: <MainGuardRoutes />,
  children: [
    {
      index: true,
      element: <Navigate to="dashboard" />
    },
    DashboardRoute,
    TodoListRoute,

  ]
};
