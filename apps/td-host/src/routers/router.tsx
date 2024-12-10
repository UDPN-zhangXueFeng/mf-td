import { createBrowserRouter } from 'react-router-dom';
import { LoginRoute } from './login/login';
import { MainRoute } from './main/main';
// import { MainRoute } from './main/main';
export const router = createBrowserRouter([LoginRoute, MainRoute]);
