import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@fontsource/source-code-pro'
import 'meslo/meslo.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
