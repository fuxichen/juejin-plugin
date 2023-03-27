import { Dep, Watch } from './watch';
import type { Callback } from './watch';
import { unsafeWindow } from '$';

var historyDep = new Dep();

function handleHistoryMethod(name: 'pushState' | 'replaceState') {
  var method = unsafeWindow.history[name];
  return function (data: any, unused: string, url?: string | URL | null | undefined) {
    method.call(history, data, unused, url);
    historyDep.notify();
  };
}
history.pushState = handleHistoryMethod('pushState');
history.replaceState = handleHistoryMethod('replaceState');

export function addHistoryListener(fn: Callback) {
  var event = new Watch('history', fn);
  Dep.watch = event;
  historyDep.defined();
  Dep.watch = null; //置空供下一个订阅者使用
}
