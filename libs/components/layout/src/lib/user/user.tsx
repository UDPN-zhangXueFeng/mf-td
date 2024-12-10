/*
 * @Author: zhangxuefeng
 * @Date: 2024-05-31 16:43:06
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-07-10 14:18:20
 * @Description:
 */

import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useAppSelector, useHook } from '@udpn/hooks';
import { request } from '@udpn/https';
import {
  Button,
  Dropdown,
  Form,
  FormProps,
  Input,
  MenuProps,
  Modal,
  Space,
  theme
} from 'antd';
import { useState } from 'react';
import { addressContainSpecial } from '@udpn/tools/index';
import { getEncryptionData } from '@udpn/tools/getEncryptionData';

/* eslint-disable-next-line */
export interface UserProps {
  cPwApi: string;
  cPwKey: { newPassword: string; oldPassword: string };
  outApi: string;
}

enum UserEnum {
  oldPwd = 'oldPassWord',
  oldPwdCfm = 'Old PASSWORD',
  newPwd = 'newldPassWord',
  newPwdCfm = 'NEW PASSWORD',
  newRePwd = 'confirmNewPassWord',
  newRePwdCfm = 'CONFIRM NEW PASSWORD'
}

export function User(props: UserProps) {
  const {
    outApi,
    cPwApi,
    cPwKey = { newPassword: UserEnum.newPwd, oldPassword: UserEnum.oldPwd }
  } = props;
  const token = theme.useToken();
  const { t, routerPush } = useHook();
  const [open, setOpen] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <div onClick={() => setOpen(true)}>{t('LAY_0005')}</div>
    },
    {
      key: '2',
      label: (
        <div
          onClick={() => {
            modal.confirm({
              title: 'Warning',
              icon: <ExclamationCircleOutlined />,
              content: 'Are you sure you want to log out？',
              footer: (_, { OkBtn, CancelBtn }) => (
                <Space>
                  <CancelBtn />
                  <OkBtn />
                </Space>
              ),
              // okText: 'ok',
              onOk: () => {
                request.post(outApi).then((res) => {
                  if (res.data.code === 0) {
                    localStorage.clear();
                    sessionStorage.clear();
                    routerPush('/');
                  }
                });
              }
            });
          }}
        >
          Log Out
        </div>
      )
    }
  ];

  const onFinish: FormProps['onFinish'] = (values: any) => {
    const obj: any = {};
    for (const i in cPwKey) {
      obj[i] = getEncryptionData(values[i]);
    }
    request.post(cPwApi, obj).then((res) => {
      if (res.data.code === 0) {
        modal.success({
          title: 'Success',
          icon: <CheckCircleOutlined />,
          content: 'Password changed successfully, please log in again!',
          okText: 'ok',
          onOk: () => {
            localStorage.clear();
            sessionStorage.clear();
            routerPush('/');
          }
        });
      }
    });
  };

  const ChangeModel = () => {
    const [mystyle1, setMystyle1] = useState<string>('red');
    const [mystyle2, setMystyle2] = useState<string>('red');
    const [mystyle3, setMystyle3] = useState<string>('red');
    const [mystyle4, setMystyle4] = useState<string>('red');
    const extraNode = (
      <div className="text-[0.7rem]">
        <div style={{ color: mystyle1 }}>
          <Space>
            <CheckCircleOutlined />
            <span>At least 8 characters in length</span>
          </Space>
        </div>
        <div style={{ color: mystyle2 }}>
          <Space>
            <CheckCircleOutlined />
            <span>Contain upper and lower case characters</span>
          </Space>
        </div>
        <div style={{ color: mystyle3 }}>
          <Space>
            <CheckCircleOutlined />
            <span>At least one numerical character</span>
          </Space>
        </div>
        <div style={{ color: mystyle4 }}>
          <Space>
            <CheckCircleOutlined />
            <span>
              At least one special character(Not
              included：'_'、'/'、'\'、':'、'.')
            </span>
          </Space>
        </div>
      </div>
    );

    return (
      <div>
        {contextHolder}
        <Modal title={t('LAY_0005')} closeIcon={false} open={open} footer={[]}>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            style={{ width: '28rem' }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            className="mt-6"
          >
            <Form.Item
              label={t('LAY_0001')}
              name={cPwKey.oldPassword}
              rules={[
                {
                  required: true,
                  message: t('LAY_0004', { name: UserEnum.oldPwdCfm })
                }
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item
              label={t('LAY_0002')}
              name={cPwKey.newPassword}
              extra={extraNode}
              rules={[
                {
                  required: true
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const validArray: Array<string> = [];
                    if (value !== undefined && value.length >= 8) {
                      setMystyle1(token.token.colorPrimary);
                      validArray[0] = '0';
                    } else {
                      setMystyle1('red');
                      validArray[0] = '';
                    }
                    const upper = /[A-Z]/.test(value);
                    const lower = /[a-z]/.test(value);
                    if (upper && lower) {
                      setMystyle2(token.token.colorPrimary);
                      validArray[1] = '1';
                    } else {
                      setMystyle2('red');
                      validArray[1] = '';
                    }
                    if (value.match(/^.*[0-9]+.*$/)) {
                      setMystyle3(token.token.colorPrimary);
                      validArray[2] = '2';
                    } else {
                      setMystyle3('red');
                      validArray[2] = '';
                    }
                    if (addressContainSpecial(value)) {
                      setMystyle4(token.token.colorPrimary);
                      validArray[3] = '3';
                    } else {
                      setMystyle4('red');
                      validArray[3] = '';
                    }
                    if (validArray.some((el) => !el)) {
                      return Promise.reject(new Error(''));
                    }
                    return Promise.resolve();
                    // if (!value || getFieldValue(UserEnum.oldPwd) === value) {
                    //   return Promise.resolve();
                    // }
                  }
                })
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item
              label={t('LAY_0003')}
              name={UserEnum.newRePwd}
              rules={[
                {
                  required: true
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue(cPwKey.newPassword) === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('LAY_0006')));
                  }
                })
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item className="text-end">
              <Space>
                <Button
                  type="default"
                  htmlType="reset"
                  onClick={() => {
                    setOpen(false);
                    form.resetFields();
                  }}
                >
                  {t('ACT_Cancel')}
                </Button>
                <Button type="primary" htmlType="submit">
                  {t('ACT_Confirm')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-start">
        <Dropdown menu={{ items }} className="cursor-pointer">
          <Space>
            <UserOutlined className="text-white  text-lg" />
            <div style={{ color: token.token.colorBgContainer }}>
              {useAppSelector(
                (state) => state.userInfoSlice.userInfo['userName']
              )}
            </div>
          </Space>
        </Dropdown>
      </div>
      <ChangeModel />
    </>
  );
}

export default User;
