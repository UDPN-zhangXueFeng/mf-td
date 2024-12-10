import '../styles.css';
import { Button, Image } from 'antd';

export function LibEmpty() {
  return (
    <div className="w-8/12 mx-auto flex flex-col items-center my-40">
      <Image
        src="/assets/empty/empty.svg"
        alt=""
        preview={false}
        width={'18rem'}
        height={'18rem'}
      ></Image>
      <div className="text-center my-10 text-lg">12123132</div>
      <Button type="primary">123123123</Button>
    </div>
  );
}

export default LibEmpty;
