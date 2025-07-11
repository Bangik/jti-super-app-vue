import { createApp } from 'vue'
import App from './App.vue'
import { registerPlugins } from './@core/plugin'

import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'

// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

app.mount('#app')
