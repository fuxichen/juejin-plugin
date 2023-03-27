import { reactive, toRef } from 'vue';
import { globalFetch } from './useFetch';

const state = reactive<{
  userVIPInfo: {
    vip_level: number;
  } | null
}>({ userVIPInfo: null });
export function useUserVIPInfo() {
  let p,
    data = toRef(state, 'userVIPInfo')
  if (state.userVIPInfo === null) {
    p = globalFetch
      .request(
        'https://api.juejin.cn/user_api/v1/vip/info?aid=2608&uuid=7195360224517277239&spider=0',
        {
          headers: {
            accept: '*/*',
            'accept-language': 'zh-CN,zh;q=0.9',
            'content-type': 'application/json',
            'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
          },
          referrer: 'https://juejin.cn/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: '{"need_counter":0}',
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        }
      )
      .then((res) => res.json())
  } else {
    p = Promise.resolve({ data: { vip_info: state.userVIPInfo } })
  }
  p = p.then((res) => {
    state.userVIPInfo = res.data.vip_info;
    return data
  });

  return { data, callback: p };
}
