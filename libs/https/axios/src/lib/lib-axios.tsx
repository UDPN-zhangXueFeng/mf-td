import React, { useEffect, useState, ReactNode } from 'react';
import axios, {
  AxiosRequestConfig,
  Method,
  AxiosError,
  AxiosResponse
} from 'axios';

// 创建 Axios 实例
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理未授权错误
          break;
        case 403:
          // 处理禁止访问错误
          break;
        case 404:
          // 处理资源未找到错误
          break;
        default:
          // 处理其他错误
          break;
      }
    }
    return Promise.reject(error);
  }
);

interface HttpProps {
  url: string;
  method?: Method;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  responseType?:
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';
  immediate?: boolean;
  loading?: boolean;
  onSuccess?: (data: any, response?: AxiosResponse) => void; // 修改这里
  onError?: (error: any) => void;
  children?: ReactNode | ((props: RenderProps) => ReactNode);
  loadingRender?: ReactNode | (() => ReactNode);
  errorRender?: ReactNode | ((error: any) => ReactNode);
}

export interface RenderProps {
  data: any;
  loading: boolean;
  error: any;
  refetch: () => void;
}

export function LibAxios({
  url,
  method = 'GET',
  data,
  params,
  headers,
  responseType,
  immediate = true,
  loading: externalLoading,
  onSuccess,
  onError,
  children,
  loadingRender,
  errorRender
}: HttpProps) {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const config: AxiosRequestConfig = {
        url,
        method,
        params,
        data,
        headers,
        responseType
      };

      const result = await axiosInstance(config);
      setResponse(result.data);
      onSuccess?.(result.data, result);
    } catch (err) {
      setError(err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [url, method]);

  const renderLoading = () => {
    if (loadingRender) {
      return typeof loadingRender === 'function'
        ? loadingRender()
        : loadingRender;
    }
    return <div className="loading">Loading...</div>;
  };

  const renderError = () => {
    if (errorRender) {
      return typeof errorRender === 'function'
        ? errorRender(error)
        : errorRender;
    }
    return (
      <div className="error">
        Error: {error.message || 'Something went wrong'}
      </div>
    );
  };

  const renderContent = () => {
    if (typeof children === 'function') {
      return children({
        data: response,
        loading: loading || !!externalLoading,
        error,
        refetch: fetchData
      });
    }
    return children || <pre>{JSON.stringify(response, null, 2)}</pre>;
  };

  return (
    <div>
      {(loading || externalLoading) && renderLoading()}
      {error && renderError()}
      {!loading && !error && response && renderContent()}
    </div>
  );
}

// 使用示例
// export function LibAxios() {
//   // 用户列表类型定义
//   interface User {
//     id: number;
//     name: string;
//     email: string;
//   }

//   return (
//     <div>
//       <h1>HTTP 组件示例</h1>

//       {/* 使用渲染函数方式 */}
//       <HttpComponent
//         url="/api/users"
//         method="GET"
//         loadingRender={<div>加载中...</div>}
//         errorRender={(error) => <div>发生错误: {error.message}</div>}
//       >
//         {({ data, loading, error, refetch }: RenderProps) => (
//           <div>
//             <button onClick={refetch}>刷新数据</button>
//             {data && (
//               <ul>
//                 {(data as User[]).map(user => (
//                   <li key={user.id}>
//                     {user.name} - {user.email}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}
//       </HttpComponent>

//       {/* 使用普通子元素方式 */}
//       <HttpComponent
//         url="/api/posts"
//         method="GET"
//       >
//         <div className="posts-container">
//           {/* 这里的内容会在数据加载完成后显示 */}
//           <h2>文章列表</h2>
//           {/* 可以通过上下文或者状态管理来访问数据 */}
//         </div>
//       </HttpComponent>

//       {/* 自定义加载和错误显示 */}
//       <HttpComponent
//         url="/api/data"
//         loadingRender={() => (
//           <div className="custom-loading">
//             <span className="spinner"></span>
//             <p>正在加载数据...</p>
//           </div>
//         )}
//         errorRender={(error) => (
//           <div className="custom-error">
//             <h3>出错了！</h3>
//             <p>{error.message}</p>
//             <button onClick={() => window.location.reload()}>
//               重试
//             </button>
//           </div>
//         )}
//       >
//         {({ data }) => (
//           <div className="data-display">
//             <h3>数据展示</h3>
//             <pre>{JSON.stringify(data, null, 2)}</pre>
//           </div>
//         )}
//       </HttpComponent>
//     </div>
//   );
// }
