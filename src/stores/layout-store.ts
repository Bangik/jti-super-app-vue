export const useLayoutStore = defineStore('layout-store', {
  state: () => ({
    title: 'Dashboard',
    theme: 'light',
  }),
  getters: {
    getTitle(state) {
      return state?.title
    },
    getTheme(state) {
      return state?.theme
    },
  },
  actions: {
    setTitle(title: string) {
      this.title = title
    },
    setTheme(theme: string) {
      console.log(theme)
      this.theme = theme
    },
  },
  persist: true,
})
