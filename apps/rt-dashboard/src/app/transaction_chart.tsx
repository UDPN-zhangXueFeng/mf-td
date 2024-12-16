import { useTranslation } from 'react-i18next';
import { Image, Dropdown, MenuProps, Space } from 'antd';
import {  useMemo, useState } from 'react';
import { CaretDownOutlined, InteractionOutlined } from '@ant-design/icons';
import { LibAxios, RenderProps } from '@mf-td/lib-axios';
import { getDateFormat }from "../utils/getDateFormat"
import * as echarts from 'echarts';
export type MainProps = {
  activeKey: number;
  coinData: any[];
};
export function TransactionCharts(props: Readonly<MainProps>) {
  const { t } = useTranslation('statistic-analysis');
  const { activeKey, coinData } = props;
  const [nowTmsp, setNowTmsp] = useState<number>(
    new Date(new Date().toLocaleDateString('en-US')).getTime()
  );
  const [interval, setIntervals] = useState<number>(nowTmsp - 7 * 86400000);
  const [selectDateText, setSelectDateText] = useState(
    t('statistic_analysis_0008')
  );
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
  const showText = useMemo(() => {
    if (props.coinData.length > 0) {
      return (
        <LibAxios
          key={activeKey + 1}
          url="/api/manage/v1/td/dashboard/transaction/statistics"
          method="POST"
          data={{
            stablecoinCode: coinData[activeKey].code,
            startTime: String(interval),
            endTime: String(nowTmsp)
          }}
          onSuccess={(data) => {
            const myChart = echarts.init(
              document.getElementById('main2') as HTMLElement
            );
            myChart.clear();
            myChart.setOption({
              tooltip: {
                trigger: 'axis',
                formatter: function (params: any[]) {
                  let result = '';
                  params.forEach((param) => {
                    result += `${param.seriesName}:${param.data} ${coinData[activeKey]['label']}<br/>`;
                  });
                  return result;
                }
              },
              legend: {
                data: [
                  t('statistic_analysis_0018'),
                  t('statistic_analysis_0019'),
                  t('statistic_analysis_0020')
                ]
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },

              xAxis: {
                type: 'category',
                boundaryGap: false,
                data:
                  data &&
                  data.map((item: any) => {
                    return getDateFormat(item.statisticsDay);
                  })
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  name: t('statistic_analysis_0018'),
                  type: 'line',
                  data: data && data.map((item: any) => item.topUpTotal)
                },
                {
                  name: t('statistic_analysis_0019'),
                  type: 'line',
                  data: data && data.map((item: any) => item.transferTotal)
                },
                {
                  name: t('statistic_analysis_0020'),
                  type: 'line',
                  data: data && data.map((item: any) => item.withdrawalTotal)
                }
              ]
            });
          }}
        >
          {({ data, refetch }: RenderProps) => {
            return (
              <div className="bg-white shadow-lg my-6 rounded-xl">
                <div className="w-full flex justify-between">
                  <div className="bg-white shadow-lg rounded-xl p-4 w-full">
                    <div className="w-full flex justify-between">
                      <div className="flex items-center">
                        <span className="text-base font-extrabold">
                          {t('statistic_analysis_0025')}
                        </span>
                        <InteractionOutlined
                          className="w-8 ml-4 cursor-pointer"
                          onClick={() => refetch()}
                        />
                      </div>
                      <div className="flex items-center">
                        <Image
                          preview={false}
                          src="/stablecoin/images/day.svg"
                          alt=""
                          width={'1rem'}
                          height={'1rem'}
                        />
                        <Dropdown
                          menu={{
                            items,
                            onClick: ({ key }) => {
                              const fData = activeDateList.filter(
                                (item) => item.key === key
                              );
                              setSelectDateText(fData[0].label);
                              const now = new Date(
                                new Date().toLocaleDateString('en-US')
                              ).getTime();
                              setNowTmsp(now);
                              setIntervals(now - fData[0].timeStamp);
                              refetch();
                            }
                          }}
                          className="px-2"
                        >
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
                    <div
                      id="main2"
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
          }}
        </LibAxios>
      );
    }
  }, [activeKey, coinData,selectDateText]);
  return <div>{showText}</div>;
}

export default TransactionCharts;
