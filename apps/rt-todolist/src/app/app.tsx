import '../styles.css';
import { LibAntConfig } from '@mf-td/lib-ant-config';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
export function App() {
  return (
    <LibAntConfig>
      <RouterProvider router={router} />
    </LibAntConfig>
  );
}

export default App;
