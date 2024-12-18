import { createBrowserRouter, RouteObject } from 'react-router-dom';
import NxWelcome from '../app/nx-welcome';
const routers: RouteObject = {
  path: '/main/todoList',
  element: <NxWelcome />,
};
export const router = createBrowserRouter([routers]);
