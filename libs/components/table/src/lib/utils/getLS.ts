/*
 * @Author: W·S
 * @Date: 2022-12-19 16:48:49
 * @LastEditors: D.W
 * @LastEditTime: 2024-12-12 15:14:28
 * @Description: Description
 */
/** @description */
export const getLS = (key: string) => {
  if (typeof window !== 'undefined') {
    const Breadcrumbs = window.localStorage.getItem(key);
    return Breadcrumbs ? JSON.parse(Breadcrumbs) : null;
  }
  return null; // Return a default value when running on the server
};
