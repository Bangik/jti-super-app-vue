<script setup lang="ts">
import DefaultLayout from './DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<style lang="scss">
@use '@layouts/styles/default-layout';
</style>
