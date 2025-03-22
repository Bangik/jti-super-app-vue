<script setup lang="ts">
import type { ThemeSwitcherTheme } from '@/types/navbar.ts'
import ThemeSwitcher from '@/@core/components/ThemeSwitcher.vue'

const themes: ThemeSwitcherTheme[] = [
  {
    name: 'light',
    icon: 'ri-sun-line',
  },
  {
    name: 'dark',
    icon: 'ri-moon-clear-line',
  },
]
</script>

<template>
  <ThemeSwitcher :themes="themes" />
</template>
