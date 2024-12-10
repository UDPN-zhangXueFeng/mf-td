/*
 * @Author: zhangxuefeng
 * @Date: 2024-05-23 16:05:15
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-06-19 16:10:38
 * @Description:
 */
import { Header } from 'antd/es/layout/layout';
import { UserOutlined } from '@ant-design/icons';
import { theme as antTheme } from 'antd';
import { ReactNode } from 'react';
import User from '../user/user';

export interface HeaderProps {
  collapsed?: boolean;
  toggle?: () => void;
  logo?: ReactNode;
  title?: ReactNode;
  topMenu?: ReactNode;
  user?: ReactNode;
  isShowUser?: boolean;
}

export function HeaderComponent(props: HeaderProps) {
  const token = antTheme.useToken();
  /**
   * 如果后续开发菜单展开和点击菜单展开合并处理；处理以下两个参数
   */
  const {
    collapsed,
    toggle,
    logo,
    title,
    topMenu,
    isShowUser = true,
    user
  } = props;

  const mystyle = {
    background: `linear-gradient(to right, var(--color-primary-light), var(--color-primary))`
  };
  // const mystyle = {
  //   background: `linear-gradient(to right, #A1EADC, #1C857B)`
  // };
  return (
    <Header className="flex justify-between items-center" style={mystyle}>
      <div className="flex justify-start space-x-5">
        {/* 菜单logo更改 */}
        <div className="flex flex-col justify-center items-center">
          {logo ? (
            logo
          ) : (
            <img
              src="../assets/logo/logo.svg"
              alt=""
              className="w-[9.375rem]"
            />
          )}
        </div>

        {/* 分隔线 */}
        <div className="h-6 w-0.5 bg-[var(--color-primary-text)] self-center" />

        {/* 菜单标题 */}
        <div className="flex flex-col items-center justify-center">
          {title ? (
            title
          ) : (
            <span
              className="font-semibold text-3xl font-sans"
              style={{ color: 'var(--color-primary-text)' }}
            >
              Tokenized Deposit/Stablecoin Management System
            </span>
          )}
        </div>
        {/* 菜单标题 */}
      </div>

      {/* 菜单展开关闭切换 */}
      <div className="flex justify-start items-center">
        {/* <div onClick={toggle}>
          <span id="sidebar-trigger">
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </div> */}
        {/* 顶部退出 */}
        {topMenu ? topMenu : <div></div>}
        {isShowUser ? (
          <div className="actions ml-[5rem]">
            {user}
            {/* <span className="ml-2">
              {useAppSelector(
                (state) => state.userInfoSlice.userInfo['userName']
              )}
            </span> */}
          </div>
        ) : (
          ''
        )}

        {/* 顶部退出 */}
      </div>
      {/* 菜单展开关闭切换 */}
    </Header>
  );
}

export default HeaderComponent;
