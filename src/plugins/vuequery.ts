import type { App } from 'vue'

import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'

export default function (app: App) {
  const vueQueryPluginOptions: VueQueryPluginOptions = {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60,
          retry: false,
          // refetchOnReconnect: "always",
          refetchOnWindowFocus: 'always',
          // refetchOnMount: false,
          // retry() {
          //   return false;
          // },
        },
      },
    },
    enableDevtoolsV6Plugin: import.meta.env.VITE_APP_MODE !== 'production',
  }

  app.use(VueQueryPlugin, vueQueryPluginOptions)
}
