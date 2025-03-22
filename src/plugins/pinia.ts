import { createPinia } from 'pinia'
import type { App } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const store = createPinia()

export default function (app: App) {
  store.use(piniaPluginPersistedstate)
  app.use(store)
}
