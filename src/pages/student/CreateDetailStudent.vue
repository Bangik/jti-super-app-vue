<script setup lang="ts">
import { useGetStudentById } from '@/hooks/student'
import CreateStudent from '@/organism/student/CreateStudent.vue'
import DetailStudent from '@/organism/student/DetailStudent.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const studentId = computed(() => route.params.studentId as string)

const { data, isLoading, isFetching } =
  route.name === 'student.detail' ? useGetStudentById(studentId) : { data: null, isLoading: false, isFetching: false }
</script>
<template>
  <!-- <DetailStudent
    v-if="route.name === 'student.detail'"
    type="edit"
    :data="data?.data"
    :isLoading="isLoading"
    :isFetching="isFetching"
  /> -->
  <CreateStudent v-if="route.name === 'student.create'" />
  <DetailStudent
    v-if="route.name === 'student.detail'"
    :data="data?.data"
    :isLoading="isLoading"
    :isFetching="isFetching"
  />
</template>
