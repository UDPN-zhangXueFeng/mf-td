import { composePlugins, withNx, withReact } from '@nx/rspack';
import {
  withModuleFederation,
} from '@nx/rspack/module-federation';

import baseConfig from './module-federation.config';

const config = {
  ...baseConfig,
};

export default composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(config, { dts: false }),
  (config) => {
    config.devServer = {
      proxy:[
        {
          context: ['/api'],
          target: 'http://10.0.7.110:1000',
          changeOrigin: true,
          pathRewrite: { '^/api': '' }
        }
      ]
    }
    return config;
  }
);
