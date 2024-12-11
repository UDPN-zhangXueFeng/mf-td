import { useTranslation } from 'react-i18next';
import { Image, Dropdown, MenuProps, Space } from 'antd';
import { useEffect, useState } from 'react';
import { CaretDownOutlined, InteractionOutlined } from '@ant-design/icons';
import { LibAxios, RenderProps } from '@mf-td/lib-axios';
import * as echarts from 'echarts';
export type Main1Props = {
  activeKey: number;
  coinData: any[];
};
export function Charts(props: Main1Props) {
  const { t } = useTranslation('dashboard');
  const { activeKey, coinData } = props;
  console.log(coinData[activeKey],"coinData");

  const [nowTmsp, setNowTmsp] = useState<number>(
    new Date(new Date().toLocaleDateString('en-US')).getTime()
  );
  useEffect(()=>{
    // setStablecoinCode(props.coinData[activeKey].code)
  },[props])
  const [stablecoinCode, setStablecoinCode] = useState<string>('');
  const [interval, setIntervals] = useState<number>(nowTmsp - 7 * 86400000);
  const [selectDateText, setSelectDateText] = useState(t('dashboard_0007'));
  const activeDateList = [
    {
      label: t('statistic_analysis_0008'),
      key: '1',
      timeStamp: 7 * 86400000
    },
    {
      label: t('statistic_analysis_0010'),
      key: '3',
      timeStamp: 14 * 86400000
    },
    {
      label: t('statistic_analysis_0009'),
      key: '2',
      timeStamp: 30 * 86400000
    }
  ];
  const items: MenuProps['items'] = activeDateList;
  const handleClick: MenuProps['onClick'] = ({ key }) => {
    const fData = activeDateList.filter((item) => item.key === key);
    setSelectDateText(fData[0].label);
    const now = new Date(new Date().toLocaleDateString('en-US')).getTime();
    setNowTmsp(now);
    setIntervals(now - fData[0].timeStamp);
  };

  return (
    <div className="bg-white shadow-lg my-6">
      <div className="w-full flex justify-between">
        <div className="bg-white shadow-lg rounded-xl p-4 w-full">
          <div className="w-full flex justify-between">
            <div className="flex items-center">
              <span className="text-base font-extrabold">
                {t('dashboard_0010')}
              </span>
            </div>
            <div className="flex items-center">
              <Image
                preview={false}
                src="/stablecoin/images/day.svg"
                alt=""
                width={'1rem'}
                height={'1rem'}
              />
              <Dropdown menu={{ items, onClick: handleClick }} className="px-2">
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <span className="text-fontTheme cursor-pointer text-base font-extrabold">
                      {selectDateText}
                    </span>
                  </Space>
                </a>
              </Dropdown>

              <CaretDownOutlined className="text-fontTheme" />
            </div>
          </div>
          <LibAxios
            url="/api/manage/v1/td/dashboard/wallet/statistics"
            method="POST"
            data={{
              stablecoinCode: "e461250256cd4c569b04617ca08913f0",
              startTime: String(interval),
              endTime: String(nowTmsp)
            }}
            onSuccess={(data, response) => {
              console.log(data, 'data');
            }}
          >
            {({ data, refetch }: RenderProps) => {
              return (
                data && (
                  <InteractionOutlined
                    className="w-8 ml-4 cursor-pointer"
                    onClick={() => refetch()}
                  />
                )
              );
            }}
          </LibAxios>
          <div
            id="main"
            className="pl-12 mt-10"
            style={{
              width: 'auto',
              height: 500
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Charts;
