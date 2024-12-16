/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItemProps, FormProps } from 'antd/lib/form';
import { MenuItemType } from 'antd/lib/menu/hooks/useItems';
import { SelectProps } from 'antd/lib/select';
import { TableProps } from 'antd/lib/table/InternalTable';
import type { ReactNode } from 'react';

export type ItemsProps = FormItemProps & {
  type: 'Input' | 'RangePicker';
};
export type ItemsProps1 = FormItemProps & {
  type: 'Select';
} & SelectProps;
export type actionClick_1 = (data: T, key: string) => void;
export type actionClick_2 = (
  data: T,
  key: string
) => Promise<{ data: { code?: string; [s: string]: any }; [s: string]: any }>;
export interface CustomTableProps<T = any> {
  shadow?: boolean;
  url: string;
  title?: ReactNode;
  extra?: ReactNode;
  form: FormProps & {
    items: (ItemsProps | ItemsProps1)[];
  };
  table: TableProps<T> & {
    actionsTip?: string;
    isCopy?: boolean;
    actions: (
      data: T
    ) => (MenuItemType & { confimStr?: string; key: string; limit?: string })[];
    actionClick: actionClick_1 | actionClick_2;
  };
}
