import { unsafeWindow } from '$';
import InterceptorManager from '../utils/InterceptorManager';

type OpenParam = Parameters<typeof window.open>;
type OpenReturn = ReturnType<typeof window.open>;
const requestInterceptorList = new InterceptorManager<(...args: OpenParam) => OpenParam, any>();
const responseInterceptorList = new InterceptorManager<
  (param: OpenParam, result: OpenReturn) => OpenReturn,
  any
>();

// 备份原始open函数
let _open = unsafeWindow.open;

// 注入钩子
let newOpen = new Proxy(_open, {
  apply(target, thisArg, argArray: OpenParam) {
    // 请求拦截器
    requestInterceptorList.forEach((h) => {
      try {
        argArray = h.fulfilled?.(...argArray) ?? argArray;
      } catch (error) {
        h.rejected(error);
      }
    });

    let result = useRawOpen()(...argArray);

    // 响应拦截器
    responseInterceptorList.forEach((h) => {
      try {
        result = h.fulfilled?.(argArray, result) ?? result;
      } catch (error) {
        h.rejected(error);
      }
    });

    return result;
  },
});
unsafeWindow.open = newOpen;

/**
 * 获取原始Fetch
 * @returns
 */
export function useRawOpen() {
  return _open;
}

export let globalOpen = {
  open: newOpen,
  interceptor: {
    requset: requestInterceptorList,
    response: responseInterceptorList,
  },
};
