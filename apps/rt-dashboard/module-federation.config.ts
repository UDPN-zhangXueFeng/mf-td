import { ModuleFederationConfig } from '@nx/rspack/module-federation';

const config: ModuleFederationConfig = {
  name: 'dashboard',
  exposes: {
    './Module': './src/remote-entry.ts'
  },  
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

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
