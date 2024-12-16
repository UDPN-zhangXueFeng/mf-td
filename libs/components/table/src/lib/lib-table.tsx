import {
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  FormItemProps,
  FormProps,
  Input,
  Select,
  SelectProps,
  Table,
  TableProps,
  Tooltip,
  message
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import copyClipboard from 'copy-to-clipboard';
import { getLS } from './utils/getLS';
import {
  Ref,
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import useSWR from 'swr';
// import { TailwindUIMenu } from './tailwindui';
// import { useHook } from './useHook';
// import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { getTimestamp } from './utils/getDateFormat';
import { useTranslation } from 'react-i18next';
import { MenuItemType } from 'antd/es/menu/interface';
type ItemsProps = FormItemProps & {
  type: 'Input' | 'RangePicker';
};
type ItemsProps1 = FormItemProps & {
  type: 'Select';
} & SelectProps;
type actionClick_1 = (data: any, key: string) => void;
type actionClick_2 = (
  data: any,
  key: string
) => Promise<{ data: { code?: string; [s: string]: any }; [s: string]: any }>;
interface CustomTableProps<T = any> {
  shadow?: boolean;
  url: string;
  title?: any;
  extra?: any;
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
const classNamePx = 'px-7';
const Custom_Table: (
  props: CustomTableProps,
  ref: Ref<unknown> | undefined
) => JSX.Element = (
  { url, title, extra, form, table, shadow },
  ref: Ref<unknown> | undefined
) => {
  // const { t, routerPush, router } = useHook();
  const { t } = useTranslation('login');
  const [thisform] = Form.useForm();
  const [param, setParam] = useState<any>({
    page: {
      pageSize: 10,
      pageNum: 1
    },
    data: form.initialValues || {}
  });
  useEffect(() => {
    setParam({
      page: {
        pageSize: 10,
        pageNum: 1
      },
      data: { ...param.data, ...form.initialValues }
    });
  }, [form]);

  const { data: tableData, isLoading, mutate } = useSWR([url, param]);

  useEffect(() => {
    mutate();
    console.log(tableData,"tableData");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  useImperativeHandle(ref, () => ({
    mutate: () => {
      mutate();
    }
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
          pageNum: pagination.current || 1
        }
      });
    },
    [param]
  );

  const onFinish = useCallback(() => {
    console.log(222);
    const values = (form.form ?? thisform).getFieldsValue();
    const _values: any = {};
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
    // if (form.initialValues !== undefined) {
    //   if (
    //     router.pathname != '/transaction-flow/stablecoin' &&
    //     router.pathname != '/wallet/user-wallet'
    //   ) {
    //     Object.keys(form.initialValues).forEach((item) => {
    //       _values[item] = (form.initialValues as any)[item];
    //     });
    //   }
    // }

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
          {items.map((_item: any) => {
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

          {children as any}
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
                  className="!shadow-none w-16 !px-0 bg-"
                  // className="font-bold"
                >
                  {/* {t('PUB_Query')} */}Query
                </Button>
                <Button
                  htmlType="reset"
                  className="text-theme ml-2 w-16 !px-0"
                  onClick={() => {
                    // if (
                    //   router.pathname === '/transaction-flow/stablecoin' ||
                    //   router.pathname === '/wallet/user-wallet'
                    // ) {
                    //   routerPush(router.pathname);
                    // }
                  }}
                >
                  {/* {t('PUB_Reset')} */}Reset
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
      <div className={'rounded-lg mt-4 bg-white ' + (!shadow ? '' : 'shadow')}>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                colorFillAlter:
                  process.env.NEXT_PUBLIC_SYS_ENV === 'TDManage'
                    ? '#f3f0ff'
                    : '#E7F3FF'
              }
            }
          }}
        >
          <Table
            {...table}
            className=""
            columns={[
              ...(table.columns || []).map((item: any, index: number) => ({
                ellipsis: true,
                ...item,
                onHeaderCell: () => ({ className: 'font-normal' }),
                render: (_: any, _data: any, index: any) => {
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
                                  item.render ? item.render(_, _data, index) : _
                                );
                                message.success({
                                  content: t('PUB_Success').replace(
                                    '****',
                                    t('PUB_Copy')
                                  )
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
                }
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
                              {/* <QuestionMarkCircleIcon className="ml-2 w-4 h-4" /> */}
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
                          .filter((item: any) => {
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
                            {actionArr.length ? (
                              <div>
                                {actionArr.length > 1 ? (
                                  <>wad</>
                                  // <TailwindUIMenu
                                  //   title={
                                  //    <>awadw</>
                                  //   }
                                  //   items={actionArr}
                                  //   onClick={(e: any) => {
                                  //     return table.actionClick(_data, e.key);
                                  //   }}
                                  //   callback={mutate}
                                  // />
                                ) : (
                                  <>
                                    {actionArr.map((el: any) => {
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
                      }
                    }
                  ] as ColumnsType<any>)
                : ([] as ColumnsType<any>))
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
                    current: param.page.pageNum
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
  title: string | any;
  button?: {
    key: string;
    limit: string;
    onClick?: () => void;
    label: string | any;
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

export const useCustomTable: <T>(data: any) => CustomTableProps<T> & {
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
      isCopy: data.table.isCopy ?? true
    }
  };
};
