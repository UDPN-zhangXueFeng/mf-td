import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
const TodoList = lazy(() => import('todolist/Module'));

const TodoListRoute: RouteObject = {
  path: 'todoList',
  element: <TodoList />
};

export default TodoListRoute;
