import { globalFetch } from "../hooks/useFetch";
import { addHistoryListener } from "../utils/addHistoryListener"

export function useArticleDirectories() {
  let id: number | null = null;
  let removeHistoryListener: Function;
  function matchUrl() {
    return new RegExp('https://juejin\.cn/book/\\d*/section/\\d*.*?').test(location.href)
  }
  function stopHandelr() {
    if (id !== null) {
      globalFetch.interceptor.response.eject(id);
    }
  }
  type TocItem = { id: number, title: string, level: 2 | 3 | 4, tocMd: string }
  
  // 拦截获取章节内容请求
  function watchSectionFetch(callback?: Function) {
    if (id !== null) {
      stopHandelr();
    }
    id = globalFetch.interceptor.response.use((res) => {
      let apiMatch = (res.config.input as string).startsWith("https://api.juejin.cn/booklet_api/v1/section/get")

      if (apiMatch) {
        return handlerSectionResponse(res, callback)
      }
      return res;
    });
  }

  // 处理文章内TOC数据
  function handlerSectionResponse(res:any, callback?: Function) {
    let tocList: TocItem[] = []
        let markdown = res.data.data.section.markdown_show
        let markdownList = markdown.split("\n")
        let id = 0;
        markdownList.map((v: string) => {
          if (v.startsWith("##")) {
            let [flag, title] = v.split(" ");
            let toc = `[${title}](#heading-${++id})`
            switch (flag) {
              case "##":
                tocList.push({
                  id,
                  title,
                  level: 2,
                  tocMd: `+ ${toc}`,
                })
                break;
              case "###":
                tocList.push({
                  id,
                  title,
                  level: 3,
                  tocMd: `  - ${toc}`
                });
                break;
              case "####":
                tocList.push({
                  id,
                  title,
                  level: 4,
                  tocMd: `    + ${toc}`
                });
                break;
            }

          }

        })
        console.log(tocList)
        // res.data.data.section.markdown_show = `> ## 目录\n > ${tocList.map(v => v.tocMd).join("\n> ")}\n\n${markdown}`
        console.log(res.data)
        callback && callback(tocList)
        return res;
  }

  // 处理文章内TOC样式
  function handlerSection(tocList: TocItem[]) {
    if (tocList.length === 0) {
      return
    }
    let activeSection = document.querySelector('.section.route-active');
    if (activeSection) {
      console.dir(activeSection)
      let centerDom = activeSection.querySelector('.center');
      let tocPanelDom = activeSection.querySelector('.toc-panel')
      if (centerDom && !tocPanelDom) {
        let htmlTemp = tocList.map(v => {
          return `<div class="toc-item toc-item__h${v.level}">
          <a href="#heading-${v.id}" title="${v.title}">${v.title}</a>
          </div>`
        }).join('')
        let html = `<div class="toc-panel">
        ${htmlTemp}
        </div>`
        centerDom.insertAdjacentHTML('beforeend', html)
        // 创建一个<style>标签元素
        var style = document.createElement('style');
        // 设置样式内容
        style.innerHTML = `
        .toc-panel{
          border-radius: 10px;
          background: #f2f3f5;
          border: 1px solid #e4e6eb;
          padding: 10px;
          margin-top: 6px;
        }
        .toc-item { 
          color: #252933 !important;
          font-size: 14px;
          line-height: 20px;
          margin-bottom: 5px;
          position: relative;
        }
        .toc-item > a{
          color: #252933;
        }
        .toc-item__h2{
          padding-left: 0;
        }
        .toc-item__h3{
          padding-left: 20px;
        }
        .toc-item__h4{
          padding-left: 40px;
        }
        `;
        // 将<style>标签添加到<head>元素中
        document.head.appendChild(style);

      }
    }

  }

  function watchBookletFetch(){
    if (id !== null) {
      stopHandelr();
    }
    id = globalFetch.interceptor.response.use((res) => {
      let apiMatch = (res.config.input as string).startsWith("https://api.juejin.cn/booklet_api/v1/booklet/get")

      if (apiMatch) {
        console.log(res)
      }
      return res;
    });
  }

  return {
    start(all: boolean = false) {
      if(!all){
        function startHandle(){
          matchUrl() && watchSectionFetch((tocList: TocItem[])=>{
            setTimeout(() => handlerSection(tocList), 300)
          })
        }
        startHandle()
        removeHistoryListener = addHistoryListener(startHandle)
      }else{
        
      }
    },
    stop() {
      stopHandelr();
      if (removeHistoryListener) {
        removeHistoryListener();
      }
    }
  }
}