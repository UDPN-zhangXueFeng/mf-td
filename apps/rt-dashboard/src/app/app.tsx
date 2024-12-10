import '../styles.css';
import '@mf-td/themes'; // 使用正确的路径别名
import { LibAntConfig } from '@mf-td/lib-ant-config';
import { LibEmpty } from '@mf-td/lib-empty';

export function App() {
  return (
    <LibAntConfig>
      <LibEmpty />
    </LibAntConfig>
  );
}

export default App;
