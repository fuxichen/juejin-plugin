import { unsafeWindow } from '$';
import { addHistoryListener } from '../utils/addHistoryListener';


export function useHideHotListPlugin() {
  let dom: HTMLDivElement | null
  function hidden(){
    setTimeout(() => {
      dom = document.querySelector('.hot-list-container.hot-list');
      if (dom) {
        dom.hidden = true;
      }
      console.dir(dom);
    }, 100);
  }
  return {
    start() {
      addHistoryListener(() => {
        if (new RegExp('^https://juejin.cn/$').test(location.href)) {
          hidden()
        }
      });
      hidden()
    },
    stop() {
      if (dom) {
        dom.hidden = false;
      }
    },
  };
}
