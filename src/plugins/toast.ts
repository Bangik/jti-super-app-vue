import type { App } from 'vue'

import Toast from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default function (app: App) {
  const options: PluginOptions = {
    transition: 'Vue-Toastification__bounce',
    maxToasts: 5,
    newestOnTop: true,
  }

  app.use(Toast, options)
}
