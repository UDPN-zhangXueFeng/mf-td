import {
  CustomTable,
  useCustomTable,
  CustomTableTitle
} from '@mf-td/lib-table';
import { Form } from 'antd';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
export function NxWelcome() {
  const { t } = useTranslation('statistic-analysis');
    const navigate = useNavigate();
  const [form] = Form.useForm();
  const customTable = useCustomTable<any>({
    title: t('PUB_Query'),
    url: '/api/manage/v1/sp/access/listPage',
    form: {
      form,
      labelCol: { flex: '10rem' },
      items: [
        {
          name: 'spName',
          label: t('sp_access_0000'),
          type: 'Input'
        },
        {
          name: 'spType',
          label: t('Service Provider Type'),
          type: 'Select',
          initialValue: '',
          options: [
            ...[1, 5, 10, 15, 20, 25].map((el) => {
              return {
                label: t(`service_provider_type_${el}`),
                value: el
              };
            })
          ]
        },
        { name: 'contactName', label: t('sp_access_0039'), type: 'Input' },
        {
          name: 'email',
          label: t('PUB_Email'),
          type: 'Input'
        },
        {
          name: 'tdName',
          label: t('sp_access_0044'),
          type: 'Select',
          initialValue: '',
          options: []
        },

        {
          name: 'createStartTime-createEndTime',
          label: t('PUB_CreateTime'),
          type: 'RangePicker'
        },
        {
          name: 'state',
          label: t('PUB_Status'),
          type: 'Select',
          initialValue: '',
          options: [
            { label: t('PUB_All'), value: '' },
            { value: '0', label: t('sp_status_0') },
            { value: '1', label: t('sp_status_1') },
            { value: '2', label: t('sp_status_2') }
          ]
        }
      ]
    },
    table: {
      rowKey: 'spId',
      columns: [
        {
          title: t('PUB_Index'),
          dataIndex: 'spId',
          width: '5%'
        },
        {
          title: t('sp_access_0000'),
          dataIndex: 'spName'
        },
        {
          title: t('sp_access_0065'),
          dataIndex: 'spType'
        },
        {
          title: t('sp_access_0039'),
          dataIndex: 'contactName'
        },
        {
          title: t('PUB_Email'),
          dataIndex: 'email'
        },

        {
          title: t('sp_access_0044'),
          dataIndex: 'td',
          width: '15%'
        },
        {
          title: t('PUB_CreateTime'),
          dataIndex: 'createTime'
        },
        {
          title: t('PUB_Status'),
          dataIndex: 'state'
        }
      ],
      title: () => (
        <CustomTableTitle
          title={t('sp_access_0002')}
          button={[
            {
              key: 'Register',
              limit: 'e425450b09de42cc9f8c126c2be178c9',
              label: t('Router_0004_1'),
              onClick: () => {
                navigate('/main/todoList/edit');
              }
            }
          ]}
        />
      ),
      actions(data: any) {
        return [
          {
            key: 'Edit',
            limit: '8c31495dc5894f8e935edde7d436225b',
            label: t('Router_0004_3'),
            disabled: !(data.state === 1 || data.state === 2)
          },
          {
            key: 'View',
            limit: '761e2d985b8a4f95a0df8dc3009fa0f1',
            label: t('Router_0004_4'),
            disabled: false
          }
        ];
      },
      actionClick(data: any, key: string) {
        switch (key) {
          case 'Edit':
            console.log('www');
            break;
        }
      }
    }
  });
  return <CustomTable {...customTable} />;
}

export default NxWelcome;
