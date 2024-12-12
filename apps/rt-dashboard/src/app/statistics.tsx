import { useTranslation } from 'react-i18next';
import { Image } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { InteractionOutlined } from '@ant-design/icons';
import { LibAxios, RenderProps } from '@mf-td/lib-axios';
export type Main1Props = {
  activeKey: number;
  coinData: any[];
};
export function Statistics(props: Main1Props) {
  const { t } = useTranslation('statistic-analysis');
  const { activeKey, coinData } = props;
  useEffect(() => {
    if (coinData.length > 0) {
      // 保存当前选择币种的issueType
      setTokenType(coinData[activeKey].issueType);
    }
  }, [activeKey, coinData]);
  const [tokenType, setTokenType] = useState<number>(-1);
  // 币种统计列表数据
  const newStablecoinInfo = [
    {
      label: t('statistic_analysis_0014'),
      value: 'reserveBalance',
      url: '/stablecoin/images/reserve-account.jpg',
      unit: 'currencySymbol'
    },
    {
      label: t('statistic_analysis_0015'),
      value: 'repositoryBalance',
      url: '/stablecoin/images/balance-cbc.jpg',
      unit: 'symbol'
    },
    {
      label: t('statistic_analysis_0016').replace('****', 'symbol'),
      value: 'circulation',
      url: '/stablecoin/images/circulation.svg',
      unit: 'symbol'
    },
    {
      label:
        tokenType === 1
          ? t('stablecoin_manage_021')
          : t('statistic_analysis_0006'),
      value: 'totalMint',
      url:
        tokenType === 1
          ? '/stablecoin/images/total-mint.svg'
          : '/stablecoin/images/issuance.jpg',
      unit: 'symbol'
    },
    {
      label:
        tokenType === 1
          ? t('stablecoin_manage_023')
          : t('statistic_analysis_0007'),
      value: 'totalMelt',
      url:
        tokenType === 1
          ? '/stablecoin/images/total-melt.svg'
          : '/stablecoin/images/melt-hsb.jpg',
      unit: 'symbol'
    },
    {
      label: t('statistic_analysis_0013'),
      value: 'walletNumber',
      url: '/stablecoin/images/hsb-wallet.png',
      unit: ''
    }
  ];
  const showText = useMemo(() => {
    if (coinData.length > 0) {
      let stablecoinInfo = [];
      // 根本issueType区分展示数据
      if (coinData[activeKey].issueType === 1) {
        stablecoinInfo = newStablecoinInfo;
      } else {
        stablecoinInfo = [...newStablecoinInfo.slice(2)];
      }
      return (
        <LibAxios
          key={activeKey + 2}
          url="/api/manage/v1/td/dashboard/stablecoin/statistics"
          method="POST"
          onSuccess={(data) => {
            console.log(data, 'daat123');
          }}
          data={{
            stablecoinCode: coinData[activeKey].code
          }}
        >
          {({ data, refetch }: RenderProps) => {
            return (
              data && (
                <div className="w-full flex justify-between mb-6">
                  <div className=" bg-white shadow-lg rounded-xl p-4 !w-full">
                    <div className="flex items-center">
                      <span className="text-base font-extrabold">
                        {`${coinData[activeKey]?.name} Statistics`}
                      </span>
                      <InteractionOutlined
                        className="w-8 ml-4 cursor-pointer"
                        onClick={() => refetch()}
                      />
                    </div>
                    <div className="px-10 flex justify-between md:pt-10 w-[85%] m-auto">
                      {stablecoinInfo?.map((el, index) => {
                        return (
                          <div
                            key={el.label}
                            className="flex flex-col items-center justify-between py-8 [w-19%]"
                          >
                            <Image
                              preview={false}
                              src={el.url}
                              alt=""
                              width={'5rem'}
                              height={'5rem'}
                            />
                            <div className="">
                              <span className="block my-3 text-sm text-center text-slate-400">
                                {el.label}
                              </span>
                              <span className="block my-3 text-center">
                                {(data[el.unit]
                                  ? data[el.value]
                                  : data[el.value]) +
                                  ' ' +
                                  (el.unit ? data[el.unit] : '')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )
            );
          }}
        </LibAxios>
      );
    }
  }, [activeKey, coinData,newStablecoinInfo]);
  return <div>{showText}</div>;
}

export default Statistics;
