export type Callback = (name: string) => any
export class Dep {                  // 订阅池
  id: Date
  subs: Watch[]
  static watch: Watch | null
  constructor(name?: string) {
    this.id = new Date() //这里简单的运用时间戳做订阅池的ID
    this.subs = []       //该事件下被订阅对象的集合
  }
  defined() {              // 添加订阅者
    Dep.watch!.add(this);
  }
  notify() {              //通知订阅者有变化
    this.subs.forEach((e, i) => {
      if (typeof e.update === 'function') {
        try {
          e.update.apply(e)  //触发订阅者更新函数
        } catch (err) {
          console.warn(err)
        }
      }
    })
  }

}
Dep.watch = null;

export class Watch {
  callBack: Callback;
  name: string;
  id: Date
  constructor(name: string, fn: Callback) {
    this.name = name;       //订阅消息的名称
    this.id = new Date();   //这里简单的运用时间戳做订阅者的ID
    this.callBack = fn;     //订阅消息发送改变时->订阅者执行的回调函数     
  }
  add(dep: Dep) {                  //将订阅者放入dep订阅池
    dep.subs.push(this);
  }
  update() {                  //将订阅者更新方法
    var cb = this.callBack; //赋值为了不改变函数内调用的this
    cb(this.name);
  }
}