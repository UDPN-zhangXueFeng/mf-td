import '../styles.css';
import { ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import { Breadcrumb, Layout, theme as antTheme } from 'antd';
import HeaderComponent from './header/header';
import MenuComponent from './menu/menu';
import {
  Link,
  Outlet,
  useLocation,
  useMatches,
  useOutlet
} from 'react-router-dom';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

export interface LayoutProps {
  logo?: ReactNode;
  title?: ReactNode;
  topMenu?: ReactNode;
  user?: ReactNode;
}
export const MenuLists: any = [
  {
    code: 'dashboard',
    label: {
      zh_CN: '首页',
      en_US: 'Dashboard'
    },
    icon: 'wodeyingyong',
    path: '/main/dashboard',
    permissions: '0'
  },
  {
    code: 'todoList',
    label: {
      zh_CN: '代办事项',
      en_US: 'To Do List'
    },
    icon: 'fabujilu',
    path: '/main/todoList',
    permissions: '1'
  },
  {
    code: 'authorized',
    label: {
      zh_CN: '授权铸币管理',
      en_US: 'Authorized Minter Management'
    },
    icon: 'lianheyingyong',
    path: '/main/authorized',
    permissions: '2',
    children: [
      {
        code: 'onboardingManagement',
        label: {
          zh_CN: 'onbaring 管理',
          en_US: 'Onboarding Management'
        },
        path: '/main/authorized/onboarding',
        permissions: '2-1'
      },
      {
        code: 'authorizedMinterManagement',
        label: {
          zh_CN: '授权铸币管理子项',
          en_US: 'Authorized Minter Management'
        },
        path: '/main/authorized/minter',
        permissions: '2-2'
      }
    ]
  },
  {
    code: 'stablecoin',
    label: {
      zh_CN: '稳定币管理',
      en_US: 'Stablecoin Administration'
    },
    icon: 'wendingbi',
    path: '/main/stablecoin',
    permissions: '1'
  },
  {
    code: 'wallet',
    label: {
      zh_CN: '钱包管理',
      en_US: 'Wallet Management'
    },
    icon: 'qianbao',
    path: '/main/wallet',
    permissions: '2',
    children: [
      {
        code: 'whitelistManagement',
        label: {
          zh_CN: '白名单管理',
          en_US: 'Whitelist Management'
        },
        path: '/main/wallet/whiteList',
        permissions: '2-1'
      },
      {
        code: 'userWalletManagement',
        label: {
          zh_CN: '用户钱包管理',
          en_US: 'User Wallet Management'
        },
        path: '/main/wallet/walletUser',
        permissions: '2-2'
      }
    ]
  },
  {
    code: 'controlMonit',
    label: {
      zh_CN: '控制与监控',
      en_US: 'Control & Monitoring'
    },
    icon: 'kongzhi',
    path: '/main/controlMonit',
    permissions: '2',
    children: [
      {
        code: 'ruleSettings',
        label: {
          zh_CN: '规则设置',
          en_US: 'Rule Settings'
        },
        path: '/main/controlMonit/rule',
        permissions: '2-1'
      },
      {
        code: 'suspiciousActivityList',
        label: {
          zh_CN: '可疑活动清单',
          en_US: 'Transaction Monitoring List'
        },
        path: '/main/controlMonit/suspicious',
        permissions: '2-2'
      }
    ]
  },
  {
    code: 'auditReport',
    label: {
      zh_CN: '审计与报告',
      en_US: 'Audit & Report'
    },
    icon: 'shengji',
    path: '/main/auditReport',
    permissions: '1'
  },
  {
    code: 'settings',
    label: {
      zh_CN: '系统设置',
      en_US: 'System Settings'
    },
    icon: 'xitong',
    path: '/main/settings',
    permissions: '2',
    children: [
      {
        code: 'nodeManagement',
        label: {
          zh_CN: '节点管理',
          en_US: 'Node Management'
        },
        path: '/main/settings/node',
        permissions: '2-1'
      },
      {
        code: 'wokflowManagement',
        label: {
          zh_CN: 'wokflow 管理',
          en_US: 'Workflow Management'
        },
        path: '/main/settings/wokflow',
        permissions: '2-2'
      },
      {
        code: 'smartContractManagement',
        label: {
          zh_CN: '只能合约管理',
          en_US: 'Smart Contract Management'
        },
        path: '/main/settings/smart',
        permissions: '2-2'
      }
    ]
  },
  {
    code: 'bank',
    label: {
      zh_CN: '银行管理',
      en_US: 'Bank Management'
    },
    icon: 'yinhang',
    path: '/main/bank',
    permissions: '1'
  },
  {
    code: 'system',
    label: {
      zh_CN: '系统管理',
      en_US: 'System Management'
    },
    icon: 'yonhu',
    path: '/main/system',
    permissions: '2',
    children: [
      {
        code: 'userManagement',
        label: {
          zh_CN: '用户管理',
          en_US: 'User Management'
        },
        path: '/main/system/user',
        permissions: '2-1'
      },
      {
        code: 'roleManagement',
        label: {
          zh_CN: '角色管理',
          en_US: 'Role Management'
        },
        path: '/main/system/role',
        permissions: '2-2'
      }
    ]
  }
];

export function LibLayout(props: LayoutProps) {
  const { logo, title, topMenu, user } = props;
  const currentOutlet = useOutlet();
  const nodeRef = useRef(null);
  /**
   * 如果menuList是动态获取
   */
  const collapsed = false;
  const location = useLocation();
  const [openKey, setOpenkey] = useState<string>();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
  const [breadcrumb, setBreadcrumb] = useState<ReactNode>(
    <Breadcrumb
      items={[
        {
          title: 'Home'
        }
      ]}
    />
  );
  const token = antTheme.useToken();
  // const { t } = useHook('main-layout');
  // const dispatch = useAppDispatch();
  // const allPath =
  //   useAppSelector((state) => state.permissionSlice.pathArr) || [];
  // // 处理菜单栏展开/合起
  const toggle = () => {
    console.log('toggle');
  };

  // const key = useAppSelector((state) => state.permissionSlice.openKey);
  // const selectedKeys = useAppSelector(
  //   (state) => state.permissionSlice.selectedKey
  // );
  // useEffect(() => {
  //   if (allPath.includes(location.pathname)) {
  //     const path1 = location.pathname.replace('/main', '');

  //     const code = getFirstPathCode(path1);

  //     setOpenkey(code);
  //     // 配置第二个‘/’，然后删除之前字符
  //     // setSelectedKey(path.replace(/\/.+\//, ''));
  //     setSelectedKey(location.pathname);
  //     dispatch(
  //       setOpenKeyAndSelectedKey({
  //         openKey: code,
  //         selectedKey: location.pathname
  //       } as any)
  //     );
  //   } else {
  //     setOpenkey(key);
  //     setSelectedKey(selectedKeys);
  //   }
  //   // 设置面包屑
  //   setBreadcrumbs();
  // }, [location.pathname]);

  const match = useMatches();
  const setBreadcrumbs = () => {
    const newArr = match.filter((item) => {
      return item.handle !== undefined;
    });
    const items: any = [];
    newArr.forEach((item, i) => {
      items.push({
        title: <Link to={item.pathname}>{item.handle as string}</Link>
      });
    });
    setBreadcrumb(<Breadcrumb items={items} />);
  };

  return (
    // <Ldle isOpen={true}>
    <Layout className="h-[100vh]">
      <HeaderComponent
        collapsed={collapsed}
        toggle={toggle}
        logo={logo}
        title={title}
        topMenu={topMenu}
        user={user}
      />
      <Layout>
        <Sider
          className="layout-page-sider shadow"
          trigger={null}
          collapsible
          style={{ backgroundColor: token.token.colorBgContainer }}
          collapsedWidth={80}
          collapsed={collapsed}
          breakpoint="md"
          width={300}
        >
          {/* <div className="flex justify-center items-center min-h-[3.125rem]">
            <span className="font-semibold text-base">
              Welcome
              <span className="ml-2">
                {useAppSelector(
                  (state) => state.userInfoSlice.userInfo['userName']
                )}
                12123123
              </span>
            </span>
          </div> */}
          <div className="h-[1.125rem]"></div>
          <MenuComponent
            menuList={MenuLists}
            openKey={openKey}
            onChangeOpenKey={(k) => setOpenkey(k)}
            selectedKey={selectedKey}
            onChangeSelectedKey={(k) => setSelectedKey(k)}
          />
        </Sider>
        <Content className="layout-page-content">
          <div className="h-[50px] bg-white flex justify-start items-center px-6 shadow">
            {breadcrumb}
          </div>
          {/* <TagsView /> */}
          <Suspense fallback={null}>
            {/* <SwitchTransition mode="out-in">
              <CSSTransition
                key={location.key}
                timeout={300}
                classNames="layout-main-page"
                nodeRef={null}
              > */}
            <div
              className="px-2 py-2 h-[calc(100vh-120px)] "
              style={{
                backgroundColor: token.token.colorBgLayout
              }}
            >
              <div className="p-4 h-[calc(100vh-135px)] overflow-y-auto !overflow-x-hidden ">
                <SwitchTransition mode="out-in">
                  <CSSTransition
                    key={location.pathname}
                    appear={true}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                    nodeRef={nodeRef}
                  >
                    <div className="box" ref={nodeRef}>
                      {currentOutlet}
                    </div>
                  </CSSTransition>
                </SwitchTransition>
              </div>
            </div>

            {/* </CSSTransition>
            </SwitchTransition> */}
          </Suspense>
        </Content>
      </Layout>
    </Layout>

    // </Ldle>
  );
}

export default LibLayout;
