<script lang="ts" setup>
import VerticalNavLayout from './navbar/fragments/VerticalNavLayout.vue'
import NavbarLayout from './navbar/NavbarLayout.vue'
import NavbarHeader from './navbar/NavbarHeader.vue'
import NavItems from './sidebar/NavItems.vue'
import FooterLayout from './footer/FooterLayout.vue'
</script>

<template>
  <VerticalNavLayout>
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <NavbarLayout :toggleVerticalOverlayNavActive="toggleVerticalOverlayNavActive" />
    </template>
    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <NavbarHeader :toggleIsOverlayNavActive="toggleIsOverlayNavActive" />
    </template>
    <template #vertical-nav-content>
      <NavItems />
    </template>
    <!-- 👉 Pages -->
    <slot />
    <!-- 👉 Footer -->
    <template #footer>
      <FooterLayout />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;

  .app-logo-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
    text-transform: uppercase;
  }
}
</style>
