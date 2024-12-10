import { LibLayout } from '@mf-td/lib-layout';
import { useEffect } from 'react';

const MainGuardRoutes = () => {
  const logo = (
    <div className="flex justify-center items-center">
      <img
        src="../../assets/images/layout/logo-icon.svg"
        className="w-[5.5rem]"
        alt="logo"
      />
    </div>
  );
  const user = (
    <div className=" text-white">
      <span>
        Welcome
        <span className="ml-2">123123123</span>
      </span>
    </div>
  );
  useEffect(() => {
    document.title = 'Tokenized Deposit/Stablecoin Management System';
  }, []);
  return <LibLayout logo={logo} user={user} />;
};

export default MainGuardRoutes;
