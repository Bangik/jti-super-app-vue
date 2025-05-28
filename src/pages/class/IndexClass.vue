<script setup lang="ts">
import ListClass from '@/organism/class/ListClass.vue'
import ListClassIndex from '@/organism/class/ListClassIndex.vue'
const route = useRoute()
</script>

<template>
  <p class="text-lg mb-6">List Kelas</p>
  <ListClass v-if="route.name === 'major.detail.study-program.detail.class.index'" />
  <ListClassIndex v-if="route.name === 'class.index'" />
</template>
