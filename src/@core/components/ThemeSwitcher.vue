<script setup lang="ts">
import { useTheme } from 'vuetify'
import type { ThemeSwitcherTheme } from '@/types/navbar.ts'
import { useLayoutStore } from '@/stores/layout-store'

const props = defineProps<{
  themes: ThemeSwitcherTheme[]
}>()

const { name: themeName, global: globalTheme } = useTheme()
const {
  state: currentThemeName,
  next: getNextThemeName,
  index: currentThemeIndex,
} = useCycleList(
  props.themes.map(t => t.name),
  { initialValue: themeName },
)

const layoutstore = useLayoutStore()

const changeTheme = () => {
  globalTheme.name.value = getNextThemeName()
  layoutstore.setTheme(currentThemeName.value)
}

onMounted(() => {
  globalTheme.name.value = layoutstore.theme
})

// Update icon if theme is changed from other sources
watch(
  () => globalTheme.name.value,
  val => {
    currentThemeName.value = val
  },
)
</script>

<template>
  <IconBtn @click="changeTheme">
    <VIcon :icon="props.themes[currentThemeIndex].icon" />
    <VTooltip
      activator="parent"
      open-delay="1000"
      scroll-strategy="close"
    >
      <span class="text-capitalize">{{ currentThemeName }}</span>
    </VTooltip>
  </IconBtn>
</template>
