import { convexVue } from 'convex-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
const convexUrl = import.meta.env.VITE_CONVEX_URL
if (!convexUrl) {
  console.warn('VITE_CONVEX_URL não está configurado. A mesa online ficará indisponível.')
}

app.use(pinia as any)
app.use(router)
if (convexUrl) {
  app.use(convexVue, { url: convexUrl })
}
app.mount('#app')
