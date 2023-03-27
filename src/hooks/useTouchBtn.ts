import { unsafeWindow } from '$';
import { reactive } from 'vue';
import { getIsMobileModel } from '../utils/getOS';

interface InitTouchConfig {
  top?: number;
  left?: number;
  stick?: boolean;
}

/**
 * 初始化触摸事件
 * @param {HTMLDivElement} dom
 */
export function initTouch(dom: HTMLDivElement, config?: InitTouchConfig) {
  dom.removeEventListener('touchstart', touchStart);
  dom.removeEventListener('mousedown', touchStart);
  dom.addEventListener('touchstart', touchStart, false);
  dom.addEventListener('mousedown', touchStart, false);

  let state = reactive<
    {
      dom: HTMLDivElement;
      offsetY: number;
      offsetX: number;
      config?: InitTouchConfig;
      state: 'start' | 'move' | 'end';
      move: boolean;
    } & Omit<Required<InitTouchConfig>, 'stick'>
  >({
    offsetX: 0,
    offsetY: 0,
    top: config?.top || 0,
    left: config?.left || 0,
    dom,
    config,
    state: 'end',
    move: false,
  });

  /**
   * 触摸开始
   * @param {TouchEvent | MouseEvent} event
   */
  function touchStart(event: TouchEvent | MouseEvent) {
    state.state = 'start';
    state.move = false;
    let clientX = 0;
    let clientY = 0;

    if (event instanceof TouchEvent) {
      clientX = event.changedTouches[0].clientX;
      clientY = event.changedTouches[0].clientY;

      dom.addEventListener('touchmove', touchMove, false);
      dom.addEventListener('touchend', touchEnd, false);
    } else {
      clientX = event.clientX;
      clientY = event.clientY;

      document.addEventListener('mousemove', touchMove, false);
      document.addEventListener('mouseup', touchEnd, false);
    }

    state.offsetX = clientX - state.dom.offsetLeft;
    state.offsetY = clientY - state.dom.offsetTop;
    // stopEventHandle(event);
  }

  /**
   * 移动事件
   * @param {TouchEvent | MouseEvent} event
   */
  function touchMove(event: TouchEvent | MouseEvent) {
    state.state = 'move';
    state.move = true;
    let clientX = 0;
    let clientY = 0;
    if (event instanceof TouchEvent) {
      clientX = event.changedTouches[0].clientX;
      clientY = event.changedTouches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const { offsetHeight, offsetWidth } = state.dom;
    state.left = Math.max(0, Math.min(clientX - state.offsetX, window.innerWidth - offsetWidth));
    state.top = Math.max(0, Math.min(clientY - state.offsetY, window.innerHeight - offsetHeight));
    // stopEventHandle(event);
  }

  function touchEnd(event: TouchEvent | MouseEvent) {
    state.state = 'end';
    dom.removeEventListener('touchmove', touchMove);
    dom.removeEventListener('touchend', touchEnd);
    document.removeEventListener('mousemove', touchMove);
    document.removeEventListener('mouseout', touchEnd);
    if (state.config?.stick) {
      if (state.left < window.innerWidth / 2) {
        state.left = state.config?.left || 0;
      } else {
        let webkitScrollbar = window
          .getComputedStyle(document.documentElement, '::-webkit-scrollbar')
          .getPropertyValue('display');
        let scrollWidth =
          document.documentElement.clientHeight < document.documentElement.offsetHeight &&
            webkitScrollbar !== 'none' &&
            !getIsMobileModel()
            ? 18
            : 0;

        state.left = window.innerWidth - (state.config?.left || 0) - dom.offsetWidth - scrollWidth;
      }
    }
    dom.addEventListener(
      'click',
      function (event) {
        if (state.move) {
          stopEventHandle(event);
        }
      },
      true
    );
    // stopEventHandle(event);
  }

  /**
   * 停止事件传播
   * @param event
   */
  function stopEventHandle(event: Event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  }
  return state;
}
