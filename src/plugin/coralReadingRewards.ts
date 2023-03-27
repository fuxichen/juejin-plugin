import { watch, nextTick, WatchStopHandle } from 'vue';
import { useCoralReadingRewards } from '../hooks/useCoralReadingRewards';
import { addHistoryListener } from '../utils/addHistoryListener';

export function coralReadingRewards() {
  let { data, vipMaxPoint } = useCoralReadingRewards();
  let channel: BroadcastChannel;
  let watchStop: WatchStopHandle;
  function setDom(restore: boolean = false) {
    let dom = document.querySelector('.vip-entry .vip-words');
    if (dom) {
      dom.textContent = `会员${
        restore
          ? ''
          : `(${Math.floor(data.value.coralReadingRewards / 10)}/${Math.floor(
              vipMaxPoint[data.value.vipLevel] / 10
            )})`
      }`;
      syncData();
    }
  }

  function syncData() {
    if (new RegExp('https://juejin.cn/post/.*?').test(location.href)) {
      channel?.postMessage({
        data: {
          coralReadingRewards: data.value.coralReadingRewards,
          vipLevel: data.value.vipLevel,
        },
        vipMaxPoint: vipMaxPoint,
      });
    }
  }
  function getData() {
    let res = useCoralReadingRewards();
    data = res.data;
    vipMaxPoint = res.vipMaxPoint;
    nextTick(() => {
      setDom();
    });
  }
  return {
    start() {
      let syncDataState = true;
      watchStop = watch(
        data,
        (val, oldVal) => {
          if (syncDataState) {
            setDom();
          } else {
            syncDataState = true;
          }
        },
        { deep: true }
      );
      addHistoryListener(getData);
      channel = new BroadcastChannel('modifyCoralReadingRewardsInfo');
      channel.onmessage = (e) => {
        let { data: newDate } = e;
        syncDataState = false;
        vipMaxPoint = newDate.vipMaxPoint;
        data.value.coralReadingRewards = newDate.data.coralReadingRewards;
        data.value.vipLevel = newDate.data.vipLevel;
      };
      getData();
    },
    stop() {
      watchStop && watchStop();
      channel && channel.close();
      setDom(true);
    },
  };
}
