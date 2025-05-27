<script setup lang="ts">
import ListStudyProgram from '@/organism/study-program/ListStudyProgram.vue'
import ListStudyProgramIndex from '@/organism/study-program/ListStudyProgramIndex.vue'
const route = useRoute()
</script>

<template>
  <p class="text-lg mb-6">List Program Studi</p>
  <ListStudyProgram v-if="route.name === 'major.detail.study-program.index'" />
  <ListStudyProgramIndex v-if="route.name === 'study-program.index'" />
</template>
