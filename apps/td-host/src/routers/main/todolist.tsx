import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
const Edit = lazy(() => import('todolist/Module'));
const TodoList = lazy(() => import('todolist/Module'));
const TodoListRoute: RouteObject = {
  path: 'todoList',
  element: <TodoList />,
  children: [
      {
        path: 'edit',
        element: <Edit />
      }
    ]
};

export default TodoListRoute;
