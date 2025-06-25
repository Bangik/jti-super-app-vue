<script setup lang="ts">
import ListStudent from '@/organism/student/ListStudent.vue'
import ListStudentIndex from '@/organism/student/ListStudentIndex.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <p class="text-lg mb-6">List Mahasiswa</p>
  <ListStudent v-if="route.name === 'major.detail.study-program.detail.student.index'" />
  <ListStudentIndex v-if="route.name === 'student.index'" />
</template>
