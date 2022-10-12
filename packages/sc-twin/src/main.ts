import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import setupInit from './init/'
const app = createApp(App)

app.mount('#app')
setupInit({ app })
