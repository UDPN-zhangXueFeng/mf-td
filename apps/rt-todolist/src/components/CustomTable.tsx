// import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import {
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Tooltip,
  message,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import copyClipboard from 'copy-to-clipboard';
import { getLS } from 'libs/utils';
import {
  Ref,
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import useSWR from 'swr';
import { CustomTableProps } from './CustomTableProps';
import { TailwindUIMenu } from './tailwindui';
import { useHook } from './useHook';
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { getTimestamp } from 'libs/utils/get/getDateFormat';

const { confirm } = Modal;
const classNamePx = 'px-7';
// eslint-disable-next-line @typescript-eslint/ban-types
const Custom_Table: (
  props: PropsWithChildren<CustomTableProps>,
  ref: Ref<unknown> | undefined
) => JSX.Element = (
  { url, title, extra, form, table, shadow },
  ref: Ref<unknown> | undefined
) => {
  const { t, routerPush, router } = useHook();
  const [thisform] = Form.useForm();
  const [param, setParam] = useState<BCMP.Objects>({
    page: {
      pageSize: 10,
      pageNum: 1,
    },
    data: form.initialValues || {},
  });
  useEffect(() => {
    setParam({
      page: {
        pageSize: 10,
        pageNum: 1,
      },
      data: { ...param.data, ...form.initialValues },
    });
  }, [form]);

  const { data: tableData, isLoading, mutate } = useSWR([url, param]);

  useEffect(() => {
    mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  useImperativeHandle(ref, () => ({
    mutate: () => {
      mutate();
    },
  }));

  const [userPermission, setUserPermission] = useState<string[]>([]);
  useEffect(() => {
    setUserPermission(getLS('userPermission'));
  }, []);

  const onChange = useCallback(
    (pagination: TablePaginationConfig) => {
      setParam({
        ...param,
        page: {
          pageSize: pagination.pageSize || 10,
          pageNum: pagination.current || 1,
        },
      });

    },
    [param]
  );


  const onFinish = useCallback(() => {
    console.log(222);
    const values = (form.form ?? thisform).getFieldsValue();
    const _values: BCMP.Objects = {};
    Object.keys(values).forEach((item) => {
      if (item.indexOf('-') < 0) {
        values[item] && (_values[item] = values[item] || '');
      } else {
        const keys = item.split('-');
        _values[keys[0]] = values[item]
          ? getTimestamp(values[item][0].format('YYYY-MM-DD 00:00:00'))
          : '';
        _values[keys[1]] = values[item]
          ? getTimestamp(values[item][1].format('YYYY-MM-DD 23:59:59'))
          : '';
      }
    });
    if (form.initialValues !== undefined) {
      if (
        router.pathname != '/transaction-flow/stablecoin' &&
        router.pathname != '/wallet/user-wallet'
      ) {
        Object.keys(form.initialValues).forEach((item) => {
          _values[item] = (form.initialValues as BCMP.Objects)[item];
        });
      }
    }

    setParam({ ...param, data: _values });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const headerNode = useMemo(
    () => (
      <>
        {title || extra ? (
          <div
            className={
              'text-sm flex justify-between items-center border-0 border-b border-solid border-b-gray-100 py-3 ' +
              classNamePx
            }
          >
            <div className="font-bold">{title}</div>
            <div>{extra}</div>
          </div>
        ) : null}
      </>
    ),
    [title, extra]
  );

  const formNode = useMemo(() => {
    const { items, children, ...forms } = form;
    let show = false;
    const AsNode = (
      <Form
          {...forms}
          form={forms.form ?? thisform}
          onFinish={onFinish}
          labelCol={forms.labelCol || { flex: '6rem' }}
          className={forms.className}
        >
          <div
            className={
              'grid grid-cols-2 xl:grid-cols-3 gap-4 py-11 ' + classNamePx
            }
          >
            {items.map((_item) => {
              show = !_item.hidden;
              const chail =
                _item.type === 'Input' ? (
                  <Input className="w-full" />
                ) : _item.type === 'Select' ? (
                  <Select
                    className="w-full"
                    fieldNames={_item.fieldNames}
                    options={_item.options}
                  />
                ) : (
                  <DatePicker.RangePicker className="w-full" />
                );
              return (
                <Form.Item
                  {..._item}
                  key={String(_item.name)}
                  name={String(_item.name)}
                  label={_item.label}
                >
                  {chail}
                </Form.Item>
              );
            })}

            {children as ReactNode}
            {!show ? (
              false
            ) : (
              <Form.Item
                className="col-start-2 xl:col-start-3"
                label=" "
                colon={false}
              >
                <div className="space-x-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="!shadow-none w-16 !px-0"
                    // className="font-bold"
                  >
                    {t('PUB_Query')}
                  </Button>
                  <Button
                    htmlType="reset"
                    className="text-theme underline ml-2 w-16 !px-0"
                    onClick={() => {
                      if (
                        router.pathname === '/transaction-flow/stablecoin' ||
                        router.pathname === '/wallet/user-wallet'
                      ) {
                        routerPush(router.pathname);
                      }
                    }}
                  >
                    {t('PUB_Reset')}
                  </Button>
                </div>
              </Form.Item>
            )}
          </div>
        </Form>
    );
    if (show) return AsNode;
    return <></>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <div>
        <div className="bg-white shadow rounded-lg">
          {headerNode}
          {formNode}
        </div>
        <div
          className={'rounded-lg mt-4 bg-white ' + (!shadow ? '' : 'shadow')}
        >
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  colorFillAlter:
                    process.env.NEXT_PUBLIC_SYS_ENV === 'TDManage'
                      ? '#f3f0ff'
                      : '#E7F3FF',
                },
              },
            }}
          >
            <Table
              {...table}
              className=""
              columns={[
                ...(table.columns || []).map((item, index) => ({
                  ellipsis: true,
                  ...item,
                  onHeaderCell: () => ({ className: 'font-normal' }),
                  render: (_: BCMP.ANY, _data: BCMP.ANY, index: BCMP.ANY) => {
                    const isObject =
                      typeof (item.render && item.render(_, _data, index)) ===
                      'object';
                    return item.title && table.isCopy ? (
                      <Tooltip
                        placement="top"
                        title={
                          <span>
                            {item.render ? item.render(_, _data, index) : _}
                            {!isObject ? (
                              <span
                                className="ml-1 cursor-pointer text-theme"
                                onClick={() => {
                                  copyClipboard(
                                    item.render
                                      ? item.render(_, _data, index)
                                      : _
                                  );
                                  message.success({
                                    content: t('PUB_Success').replace(
                                      '****',
                                      t('PUB_Copy')
                                    ),
                                  });
                                }}
                              >
                                {t('PUB_Copy')}
                              </span>
                            ) : null}
                          </span>
                        }
                      >
                        {item.title === t('PUB_Index')
                          ? (param.page.pageNum - 1) * 10 + index + 1
                          : item.render
                          ? item.render(_, _data, index)
                          : _}
                      </Tooltip>
                    ) : (
                      <span>
                        {item.title === t('PUB_Index')
                          ? (param.page.pageNum - 1) * 10 + index + 1
                          : item.render
                          ? item.render(_, _data, index)
                          : _}
                      </span>
                    );
                  },
                })),
                ...(tableData?.rows &&
                tableData?.rows.length &&
                table.actions(tableData?.rows[0]).length > 0
                  ? ([
                      {
                        title: (
                          <div className="flex items-center">
                            {t('PUB_Action')}
                            {table?.actionsTip ? (
                              <Tooltip title={table?.actionsTip}>
                                <QuestionMarkCircleIcon className="ml-2 w-4 h-4" />
                              </Tooltip>
                            ) : null}
                          </div>
                        ),
                        align: 'center',
                        width: '8rem',
                        onHeaderCell: () => ({ className: 'font-normal' }),
                        render: (_, _data) => {
                          let classNames = '';
                          const actionArr = table
                            .actions(_data)
                            .filter((item) => {
                              const boo =
                                !item?.disabled &&
                                (process.env.NEXT_PUBLIC_SYS_ENV === 'TDManage'
                                  ? userPermission?.indexOf(item?.limit + '') >=
                                      0 || item?.limit == 'OS_P_show'
                                  : true);
                              if (boo && item.key.indexOf('Examine') > -1)
                                classNames = 'text-red-700';
                              return boo;
                            });
                          return (
                            <div className="flex items-center justify-start">
                              {/* {actionArr
                          .filter(
                            (_, _in) => _in < (actionArr.length > 3 ? 2 : 3)
                          )
                          .map((actionItem) => {
                            return (
                              <Button
                                className="flex items-center px-1"
                                onClick={() => {
                                  if (!actionItem.confimStr) {
                                    table.actionClick(
                                      _data,
                                      actionItem.key + ''
                                    );
                                  } else {
                                    confirm({
                                      title: actionItem.label,
                                      // icon: <ExclamationCircleFilled />,
                                      content: actionItem.confimStr?.replace(
                                        '****',
                                        actionItem.label as string
                                      ),
                                      onOk() {
                                        return new Promise(
                                          (resolve, reject) => {
                                            const prom = table.actionClick(
                                              _data,
                                              actionItem.key + ''
                                            );
                                            prom &&
                                              prom.then((res) => {
                                                if (res.data.code === '0')
                                                  mutate();
                                                resolve(res.data.code);
                                              });
                                          }
                                        );
                                      },
                                      // onCancel() {},
                                    });
                                  }
                                }}
                                type="link"
                                key={actionItem.key}
                              >
                                {getIcon(actionItem.key)}
                                {actionItem.label}
                              </Button>
                            );
                          })} */}

                              {actionArr.length ? (
                                <div>
                                  {actionArr.length > 1 ? (
                                    <TailwindUIMenu
                                      title={
                                        <EllipsisHorizontalIcon
                                          className={'w-6 h-6 ' + classNames}
                                        />
                                      }
                                      items={actionArr}
                                      onClick={(e) => {
                                        return table.actionClick(_data, e.key);
                                      }}
                                      callback={mutate}
                                    />
                                  ) : (
                                    <>
                                      {actionArr.map((el) => {
                                        return (
                                          <span
                                            className="text-theme cursor-pointer"
                                            key={el.key}
                                            onClick={(e) => {
                                              return table.actionClick(
                                                _data,
                                                el.key
                                              );
                                            }}
                                          >
                                            {el.label}
                                          </span>
                                        );
                                      })}
                                    </>
                                  )}
                                </div>
                              ) : (
                                '--'
                              )}
                            </div>
                          );
                        },
                      },
                    ] as ColumnsType<BCMP.Objects>)
                  : ([] as ColumnsType<BCMP.Objects>)),
              ]}
              loading={isLoading}
              dataSource={tableData?.rows}
              pagination={
                table.pagination === false
                  ? false
                  : {
                      className: 'pr-7',
                      total: tableData?.page && tableData?.page.total,
                      showQuickJumper: true,
                      defaultPageSize: 10,
                      defaultCurrent: 1,
                      current: param.page.pageNum,
                    }
              }
              onChange={onChange}
            />
          </ConfigProvider>
        </div>
      </div>
  );
};

export const CustomTableTitle = (props: {
  title: string | ReactNode;
  button?: {
    key: string;
    limit: string;
    onClick?: () => void;
    label: string | ReactNode;
    disabled?: boolean;
    type?: 'primary' | 'link';
  }[];
}) => {
  const [userPermission, setUserPermission] = useState<string[]>([]);
  useEffect(() => {
    setUserPermission(getLS('userPermission'));
  }, []);
  return (
    <div className="flex justify-between items-center bg-gray-50 p-4">
      <div className="font-bold">{props?.title}</div>
      <div>
        {props.button
          ? props.button.map((butt) => {
              if (
                process.env.NEXT_PUBLIC_SYS_ENV === 'TDManage'
                  ? userPermission?.indexOf(butt?.limit + '') >= 0 ||
                    butt?.limit == 'OS_P_show'
                  : true
              ) {
                return (
                  <Button
                    key={butt.key}
                    type={butt.type || 'primary'}
                    className="text-xs mx-2"
                    onClick={butt.onClick}
                    disabled={butt.disabled}
                  >
                    {butt.label}
                  </Button>
                );
              }
              return null;
            })
          : null}
      </div>
    </div>
  );
};

export const CustomTable = forwardRef(Custom_Table);

export const useCustomTable: <T>(
  data: CustomTableProps
) => CustomTableProps<T> & {
  ref: RefObject<{ mutate: () => void }>;
} = (data) => {
  const ref = useRef<{ mutate: () => void }>(null);

  const form = useMemo(() => {
    return data.form;

  }, [data.form]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const actions = useCallback(data.table.actions, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const actionClick = useCallback(data.table.actionClick, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => data.table.columns, []);

  return {
    ref,
    title: data.title,
    extra: data?.extra,
    url: data.url,
    form,
    table: {
      ...data.table,
      rowKey: data.table.rowKey,
      columns,
      actionsTip: data.table.actionsTip,
      actions,
      actionClick,
      isCopy: data.table.isCopy ?? true,
    },
  };
};
