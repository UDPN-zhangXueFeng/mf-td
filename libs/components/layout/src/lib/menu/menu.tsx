/*
 * @Author: zhangxuefeng
 * @Date: 2024-05-24 14:05:34
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2024-06-14 14:43:00
 * @Description:
 */

import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
// import { CustomIcon } from '../icon/icon';
// import { MenuList } from '@udpn/reduxs';
import { useEffect } from 'react';
import { theme as antTheme } from 'antd';
// import { useHook } from '@udpn/hooks';
import { CustomIcon } from '../icon/icon';

interface MenuItem {
  /** menu item code */
  code: string;
  /** menu labels */
  label: {
    zh_CN: string;
    en_US: string;
  };
  /** 图标名称
   *
   * 子子菜单不需要图标
   */
  icon?: string;
  /** 菜单路由 */
  path: string;
  /** 菜单权限 */
  readonly permissions: string;
  /** 子菜单 */
  children?: MenuItem[];
}
// type MenuChild = Omit<MenuItem, 'children'>;
export type MenuList = MenuItem[];

export interface MenuProps {
  menuList: MenuList;
  openKey?: string;
  onChangeOpenKey: (key?: string) => void;
  selectedKey: string;
  onChangeSelectedKey: (key: string) => void;
}

export function MenuComponent(props: MenuProps) {
  const {
    menuList,
    openKey,
    onChangeOpenKey,
    selectedKey,
    onChangeSelectedKey
  } = props;
  const navigate = useNavigate();
  const token = antTheme.useToken();
  // const { t } = useHook('main-layout');
  const location = useLocation();

  useEffect(() => {
    setIconColor();
  }, []);

  useEffect(() => {
    setIconColor();
  }, [location.pathname]);

  const getTitle = (menu: MenuList[0]) => {
    const label = menu.label['en_US'];
    return (
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <CustomIcon
          type={menu.icon ? `${menu.icon}.svg` : ''}
          className="mr-1"
        />
        <span>{label}</span>
      </span>
    );
  };

  const setIconColor = () => {
    setTimeout(() => {
      const ss = document.getElementsByClassName('layout-page-sider-menu');
      const ss1 = ss[0].querySelectorAll('li');
      const ss3 = ss[0].querySelectorAll('svg');
      ss3.forEach((item) => {
        item.setAttribute('fill', '');
      });
      ss1.forEach((item) => {
        if (item.classList.value.indexOf('ant-menu-item-selected') > 0) {
          if (item.querySelectorAll('svg').length > 0) {
            item
              .querySelector('svg')
              ?.setAttribute('fill', token.token.colorPrimary);
          } else {
            const ss2 = item.parentNode?.parentNode?.querySelector('svg');
            ss2?.setAttribute('fill', token.token.colorPrimary);
          }
        }
      });
    }, 100);
  };

  const onMenuClick = (path: string, dom: any) => {
    if (/^https?:\/\/.+/.test(path)) {
      window.open(path);
      return;
    }
    if (/^assets/.test(path)) {
      window.open(window.location.origin + '/' + path);
      return;
    }
    onChangeSelectedKey(path);
    navigate(path);
    setIconColor();
  };

  const onOpenChange = (keys: string[]) => {
    const key = keys.pop();

    onChangeOpenKey(key);
  };

  const onclickItem = (path: any) => {
    if (/^https?:\/\/.+/.test(path)) {
      return;
    }
    if (/^assets/.test(path)) {
      return;
    }
    navigate(path[0]);
  };
  return (
    <div className="h-[calc(100vh-135px)] overflow-y-auto">
      <Menu
        mode="inline"
        onClick={(k) => onclickItem(k.keyPath)}
        selectedKeys={[selectedKey]}
        openKeys={openKey ? [openKey] : []}
        // openKeys={['authorized']}
        onOpenChange={onOpenChange}
        onSelect={(k) => onMenuClick(k.key, k.domEvent)}
        className="layout-page-sider-menu text-2"
        items={menuList.map((menu) => {
          return menu.children
            ? {
                key: menu.code,
                label: getTitle(menu),
                children: menu.children.map((child) => ({
                  key: child.path,
                  label: child.label['en_US']
                }))
              }
            : {
                key: menu.path,
                label: getTitle(menu)
              };
        })}
      ></Menu>
    </div>
  );
}

export default MenuComponent;
