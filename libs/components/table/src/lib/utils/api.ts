import { request } from '@mf-td/lib-axios';
export const getLists = async (url:string,
  param: any,
) => {
  return request(url, {
    method: 'POST',
    data: param,
  });
};
