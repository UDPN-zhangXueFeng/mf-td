import { ModuleFederationConfig } from '@nx/rspack/module-federation';

const config: ModuleFederationConfig = {
  name: 'td-host',
  remotes: ['dashboard', 'todolist'],
  shared: (libraryName, sharedConfig) => {
    if (['react', 'react-dom','ant','@ant-design/icons'].includes(libraryName)) {
      return {
        singleton: true,
        eager: true,
        requiredVersion: false
      };
    }
    return sharedConfig;
  }
};

export default config;
