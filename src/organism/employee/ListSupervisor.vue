<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { headersSupervisor } from '@/constants/tables/employee'
import type { PageQueryType, SortItem } from '@/types'
import { useGetSupervisorStudentList } from '@/hooks/employee'
import { SUPERVISOR_POSITION_ID_MAP } from '@/constants/employee'

const route = useRoute()
const last_page = ref(1)
const total = ref(0)
const search = ref('')
const id = computed(() => route.params.supervisorId as string)

const pageQuery = ref<PageQueryType>({
  search: '',
  sort: '',
  per_page: 10,
  page: 1,
  last_page: 1,
})

const { data, isLoading, isFetching, error } = useGetSupervisorStudentList(pageQuery, id)

watch(
  () => data.value,
  () => {
    if (data.value?.meta?.last_page) {
      last_page.value = data.value?.meta?.last_page
    }

    if (data.value?.meta?.total) {
      total.value = data.value?.meta?.total
    }
  },
  {
    immediate: true,
  },
)

watchDebounced(
  search,
  () => {
    pageQuery.value.search = search.value
    pageQuery.value.page = 1
  },
  { debounce: 1000, maxWait: 5000 },
)

const handleSort = (sort: Array<SortItem>) => {
  if (!sort.length) {
    return
  }

  if (sort[0].key === 'no' || sort[0].key === 'action') {
    return
  }

  pageQuery.value.sort = sort[0].key
  pageQuery.value.order = sort[0].order
}
</script>

<template>
  <VCard>
    <VCardText class="d-flex justify-end">
      <VTextField
        append-inner-icon="mdi-magnify"
        density="compact"
        label="Cari"
        variant="solo"
        hide-details
        single-line
        max-width="300"
        v-model="search"
      />
    </VCardText>

    <VDataTableServer
      :headers="headersSupervisor"
      :items="data?.data"
      :loading="isLoading || isFetching"
      :error="error"
      :items-length="total"
      :last-page="last_page"
      v-model:page="pageQuery.page"
      v-model:sort="pageQuery.sort"
      v-model:per_page="pageQuery.per_page"
      v-model:items-per-page="pageQuery.per_page"
      :hover="true"
      item-value="id"
      class="text-no-wrap"
      @update:sort-by="handleSort"
    >
      <template #item.no="{ index }">{{ index + 1 }}</template>
      <template #item.position="{ item }">{{ SUPERVISOR_POSITION_ID_MAP[item.position] }}</template>
    </VDataTableServer>
  </VCard>
</template>
