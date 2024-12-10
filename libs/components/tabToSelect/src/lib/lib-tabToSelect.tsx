import React, { useState } from 'react';
import { Tabs, Select, Dropdown, Button } from 'antd';
import type { TabsProps } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import clsx from 'clsx';

interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  tag?: string;
  tagType?: 'besu' | 'cflr' | 'sepolia' | 'devnet';
}

interface TabToSelectProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

const TagColors = {
  besu: 'bg-teal-100 text-teal-700',
  cflr: 'bg-pink-100 text-pink-700',
  sepolia: 'bg-blue-100 text-blue-700',
  devnet: 'bg-gray-100 text-gray-700'
} as const;

const TabLabel: React.FC<{ item: TabItem }> = ({ item }) => (
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 flex items-center justify-center">{item.icon}</div>
    <span className="text-sm">{item.label}</span>
    {item.tag && (
      <span
        className={clsx(
          'px-1.5 py-0.5 text-xs font-medium rounded',
          TagColors[item.tagType || 'besu']
        )}
      >
        {item.tag}
      </span>
    )}
  </div>
);

export const LibTabToSelect: React.FC<TabToSelectProps> = ({
  items,
  activeKey,
  onChange,
  className
}) => {
  const [isTabMode, setIsTabMode] = useState(true);

  const tabItems: TabsProps['items'] = items.map((item) => ({
    key: item.key,
    label: <TabLabel item={item} />,
    children: item.children
  }));

  const selectOptions = items.map((item) => ({
    value: item.key,
    label: <TabLabel item={item} />
  }));

  const dropdownItems = {
    items: [
      {
        key: 'tabs',
        label: 'Tabs'
      },
      {
        key: 'dropdown',
        label: 'Dropdown Lists'
      }
    ],
    onClick: ({ key }: { key: string }) => {
      setIsTabMode(key === 'tabs');
    }
  };

  return (
    <div className={clsx('relative bg-white', className)}>
      {isTabMode ? (
        <div className="flex items-center border-b border-gray-200">
          <div className="flex-1 flex items-center overflow-x-auto">
            <div className="flex items-center">
              {tabItems.map((item) => (
                <div
                  key={item.key}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 cursor-pointer whitespace-nowrap',
                    'border-b-2 transition-colors',
                    item.key === activeKey
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-600 hover:text-primary'
                  )}
                  onClick={() => onChange(item.key)}
                >
                  {item.label}
                </div>
              ))}
            </div>
            <Dropdown menu={dropdownItems} placement="bottomRight">
              <Button
                type="text"
                icon={<EllipsisOutlined />}
                className="flex items-center justify-center w-8 h-8 ml-2 text-gray-500 hover:text-gray-700 shrink-0"
              />
            </Dropdown>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2">
          <Select
            className={clsx(
              'min-w-[240px]',
              '[&_.ant-select-selector]:h-10',
              '[&_.ant-select-selection-item]:flex',
              '[&_.ant-select-selection-item]:items-center'
            )}
            value={activeKey}
            onChange={onChange}
            options={selectOptions}
          />
          <Dropdown menu={dropdownItems} placement="bottomRight">
            <Button
              type="text"
              icon={<EllipsisOutlined />}
              className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700"
            />
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default LibTabToSelect;
