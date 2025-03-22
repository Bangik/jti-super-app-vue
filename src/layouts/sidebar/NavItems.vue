<script lang="ts" setup>
// import VerticalNavSectionTitle from './fragments/VerticalNavSectionTitle.vue'
import { useAuthStore } from '@/stores/auth-store'
import VerticalNavGroup from './fragments//VerticalNavGroup.vue'
import VerticalNavLink from './fragments/VerticalNavLink.vue'
import { sidebarMaster } from '@/constants/index.ts'

const authStore = useAuthStore()
</script>

<template>
  <!-- 👉 Dashboards -->
  <VerticalNavGroup
    :item="{
      title: 'Dashboards',
      badgeContent: '5',
      badgeClass: 'bg-error',
      icon: 'ri-home-smile-line',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Analytics',
        to: '/dashboard',
      }"
    />
  </VerticalNavGroup>
  <!-- Master Data -->
  <VerticalNavGroup
    :item="{
      title: 'Master Data',
      icon: 'ri-database-2-line',
    }"
  >
    <VerticalNavLink
      v-for="item in sidebarMaster"
      :key="item.id"
      :item="{
        title: item.title,
        to: item.to,
      }"
      :hidden="!item.roles?.some(role => authStore.user.roles.includes(role))"
    />
  </VerticalNavGroup>
</template>
