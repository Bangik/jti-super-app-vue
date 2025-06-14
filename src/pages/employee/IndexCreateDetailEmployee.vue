<script setup lang="ts">
import { useGetEmployeeById } from '@/hooks/employee'
import DetailEmployee from '@/organism/employee/DetailEmployee.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const employeeId = computed(() => route.params.employeeId as string)

const { data, isLoading, isFetching } =
  route.name === 'employee.detail'
    ? useGetEmployeeById(employeeId)
    : { data: null, isLoading: false, isFetching: false }
</script>
<template>
  <DetailEmployee
    v-if="route.name === 'employee.detail'"
    type="edit"
    :data="data?.data"
    :isLoading="isLoading"
    :isFetching="isFetching"
  />
  <DetailEmployee v-else-if="route.name === 'employee.create'" />
</template>
