export type HandleType<T, P> = { fulfilled?: T; rejected?: P };
export class InterceptorManager<T, P> {
  handlers: (HandleType<T, P> | null)[] = [];
  constructor() {
    this.handlers = [];
  }
  /**
   * 添加拦截器(订阅)
   * @param fulfilled 
   * @param rejected 
   * @returns {number} 拦截器id
   */
  use(fulfilled?: T, rejected?: P) {
    this.handlers.push({
      fulfilled,
      rejected,
    });
    return this.handlers.length - 1;
  }
  /**
   * 删除拦截器
   * @param id 拦截器id
   */
  eject(id: number) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * 清空拦截器
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * 遍历拦截器(发布)
   * @param fn 
   */
  forEach(fn: (h: HandleType<T, P>) => any) {
    for (let i = 0; i < this.handlers.length; i++) {
      const h = this.handlers[i];
      if (h !== null) {
        fn(h);
      }
    }
  }
}

export default InterceptorManager;
