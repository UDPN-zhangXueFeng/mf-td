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
    if (props.coinData.length > 0) {
      setStablecoinGet(props.coinData[activeKey]);
    }
  }, [props.activeKey, props.coinData]);
  const [stablecoinGet, setStablecoinGet] = useState<any>({});
  const stablecoinInfo = useMemo(() => {
    const {
      tokenType,
      symbol,
      circulation,
      repositoryBalance,
      reserveBalance,
      totalMelt,
      currencySymbol,
      totalMint,
      walletNumber
    } = stablecoinGet || {};
    return [
      tokenType === 1
        ? {
            label: t('statistic_analysis_0014'),
            value: reserveBalance,
            url: '/stablecoin/images/reserve-account.jpg',
            unit: currencySymbol
          }
        : {},
      tokenType === 1
        ? {
            label: t('statistic_analysis_0015'),
            value: repositoryBalance,
            url: '/stablecoin/images/balance-cbc.jpg',
            unit: symbol
          }
        : {},
      {
        label: t('statistic_analysis_0016').replace('****', symbol),
        value: circulation,
        url: '/stablecoin/images/circulation.svg',
        unit: symbol
      },
      {
        label:
          tokenType === 1
            ? t('stablecoin_manage_021')
            : t('statistic_analysis_0006'),
        value: totalMint,
        url:
          tokenType === 1
            ? '/stablecoin/images/total-mint.svg'
            : '/stablecoin/images/issuance.jpg',
        unit: symbol
      },
      {
        label:
          tokenType === 1
            ? t('stablecoin_manage_023')
            : t('statistic_analysis_0007'),
        value: totalMelt,
        url:
          tokenType === 1
            ? '/stablecoin/images/total-melt.svg'
            : '/stablecoin/images/melt-hsb.jpg',
        unit: symbol
      },
      {
        label: t('statistic_analysis_0013'),
        value: walletNumber,
        url: '/stablecoin/images/hsb-wallet.png',
        unit: ''
      }
    ];
  }, [t, stablecoinGet]);
  return (
    <div className="w-full flex justify-between mb-6">
      <div className=" bg-white shadow-lg rounded-xl p-4 !w-full">
        <div className="flex items-center">
          <span className="text-base font-extrabold">
            {`${coinData[activeKey]?.name} Statistics`}
          </span>
          <LibAxios
            url="/api/manage/v1/statistics/getStableCoin"
            method="POST"
            onSuccess={(data, response) => {
              console.log(data, 'data1231');
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
        </div>
        <div className="px-10 flex justify-between md:pt-10 w-[85%] m-auto">
          {stablecoinInfo.map((el, index) => {
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
                    {(el.unit ? el.value : el.value) + ' ' + el.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Statistics;
