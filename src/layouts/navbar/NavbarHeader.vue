<script setup lang="ts">
defineProps<{
  toggleIsOverlayNavActive: (value: boolean) => void
}>()
</script>
<template>
  <RouterLink
    to="/"
    class="app-logo app-title-wrapper"
  >
    <!-- eslint-disable vue/no-v-html -->
    <!-- <div
      class="d-flex"
      v-html="logo"
    /> -->
    <!-- eslint-enable -->

    <h1 class="font-weight-medium leading-normal text-xl text-uppercase">JTI SUPER APP</h1>
  </RouterLink>

  <IconBtn
    class="d-block d-lg-none"
    @click="toggleIsOverlayNavActive(false)"
  >
    <VIcon icon="ri-close-line" />
  </IconBtn>
</template>
