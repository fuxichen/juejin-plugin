import { unsafeWindow } from "$";
import InterceptorManager from "../utils/InterceptorManager";
import { cloneResponse, jsonToBlob, modeifyResponseBody } from "../utils/modeifyResponseBody";

type FetchParam = Parameters<WindowOrWorkerGlobalScope["fetch"]>
type RequestInterceptor = (...args: FetchParam) => FetchParam | void
type ResponseInterceptor = (value: ResponseType) => Promise<ResponseType> | ResponseType | void

interface ResponseType {
  data: any;
  status: number;
  statusText: string;
  config: {
    input: FetchParam[0],
    init?: FetchParam[1]
  };
}

const requestInterceptorList = new InterceptorManager<RequestInterceptor, any>()
const responseInterceptorList = new InterceptorManager<ResponseInterceptor, any>()

// 备份原始Fetch
let _fetch = unsafeWindow.fetch;

// 注入钩子
let newFetch = new Proxy(_fetch, {
  apply(target, thisArg, argArray: FetchParam) {
    // 请求拦截器
    requestInterceptorList.forEach((h) => {
      try {
        argArray = h.fulfilled?.(...argArray) ?? argArray;
      } catch (error) {
        h.rejected(error);
      }
    })

    let fetchInstance = useRawFetch()(...argArray);
    // 备份并解包
    let resultResponse: Response;
    let fetchChain = fetchInstance.then(res => {
      resultResponse = res;
      let newRes = cloneResponse(res);
      return newRes.json()
    }).then(res => {
      let data: ResponseType = {
        data: res,
        status: resultResponse.status,
        statusText: resultResponse.statusText,
        config: {
          input: argArray[0],
          init: argArray[1]
        }
      }
      return data
    })

    // 响应拦截器
    responseInterceptorList.forEach((h) => {
      fetchChain = fetchChain.then((value) => {
        // 执行拦截器
        let _result = h.fulfilled?.(value)

        // 处理拦截器未主动返回数据情况下的默认数据转递
        // 兼容异步函数和同步函数
        if (_result instanceof Promise) {
          _result = _result.then(res => {
            return res ?? value
          })
        } else {
          _result = Promise.resolve(_result ?? value)
        }

        return _result
      }, h.rejected)
    })
    // 封包
    fetchInstance = fetchChain.then(res => {
      return modeifyResponseBody(resultResponse, jsonToBlob(res.data))
    })
    return fetchInstance;
  },
});
unsafeWindow.fetch = newFetch

/**
 * 获取原始Fetch
 * @returns 
 */
export function useRawFetch() {
  return _fetch
}

export let globalFetch = {
  request: newFetch,
  interceptor:{
    requset: requestInterceptorList,
    response: responseInterceptorList,
  }
};