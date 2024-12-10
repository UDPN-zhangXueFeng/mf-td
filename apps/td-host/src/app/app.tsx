import '@mf-td/themes'; // 使用正确的路径别名
import * as React from 'react';
import { LibAntConfig } from '@mf-td/lib-ant-config';
import { RouterProvider } from 'react-router-dom';
import { router } from '../routers/router';
import '../styles.css';

export function App() {
  return (
    <LibAntConfig>
      <RouterProvider router={router} />
    </LibAntConfig>
  );
}

export default App;
