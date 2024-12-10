import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';
// 确保在最开始就导入样式文件
import '@mf-td/themes';

interface LibAntConfigProps {
  children: ReactNode;
}

export function LibAntConfig({ children }: LibAntConfigProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: getComputedStyle(document.documentElement)
            .getPropertyValue('--color-primary')
            .trim()
        },
        components: {
          Input: {
            activeBorderColor: 'var(--color-primary)',
            hoverBorderColor: 'var(--color-primary-light)'
          },
          Menu: {
            itemHoverBg: 'var(--color-primary-light-2)',
            itemSelectedColor: 'var(--color-primary)',
            itemSelectedBg: 'var(--color-primary-light)'
          }
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default LibAntConfig;
