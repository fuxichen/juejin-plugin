import { unsafeWindow } from '$';
import dayjs from 'dayjs';
import { reactive, toRef } from 'vue';
import { globalFetch } from './useFetch';
import { useUserVIPInfo } from './useUserVIPInfo';

export const vipMaxPoint = {
  1: 30,
  2: 40,
  3: 50,
  4: 70,
  5: 100,
} as const;
const state = reactive<{
  userCoralReadingRewardsInfo: {
    vipLevel: keyof typeof vipMaxPoint;
    coralReadingRewards: number
  }
}>({
  userCoralReadingRewardsInfo: {
    vipLevel: 1,
    coralReadingRewards: 0
  }
});
export function useCoralReadingRewards() {
  let aid = unsafeWindow.TEAVisualEditor.appId;
  let cacheToken = JSON.parse(localStorage.getItem(`__tea_cache_tokens_${aid}`) || '{}');
  let userUniqueId = cacheToken['user_unique_id'];
  let { callback } = useUserVIPInfo();
  callback.then(res => {
    state.userCoralReadingRewardsInfo.vipLevel = (res.value?.vip_level || 1) as keyof typeof vipMaxPoint
  })
  globalFetch
    .request(
      `https://api.juejin.cn/user_api/v1/vip/point/get_month_record_page?aid=${aid}&uuid=${userUniqueId}&spider=0`,
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
        body: `{\"page_no\":1,\"page_size\":20,\"check_month\":\"${dayjs().format('YYYY-MM')}\"}`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      }
    )
    .then((res) => res.json())
    .then((res) => {
      let currentDateStr = dayjs().format('YYYY-MM-DD');
      let list = (res.data as any[]).filter(v => {
        let date = dayjs(v.record_time * 1000).format('YYYY-MM-DD');
        return v.point > 0 && date === currentDateStr
      });
      let total = list.reduce((p, v) => p + v.point, 0)
      console.log('阅读文章奖励: ', total);
      state.userCoralReadingRewardsInfo.coralReadingRewards = total

    });
  return { data: toRef(state, 'userCoralReadingRewardsInfo'), vipMaxPoint };
}