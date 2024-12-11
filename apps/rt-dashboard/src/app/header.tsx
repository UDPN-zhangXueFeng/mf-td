import { Dropdown, Image, Select } from 'antd';
import { LibAxios, RenderProps } from '@mf-td/lib-axios';
import { useState } from 'react';
export type HearderProps = {
  onClick: (key: number, info?: any) => void;
};
export const Hearder = (props: HearderProps) => {
  const [activeKey, setActiveKey] = useState(0);
  const [selectType, setSelectType] = useState(1);
  const [coinData, setCoinData] = useState();
  return (
    <div className="flex items-center mb-6 w-full">
      <LibAxios
        url="/api/manage/v1/common/stablecoin/enabled/searches"
        method="get"
        onSuccess={(data, response) => {
          props.onClick(0, data);
          setCoinData(data);
        }}
      >
        {({ data, refetch }: RenderProps) => {
          if (selectType === 1) {
            return (
              <div className="flex flex-wrap items-center px-1 bg-white py-1 border border-solid  rounded-md border-indigo-200 max-w-[90%]">
                {data &&
                  data.map((el: any, index: number) => {
                    return (
                      <div
                        onClick={() => {
                          setActiveKey(() => index);
                          props.onClick(index, coinData);
                        }}
                        key={el.code}
                        className={`px-4 cursor-pointer py-2 rounded-md flex items-center ml-1 ${
                          activeKey === index ? 'text-theme bg-[#DEDEFA]' : ''
                        }`}
                      >
                        <Image
                          src={`./assets/images/token_type_${
                            el.tokenType || el.issueType
                          }.svg`}
                          alt="q"
                          preview={false}
                          className="w-5 mr-1"
                        />
                        {el && el.name ? el.name : el}
                      </div>
                    );
                  })}
              </div>
            );
          } else {
            return (
              <Select
                defaultValue="0"
                style={{
                  margin: '2px'
                }}
                options={
                  data &&
                  data.map((el: any, index: number) => {
                    return {
                      value: String(index),
                      label: (
                        <div>
                          <Image
                            src={`./assets/images/token_type_${
                              el.tokenType || el.issueType
                            }.svg`}
                            alt=""
                            preview={false}
                            rootClassName="w-5 mr-1"
                          />
                          {el && el.name ? el.name : el}
                        </div>
                      )
                    };
                  })
                }
                onChange={(value: any) => {
                  setActiveKey(() => Number(value));
                  props.onClick(Number(value), coinData);
                }}
              />
            );
          }
        }}
      </LibAxios>
      <Dropdown
        menu={{
          selectable: true,
          defaultSelectedKeys: ['1'],
          items: [
            {
              key: '1',
              label: 'Tabs',
              onClick: () => {
                setActiveKey(0);
                setSelectType(1);
                props.onClick(0, coinData);
              }
            },
            {
              key: '2',
              label: 'Dropdown Lists',
              onClick: () => {
                setActiveKey(0);
                setSelectType(2);
                props.onClick(0, coinData);
              }
            }
          ]
        }}
        placement="bottom"
        arrow
      >
        <div
          className="w-6 h-6 ml-4 cursor-pointer"
          style={{
            background: 'url(./assets/images/setting.jpg) no-repeat',
            backgroundSize: '100%'
          }}
        >
          awdaw
        </div>
      </Dropdown>
    </div>
  );
};
export default Hearder;
