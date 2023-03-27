import { globalFetch } from "../hooks/useFetch";

interface PinsType {
  msg_Info: {
    content: string
  }
}
export function usePinsBlackPlugin() {
  let id: number | null = null
  return {
    start(blackKeyList: string[] = []) {
      if (id !== null) {
        this.stop()
      }
      id = globalFetch.interceptor.response.use((res) => {
        if ((res.config.input as string).startsWith('https://api.juejin.cn/recommend_api/v1/short_msg/recommend')) {
          res.data.data = res.data.data.filter((v: PinsType) => {
            return !blackKeyList.some(key => v.msg_Info.content.includes(key))
          });
          return res;
        }
      })
    },
    stop() {
      if (id !== null) {
        globalFetch.interceptor.response.eject(id)
      }
    },
  }
}