import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn, util } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'https://juejin.cn/user/3949101499816712',
        match: ['https://juejin.cn/*'],
      },
      build: {
        externalGlobals: {
          vue: cdn.cdnjs('Vue', 'vue.global.prod.min.js').concat(
            await util.fn2dataUrl(() => {
              // @ts-ignore
              window.Vue = Vue;
            }),
          ),
          dayjs: cdn.cdnjs('dayjs', 'dayjs.min.js'),
          'element-plus': cdn.cdnjs('ElementPlus', 'index.full.min.js'),
        },
        externalResource: {
          'element-plus/dist/index.css': cdn.cdnjs('ElementPlusCss','index.css'),
        },
      },
    }),
  ],
});
