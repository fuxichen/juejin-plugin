import { createApp } from 'vue';
import './style.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue';

const app = createApp(App);
app.use(ElementPlus)
app.mount(
  (() => {
    const app = document.createElement('div');
    document.body.append(app);
    return app;
  })(),
);
