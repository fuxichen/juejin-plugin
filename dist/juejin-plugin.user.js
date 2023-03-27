// ==UserScript==
// @name         juejin-plugin
// @namespace    https://juejin.cn/user/3949101499816712
// @version      0.1.0
// @author       fuxichen
// @description  一个掘金插件，目前支持沸点关键字屏蔽、会员文章阅读任务提示、以及隐藏首页榜单.后期会新增bug收集提醒、沸点用户屏蔽等功能，关注我的掘金（bycandy）后期会推源码及文章
// @icon         https://vitejs.dev/logo.svg
// @match        https://juejin.cn/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.global.prod.min.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-plus/2.2.29/index.full.min.js
// @resource     ElementPlusCss  https://cdnjs.cloudflare.com/ajax/libs/element-plus/2.2.29/index.css
// @grant        GM_getResourceText
// @grant        unsafeWindow
// ==/UserScript==

(e=>{const d=document.createElement("style");d.dataset.source="vite-plugin-monkey",d.innerText=e,document.head.appendChild(d)})(".container[data-v-2d76db16]{position:fixed;top:var(--top);left:var(--left);z-index:99999;width:auto}.icon-container[data-v-2d76db16]{background-color:#fff;display:flex;align-items:center;justify-content:center;border-radius:100%;width:4rem;height:4rem;box-shadow:0 0 10px #7197dd4d;cursor:grab;user-select:none}.icon[data-v-2d76db16]{width:26px}.panel[data-v-2d76db16]{position:absolute;background-color:#fff;width:300px;padding:10px;border-radius:10px;box-shadow:0 0 10px #7197dd4d;top:calc(4rem + 10px)}[data-v-2d76db16] input[type=text]{border:unset}[data-v-2d76db16] .hidden-popper .el-popper{display:none}");

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(vue, ElementPlus2, dayjs2) {
  "use strict";
  const style = "";
  const cssLoader = (e) => {
    const t = GM_getResourceText(e), o = document.createElement("style");
    return o.innerText = t, document.head.append(o), t;
  };
  cssLoader("ElementPlusCss");
  function getIsMobileModel() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  function initTouch(dom, config) {
    dom.removeEventListener("touchstart", touchStart);
    dom.removeEventListener("mousedown", touchStart);
    dom.addEventListener("touchstart", touchStart, false);
    dom.addEventListener("mousedown", touchStart, false);
    let state2 = vue.reactive({
      offsetX: 0,
      offsetY: 0,
      top: (config == null ? void 0 : config.top) || 0,
      left: (config == null ? void 0 : config.left) || 0,
      dom,
      config,
      state: "end",
      move: false
    });
    function touchStart(event) {
      state2.state = "start";
      state2.move = false;
      let clientX = 0;
      let clientY = 0;
      if (event instanceof TouchEvent) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
        dom.addEventListener("touchmove", touchMove, false);
        dom.addEventListener("touchend", touchEnd, false);
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
        document.addEventListener("mousemove", touchMove, false);
        document.addEventListener("mouseup", touchEnd, false);
      }
      state2.offsetX = clientX - state2.dom.offsetLeft;
      state2.offsetY = clientY - state2.dom.offsetTop;
    }
    function touchMove(event) {
      state2.state = "move";
      state2.move = true;
      let clientX = 0;
      let clientY = 0;
      if (event instanceof TouchEvent) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      const { offsetHeight, offsetWidth } = state2.dom;
      state2.left = Math.max(0, Math.min(clientX - state2.offsetX, window.innerWidth - offsetWidth));
      state2.top = Math.max(0, Math.min(clientY - state2.offsetY, window.innerHeight - offsetHeight));
    }
    function touchEnd(event) {
      var _a, _b, _c;
      state2.state = "end";
      dom.removeEventListener("touchmove", touchMove);
      dom.removeEventListener("touchend", touchEnd);
      document.removeEventListener("mousemove", touchMove);
      document.removeEventListener("mouseout", touchEnd);
      if ((_a = state2.config) == null ? void 0 : _a.stick) {
        if (state2.left < window.innerWidth / 2) {
          state2.left = ((_b = state2.config) == null ? void 0 : _b.left) || 0;
        } else {
          let webkitScrollbar = window.getComputedStyle(document.documentElement, "::-webkit-scrollbar").getPropertyValue("display");
          let scrollWidth = document.documentElement.clientHeight < document.documentElement.offsetHeight && webkitScrollbar !== "none" && !getIsMobileModel() ? 18 : 0;
          state2.left = window.innerWidth - (((_c = state2.config) == null ? void 0 : _c.left) || 0) - dom.offsetWidth - scrollWidth;
        }
      }
      dom.addEventListener(
        "click",
        function(event2) {
          if (state2.move) {
            stopEventHandle(event2);
          }
        },
        true
      );
    }
    function stopEventHandle(event) {
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
    return state2;
  }
  var monkeyWindow = window;
  var unsafeWindow = /* @__PURE__ */ (() => {
    return monkeyWindow.unsafeWindow;
  })();
  class InterceptorManager {
    constructor() {
      __publicField(this, "handlers", []);
      this.handlers = [];
    }
    /**
     * 添加拦截器(订阅)
     * @param fulfilled 
     * @param rejected 
     * @returns {number} 拦截器id
     */
    use(fulfilled, rejected) {
      this.handlers.push({
        fulfilled,
        rejected
      });
      return this.handlers.length - 1;
    }
    /**
     * 删除拦截器
     * @param id 拦截器id
     */
    eject(id) {
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
    forEach(fn) {
      for (let i = 0; i < this.handlers.length; i++) {
        const h = this.handlers[i];
        if (h !== null) {
          fn(h);
        }
      }
    }
  }
  function modeifyResponseBody(res, body) {
    let newRes = new Response(body, {
      headers: res.headers,
      status: res.status,
      statusText: res.statusText
    });
    Object.defineProperties(newRes, {
      url: { value: res.url },
      type: {
        value: res.type
      }
    });
    return newRes;
  }
  function jsonToBlob(data) {
    return new Blob([JSON.stringify(data)], {
      type: "application/json"
    });
  }
  function cloneResponse(res) {
    let newRes = res.clone();
    return modeifyResponseBody(res, newRes.body);
  }
  const requestInterceptorList = new InterceptorManager();
  const responseInterceptorList = new InterceptorManager();
  let _fetch = unsafeWindow.fetch;
  let newFetch = new Proxy(_fetch, {
    apply(target, thisArg, argArray) {
      requestInterceptorList.forEach((h) => {
        var _a;
        try {
          argArray = ((_a = h.fulfilled) == null ? void 0 : _a.call(h, ...argArray)) ?? argArray;
        } catch (error) {
          h.rejected(error);
        }
      });
      let fetchInstance = useRawFetch()(...argArray);
      let resultResponse;
      let fetchChain = fetchInstance.then((res) => {
        resultResponse = res;
        let newRes = cloneResponse(res);
        return newRes.json();
      }).then((res) => {
        let data = {
          data: res,
          status: resultResponse.status,
          statusText: resultResponse.statusText,
          config: {
            input: argArray[0],
            init: argArray[1]
          }
        };
        return data;
      });
      responseInterceptorList.forEach((h) => {
        fetchChain = fetchChain.then((value) => {
          var _a;
          let _result = (_a = h.fulfilled) == null ? void 0 : _a.call(h, value);
          if (_result instanceof Promise) {
            _result = _result.then((res) => {
              return res ?? value;
            });
          } else {
            _result = Promise.resolve(_result ?? value);
          }
          return _result;
        }, h.rejected);
      });
      fetchInstance = fetchChain.then((res) => {
        return modeifyResponseBody(resultResponse, jsonToBlob(res.data));
      });
      return fetchInstance;
    }
  });
  unsafeWindow.fetch = newFetch;
  function useRawFetch() {
    return _fetch;
  }
  let globalFetch = {
    request: newFetch,
    interceptor: {
      requset: requestInterceptorList,
      response: responseInterceptorList
    }
  };
  function usePinsBlackPlugin() {
    let id = null;
    return {
      start(blackKeyList = []) {
        if (id !== null) {
          this.stop();
        }
        id = globalFetch.interceptor.response.use((res) => {
          if (res.config.input.startsWith("https://api.juejin.cn/recommend_api/v1/short_msg/recommend")) {
            res.data.data = res.data.data.filter((v) => {
              return !blackKeyList.some((key) => v.msg_Info.content.includes(key));
            });
            return res;
          }
        });
      },
      stop() {
        if (id !== null) {
          globalFetch.interceptor.response.eject(id);
        }
      }
    };
  }
  const state$1 = vue.reactive({ userVIPInfo: null });
  function useUserVIPInfo() {
    let p, data = vue.toRef(state$1, "userVIPInfo");
    if (state$1.userVIPInfo === null) {
      p = globalFetch.request(
        "https://api.juejin.cn/user_api/v1/vip/info?aid=2608&uuid=7195360224517277239&spider=0",
        {
          headers: {
            accept: "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
          },
          referrer: "https://juejin.cn/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: '{"need_counter":0}',
          method: "POST",
          mode: "cors",
          credentials: "include"
        }
      ).then((res) => res.json());
    } else {
      p = Promise.resolve({ data: { vip_info: state$1.userVIPInfo } });
    }
    p = p.then((res) => {
      state$1.userVIPInfo = res.data.vip_info;
      return data;
    });
    return { data, callback: p };
  }
  const vipMaxPoint = {
    1: 30,
    2: 40,
    3: 50,
    4: 70,
    5: 100
  };
  const state = vue.reactive({
    userCoralReadingRewardsInfo: {
      vipLevel: 1,
      coralReadingRewards: 0
    }
  });
  function useCoralReadingRewards() {
    let aid = unsafeWindow.TEAVisualEditor.appId;
    let cacheToken = JSON.parse(localStorage.getItem(`__tea_cache_tokens_${aid}`) || "{}");
    let userUniqueId = cacheToken["user_unique_id"];
    let { callback } = useUserVIPInfo();
    callback.then((res) => {
      var _a;
      state.userCoralReadingRewardsInfo.vipLevel = ((_a = res.value) == null ? void 0 : _a.vip_level) || 1;
    });
    globalFetch.request(
      `https://api.juejin.cn/user_api/v1/vip/point/get_month_record_page?aid=${aid}&uuid=${userUniqueId}&spider=0`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/json",
          "sec-ch-ua": '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site"
        },
        referrer: "https://juejin.cn/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: `{"page_no":1,"page_size":20,"check_month":"${dayjs2().format("YYYY-MM")}"}`,
        method: "POST",
        mode: "cors",
        credentials: "include"
      }
    ).then((res) => res.json()).then((res) => {
      let currentDateStr = dayjs2().format("YYYY-MM-DD");
      let list = res.data.filter((v) => {
        let date = dayjs2(v.record_time * 1e3).format("YYYY-MM-DD");
        return v.point > 0 && date === currentDateStr;
      });
      let total = list.reduce((p, v) => p + v.point, 0);
      console.log("阅读文章奖励: ", total);
      state.userCoralReadingRewardsInfo.coralReadingRewards = total;
    });
    return { data: vue.toRef(state, "userCoralReadingRewardsInfo"), vipMaxPoint };
  }
  const _Dep = class {
    constructor(name) {
      // 订阅池
      __publicField(this, "id");
      __publicField(this, "subs");
      this.id = new Date();
      this.subs = [];
    }
    defined() {
      _Dep.watch.add(this);
    }
    notify() {
      this.subs.forEach((e, i) => {
        if (typeof e.update === "function") {
          try {
            e.update.apply(e);
          } catch (err) {
            console.warn(err);
          }
        }
      });
    }
  };
  let Dep = _Dep;
  __publicField(Dep, "watch");
  Dep.watch = null;
  class Watch {
    constructor(name, fn) {
      __publicField(this, "callBack");
      __publicField(this, "name");
      __publicField(this, "id");
      this.name = name;
      this.id = new Date();
      this.callBack = fn;
    }
    add(dep) {
      dep.subs.push(this);
    }
    update() {
      var cb = this.callBack;
      cb(this.name);
    }
  }
  var historyDep = new Dep();
  function handleHistoryMethod(name) {
    var method = unsafeWindow.history[name];
    return function(data, unused, url) {
      method.call(history, data, unused, url);
      historyDep.notify();
    };
  }
  history.pushState = handleHistoryMethod("pushState");
  history.replaceState = handleHistoryMethod("replaceState");
  function addHistoryListener(fn) {
    var event = new Watch("history", fn);
    Dep.watch = event;
    historyDep.defined();
    Dep.watch = null;
  }
  function coralReadingRewards() {
    let { data, vipMaxPoint: vipMaxPoint2 } = useCoralReadingRewards();
    let channel;
    let watchStop;
    function setDom(restore = false) {
      let dom = document.querySelector(".vip-entry .vip-words");
      if (dom) {
        dom.textContent = `会员${restore ? "" : `(${Math.floor(data.value.coralReadingRewards / 10)}/${Math.floor(
          vipMaxPoint2[data.value.vipLevel] / 10
        )})`}`;
        syncData();
      }
    }
    function syncData() {
      if (new RegExp("https://juejin.cn/post/.*?").test(location.href)) {
        channel == null ? void 0 : channel.postMessage({
          data: {
            coralReadingRewards: data.value.coralReadingRewards,
            vipLevel: data.value.vipLevel
          },
          vipMaxPoint: vipMaxPoint2
        });
      }
    }
    function getData() {
      let res = useCoralReadingRewards();
      data = res.data;
      vipMaxPoint2 = res.vipMaxPoint;
      vue.nextTick(() => {
        setDom();
      });
    }
    return {
      start() {
        let syncDataState = true;
        watchStop = vue.watch(
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
        channel = new BroadcastChannel("modifyCoralReadingRewardsInfo");
        channel.onmessage = (e) => {
          let { data: newDate } = e;
          syncDataState = false;
          vipMaxPoint2 = newDate.vipMaxPoint;
          data.value.coralReadingRewards = newDate.data.coralReadingRewards;
          data.value.vipLevel = newDate.data.vipLevel;
        };
        getData();
      },
      stop() {
        watchStop && watchStop();
        channel && channel.close();
        setDom(true);
      }
    };
  }
  function useHideHotListPlugin() {
    let dom;
    function hidden() {
      setTimeout(() => {
        dom = document.querySelector(".hot-list-container.hot-list");
        if (dom) {
          dom.hidden = true;
        }
        console.dir(dom);
      }, 100);
    }
    return {
      start() {
        addHistoryListener(() => {
          if (new RegExp("^https://juejin.cn/$").test(location.href)) {
            hidden();
          }
        });
        hidden();
      },
      stop() {
        if (dom) {
          dom.hidden = false;
        }
      }
    };
  }
  const _withScopeId = (n) => (vue.pushScopeId("data-v-2d76db16"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("img", {
    class: "icon",
    draggable: false,
    src: "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/6c61ae65d1c41ae8221a670fa32d05aa.svg"
  }, null, -1));
  const _hoisted_2 = [
    _hoisted_1
  ];
  const _hoisted_3 = ["onClick", "onMousedown", "onTouchstart"];
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      let pinsBlackObj = usePinsBlackPlugin();
      let cralReadingRewardsObj = coralReadingRewards();
      let hideHotListPlugin = useHideHotListPlugin();
      let defaultFormData = {
        pinsBlackState: false,
        blackKeyList: ["星期四"],
        coralReadingRewardsState: false,
        hideHotListState: false
      };
      let state2 = vue.reactive({
        top: 150,
        left: 10,
        panelState: {
          position: "left"
        },
        open: false,
        moveState: false,
        formData: JSON.parse(localStorage.getItem("fromData") || JSON.stringify(defaultFormData))
      });
      let iconContainer = vue.ref();
      vue.onMounted(() => {
        if (iconContainer.value) {
          let data = initTouch(iconContainer.value, { top: 150, left: 10, stick: true });
          vue.watch(data, () => {
            state2.top = data.top;
            state2.left = data.left;
            state2.moveState = data.state !== "end";
            state2.panelState.position = state2.left < window.innerWidth / 2 ? "left" : "right";
          });
        }
      });
      function showContent() {
        state2.open = !state2.open;
      }
      vue.watch(
        () => state2.formData,
        (val) => {
          localStorage.setItem("fromData", JSON.stringify(val));
        },
        { deep: true, immediate: true }
      );
      vue.watch(
        () => ({ list: state2.formData.blackKeyList, state: state2.formData.pinsBlackState }),
        (val) => {
          if (val.state) {
            pinsBlackObj.start(val.list);
          } else {
            pinsBlackObj.stop();
          }
        },
        { deep: true, immediate: true }
      );
      vue.watch(
        () => state2.formData.coralReadingRewardsState,
        (val) => {
          if (val) {
            cralReadingRewardsObj.start();
          } else {
            cralReadingRewardsObj.stop();
          }
        },
        { immediate: true }
      );
      vue.watch(
        () => state2.formData.hideHotListState,
        (val) => {
          if (val) {
            hideHotListPlugin.start();
          } else {
            hideHotListPlugin.stop();
          }
        },
        { immediate: true }
      );
      return (_ctx, _cache) => {
        const _component_ElOption = vue.resolveComponent("ElOption");
        const _component_ElSelect = vue.resolveComponent("ElSelect");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "container",
          ref_key: "iconContainer",
          ref: iconContainer,
          style: vue.normalizeStyle({ "--top": `${vue.unref(state2).top}px`, "--left": `${vue.unref(state2).left}px` })
        }, [
          vue.createElementVNode("div", {
            class: "icon-container",
            onClick: showContent
          }, _hoisted_2),
          vue.unref(state2).open ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "panel",
            onClick: vue.withModifiers(($event) => false, ["stop"]),
            onMousedown: vue.withModifiers(($event) => false, ["stop"]),
            onTouchstart: vue.withModifiers(($event) => false, ["stop"]),
            style: vue.normalizeStyle({ [`${vue.unref(state2).panelState.position}`]: 0 })
          }, [
            vue.createVNode(vue.unref(ElementPlus2.ElForm), {
              model: vue.unref(state2).formData
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(ElementPlus2.ElFormItem), { label: "沸点关键字屏蔽" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(ElementPlus2.ElSwitch), {
                      modelValue: vue.unref(state2).formData.pinsBlackState,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(state2).formData.pinsBlackState = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(vue.unref(ElementPlus2.ElFormItem), { label: "关键字列表" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_ElSelect, {
                      class: "hidden-popper",
                      modelValue: vue.unref(state2).formData.blackKeyList,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(state2).formData.blackKeyList = $event),
                      multiple: "",
                      filterable: "",
                      "allow-create": "",
                      "default-first-option": "",
                      "reserve-keyword": false,
                      teleported: false
                    }, {
                      default: vue.withCtx(() => [
                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(state2).formData.blackKeyList, (item) => {
                          return vue.openBlock(), vue.createBlock(_component_ElOption, {
                            key: item,
                            label: item,
                            value: item
                          }, null, 8, ["label", "value"]);
                        }), 128))
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(vue.unref(ElementPlus2.ElFormItem), { label: "会员文章阅读任务" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(ElementPlus2.ElSwitch), {
                      modelValue: vue.unref(state2).formData.coralReadingRewardsState,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(state2).formData.coralReadingRewardsState = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(vue.unref(ElementPlus2.ElFormItem), { label: "隐藏榜单" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(ElementPlus2.ElSwitch), {
                      modelValue: vue.unref(state2).formData.hideHotListState,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(state2).formData.hideHotListState = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["model"])
          ], 44, _hoisted_3)) : vue.createCommentVNode("", true)
        ], 4);
      };
    }
  });
  const App_vue_vue_type_style_index_0_scoped_2d76db16_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2d76db16"]]);
  const app = vue.createApp(App);
  app.use(ElementPlus2);
  app.mount(
    (() => {
      const app2 = document.createElement("div");
      document.body.append(app2);
      return app2;
    })()
  );
})(Vue, ElementPlus, dayjs);
