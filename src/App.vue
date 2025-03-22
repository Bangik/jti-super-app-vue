<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
</script>
<template>
  <VApp>
    <VueQueryDevtools />
    <RouterView />
  </VApp>
</template>
