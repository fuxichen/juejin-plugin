import { unsafeWindow } from '$';
import dayjs from 'dayjs';
import { globalFetch } from '../hooks/useFetch';

let activeData = [
  {
    id: 1,
    date: ['2023-04-03', '2023-04-09'],
    topicList: [
      {
        id: '6824710202248396813',
        name: '读书会',
      },
      {
        id: '6824710202873348104',
        name: '打工人的日常',
      },
    ],
  },
  {
    id: 2,
    date: ['2023-04-10', '2023-04-16'],
    topicList: [
      {
        id: '6931179346187321351',
        name: '理财交流圈',
      },
      {
        id: '6931914335023267853',
        name: '游戏玩家俱乐部',
      },
    ],
  },
  {
    id: 3,
    date: ['2023-04-17', '2023-04-23'],
    topicList: [
      {
        id: '6931915139369140224',
        name: '搞笑段子',
      },
      {
        id: '6824710202562969614',
        name: '今天学到了',
      },
    ],
  },
  {
    id: 4,
    date: ['2023-04-24', '2023-04-30'],
    topicList: [
      {
        id: '6824710202302922759',
        name: '舌尖上的沸点'
      },
      {
        id: '6824710203464761352',
        name: '今日新鲜事'
      }
    ],
  },
];

export type TopicItem = {
  id: string;
  name: string;
}
export type ClockInData = {
  dateUnix: number;
  dateStr: string;
  topicList: TopicItem[];
  festival: string;
  check: number;
};

let festivalData = [
  '立春',
  '雨水',
  '清明',
  '惊蛰',
  '春分',
  '谷雨',
  '春季补签',
  '立夏',
  '小满',
  '芒种',
  '夏至',
  '小暑',
  '大暑',
  '夏季补签',
  '立秋',
  '处暑',
  '白露',
  '秋分',
  '寒露',
  '霜降',
  '秋季补签',
  '立冬',
  '小雪',
  '大雪',
  '冬至',
  '小寒',
  '大寒',
  '冬季补签',
];

export function useFishPlanPlugin() {
  let _startDate = dayjs('2023-04-03').startOf('day');
  let todayUnix = dayjs().startOf('day').unix()
  let clockInData: ClockInData[] = activeData.flatMap((v) => {
    let [startData, endData] = v.date;
    let startDate = dayjs(startData).startOf('day');
    let endDate = dayjs(endData).startOf('day');
    let list = [];
    for (; startDate.unix() <= endDate.unix(); startDate = startDate.add(1, 'day')) {
      list.push({
        dateUnix: startDate.unix(),
        dateStr: startDate.format('MM.DD'),
        topicList: [...v.topicList.map(v => Object.assign({}, v))],
        festival: festivalData[startDate.diff(_startDate, 'day')],
        check: todayUnix > startDate.unix() ? -1 : 0,
      });
    }
    return list;
  });
  let aid: any, cacheToken: any, userUniqueId: any, slardarData: any, cursor: any

  function getLsit(cursor: number) {
    return globalFetch
      .request(
        `https://api.juejin.cn/content_api/v1/short_msg/query_list?aid=${aid}&uuid=${userUniqueId}&spider=0`,
        {
          headers: {
            accept: '*/*',
            'accept-language': 'zh-CN,zh;q=0.9',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'x-secsdk-csrf-token':
              '0001000000011ada49f1c3d31fed290f27d4b5eaa5fb3ae53156af4d3893d218bea6aaec53e6175392e14eed34c2',
          },
          referrer: 'https://juejin.cn/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: `{"sort_type":4,"cursor":"${cursor}","limit":20,"user_id":"${slardarData.userId}"}`,
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        }
      )
      .then((res) => res.json());
  }

  return {
    async start() {
      aid = unsafeWindow.TEAVisualEditor.appId;
      cacheToken = JSON.parse(localStorage.getItem(`__tea_cache_tokens_${aid}`) || '{}');
      userUniqueId = cacheToken['user_unique_id'];
      slardarData = JSON.parse(localStorage.getItem(`SLARDAR${aid}`) || '{}');
      cursor = 0;
      let state = false;
      let arrList: any[] = [];
      while (!state) {
        await getLsit(cursor).then((res) => {
          let { err_no: errNo, data } = res;
          if (errNo === 0) {
            cursor = res.cursor;
            arrList.push(...data);
            state = data.some((v: any) => Number(v.msg_Info.ctime) < 1680451200);
          }
        });
      }
      // 过滤无效数据，action = 2 为 沸点数据
      arrList = arrList.filter((v: any) => Number(v.msg_Info.ctime) >= 1680451200);
      console.log(arrList.length);
      arrList.forEach((v: any) => {
        // console.log(v);
        let dateUnix = dayjs(Number(v.msg_Info.ctime * 1000))
          .startOf('day')
          .unix();
        let item = clockInData.find((v) => v.dateUnix === dateUnix);
        if (item && item.check !== 1) {
          if (item.topicList.find(v2 => v2.id === v.topic.topic_id)) {
            item.check = 1;
          }
        }
      });
      return clockInData;
    },
    stop() { },
  };
}
