<script lang="ts" setup>
// import VerticalNavSectionTitle from './fragments/VerticalNavSectionTitle.vue'
import { useAuthStore } from '@/stores/auth-store'
import VerticalNavGroup from './fragments//VerticalNavGroup.vue'
import VerticalNavLink from './fragments/VerticalNavLink.vue'
import { sidebarMaster, sidebarAcademic, sidebarAPI, sidebarAccount } from '@/constants/index.ts'
import type { ATagTargetAttrValues } from '@/types/navbar'

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

  <!-- Account Data -->
  <VerticalNavGroup
    :item="{
      title: 'Data Akun',
      icon: 'ri-user-3-line',
    }"
  >
    <VerticalNavLink
      v-for="item in sidebarAccount"
      :key="item.id"
      :item="{
        title: item.title,
        to: item.to,
      }"
      :hidden="!item.roles?.some(role => authStore.user.roles.includes(role))"
    />
  </VerticalNavGroup>

  <!-- Master Data -->
  <VerticalNavGroup
    :item="{
      title: 'Data Master',
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

  <!-- Akademik Data -->
  <VerticalNavGroup
    :item="{
      title: 'Data Akademik',
      icon: 'ri-book-line',
    }"
  >
    <VerticalNavLink
      v-for="item in sidebarAcademic"
      :key="item.id"
      :item="{
        title: item.title,
        to: item.to,
      }"
      :hidden="!item.roles?.some(role => authStore.user.roles.includes(role))"
    />
  </VerticalNavGroup>

  <!-- Data API -->
  <VerticalNavGroup
    :item="{
      title: 'Data API',
      icon: 'ri-database-line',
    }"
  >
    <VerticalNavLink
      v-for="item in sidebarAPI"
      :key="item.id"
      :item="{
        title: item.title,
        to: item.to,
        href: item.href,
        target: item.target as ATagTargetAttrValues,
      }"
      :hidden="!item.roles?.some(role => authStore.user.roles.includes(role))"
    />
  </VerticalNavGroup>
</template>
