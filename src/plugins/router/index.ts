import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import NProgress from 'nprogress'
import handleNavigation from '@/lib/navigation'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _, next) => {
  NProgress.start()
  handleNavigation(to, next)
})

router.afterEach(() => {
  NProgress.done()
})

export default function (app: App) {
  app.use(router)
}

export { router }
