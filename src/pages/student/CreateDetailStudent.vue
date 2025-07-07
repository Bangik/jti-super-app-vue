<script setup lang="ts">
import { useGetStudentById } from '@/hooks/student'
import DetailStudent from '@/organism/student/DetailStudent.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const studentId = computed(() => route.params.studentId as string)

const { data, isLoading, isFetching } =
  route.name === 'student.detail' ? useGetStudentById(studentId) : { data: null, isLoading: false, isFetching: false }
</script>
<template>
  <DetailStudent
    v-if="route.name === 'student.detail'"
    type="edit"
    :data="data?.data"
    :isLoading="isLoading"
    :isFetching="isFetching"
  />
  <DetailStudent v-else-if="route.name === 'student.create'" />
</template>
