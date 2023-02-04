import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'normalize.css'
import App from './App.vue'
import './util/loadConfig'
import './util/cropCardBaidu'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
