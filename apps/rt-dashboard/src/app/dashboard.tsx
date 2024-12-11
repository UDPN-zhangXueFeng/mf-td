import { useState } from 'react';
import { CustomTab } from './header';
import Main from './main';
import Charts from './chart';
export function Dashboard() {
  const [activeKey, setActiveKey] = useState(0);
  const [coinData, setCoinData] = useState<any[]>([]);
  return (
    <div className="">
      <CustomTab
        onClick={(key,info) => {
          if(info){
             setCoinData(info);
          }
          setActiveKey(key)
        }}
      />
    <Main activeKey={activeKey} coinData={coinData}/>
    <Charts activeKey={activeKey} coinData={coinData}/>
    </div>
  );
}

export default Dashboard;
