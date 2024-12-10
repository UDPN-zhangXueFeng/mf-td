import { Input, Button, Image, Form, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LibAxios, RenderProps } from '@mf-td/lib-axios';
import { useState } from 'react';
import { getEncryptionData } from '@mf-td/tools';

interface LoginForm {
  username: string;
  password: string;
  captcha: string;
}

interface MetamaskForm {
  metamaskUsername: string;
}

export default function LoginPage() {
  const { t } = useTranslation('login');
  const navigate = useNavigate();
  const [loginForm] = Form.useForm<LoginForm>();
  const [metamaskForm] = Form.useForm<MetamaskForm>();
  const [loginLoading, setLoginLoading] = useState(false);
  const [randomstr, setRandomstr] = useState<string>('');

  const handleMetamaskLogin = async (values: MetamaskForm) => {
    console.log('Metamask login values:', values);
    // 处理 Metamask 登录逻辑
    navigate('/main');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 bg-gradient-to-b from-[var(--color-primary-light)] to-[var(--color-primary)] p-8 lg:p-16 flex flex-col items-center justify-center">
        <div className="mb-8">
          <Image
            src="../../assets/images/login/login_logo_icon.svg"
            alt="UDPN Solutions Logo"
            preview={false}
            className="w-48"
          />
        </div>
        <h1 className="!text-[26px] lg:text-3xl text-[var(--color-primary-text)] font-medium mb-8 max-w-lg">
          {t('title')}
        </h1>
        <div className="flex-1 relative mt-8">
          <Image
            src="../../assets/images/login/pc.svg"
            alt="Banking Illustration"
            preview={false}
            className="!w-[600px] mx-auto"
          />
        </div>
      </div>
      {/* Right Section */}
      <div className="w-full lg:w-1/2 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl lg:text-3xl text-[var(--color-primary)] font-semibold text-center mb-12">
            {t('systemName')}
          </h2>
          <LibAxios
            url="/api/rbac/v1/login"
            method="POST"
            immediate={false}
            loading={loginLoading}
            onSuccess={(data) => {
              // 处理登录成功逻辑
              console.log('Login success:', data);
              // // 可以在这里存储 token
              // TODO: 也许要整个localstorage
              localStorage.setItem('token', data.token);
              // // 跳转到主页
              navigate('/main');
            }}
            onError={(error) => {
              // 处理登录失败逻辑
              console.error('Login failed:', error);
              // 可以使用 antd 的 message 组件显示错误
              message.error(error.message || t('login.failed'));
            }}
          >
            {({ refetch }: RenderProps) => (
              <Form
                form={loginForm}
                onFinish={(values: LoginForm) => {
                  // 在这里构造加密后的请求数据
                  const encryptedData = {
                    loginName: getEncryptionData(values.username),
                    password: getEncryptionData(values.password),
                    code: getEncryptionData(values.captcha)
                  };

                  setLoginLoading(true);
                  refetch({
                    data: encryptedData,
                    headers: {
                      randomstr: randomstr,
                      rData: true
                    }
                  }); // 触发登录请求
                }}
                layout="vertical"
              >
                <Form.Item
                  label={t('form.username')}
                  name="username"
                  required
                  rules={[
                    {
                      required: true,
                      message: t('validation.username.required')
                    },
                    { min: 3, message: t('validation.username.minLength') }
                  ]}
                >
                  <Input size="large" />
                </Form.Item>

                <Form.Item
                  label={t('form.password')}
                  name="password"
                  required
                  rules={[
                    {
                      required: true,
                      message: t('validation.password.required')
                    },
                    { min: 6, message: t('validation.password.minLength') }
                  ]}
                >
                  <Input.Password
                    size="large"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                <Form.Item
                  label={t('form.captcha')}
                  name="captcha"
                  required
                  rules={[
                    {
                      required: true,
                      message: t('validation.captcha.required')
                    }
                  ]}
                >
                  <div className="flex gap-4">
                    <Input size="large" className="flex-1" />
                    <LibAxios
                      url="/api/rbac/v1/code/getCode"
                      method="get"
                      responseType="blob"
                      onSuccess={(data, response) => {
                        setRandomstr(response?.headers.randomstr);
                      }}
                    >
                      {({ data, refetch }: RenderProps) => (
                        <div className="w-36 h-10">
                          {data && (
                            <img
                              src={URL.createObjectURL(data)}
                              alt="CAPTCHA"
                              className="w-full h-full object-contain cursor-pointer"
                              onClick={() => refetch()}
                            />
                          )}
                        </div>
                      )}
                    </LibAxios>
                  </div>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    className="w-full mt-5 h-12 bg-[var(--color-primary)] hover:!bg-[var(--color-primary-dark)] bg-primary"
                  >
                    {t('form.signIn')}
                  </Button>
                </Form.Item>
              </Form>
            )}
          </LibAxios>
          <div className="text-center text-gray-500 my-6">{t('form.or')}</div>

          <Form
            form={metamaskForm}
            onFinish={handleMetamaskLogin}
            layout="vertical"
          >
            <Form.Item
              label={t('form.username')}
              name="metamaskUsername"
              required
              rules={[
                { required: true, message: t('validation.username.required') },
                { min: 3, message: t('validation.username.minLength') }
              ]}
            >
              <Input size="large" className="mb-4" />
            </Form.Item>

            <Form.Item>
              <Button
                size="large"
                className="w-full h-12 bg-gray-50 hover:bg-gray-100 border flex items-center justify-center gap-2"
                onClick={() => metamaskForm.submit()}
              >
                <Image
                  src="../../assets/images/login/meta.png"
                  alt="MetaMask"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  preview={false}
                />
                {t('form.connectMetamask')}
              </Button>
            </Form.Item>

            <p className="text-sm text-[var(--color-primary)] text-center">
              {t('form.metamaskHint')}
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}
