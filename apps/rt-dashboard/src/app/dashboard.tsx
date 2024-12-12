import { useState } from 'react';
import Header from './header';
import Statistics from './statistics';
import WalletCharts from './wallet_chart';
import TransactionCharts from './transaction_chart';
export function Dashboard() {
  // 当前选中的币种索引
  const [activeKey, setActiveKey] = useState(0);
  // 币种列表
  const [coinData, setCoinData] = useState<any[]>([]);
  return (
    <div className="">
      <Header
        onClick={(key, info) => {
          if (info) {
            setCoinData(info);
          }
          setActiveKey(key);
        }}
      />
      <Statistics activeKey={activeKey} coinData={coinData} />
      <WalletCharts activeKey={activeKey} coinData={coinData} />
      <TransactionCharts activeKey={activeKey} coinData={coinData} />
    </div>
  );
}

export default Dashboard;
