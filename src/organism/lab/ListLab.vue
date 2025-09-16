<script setup lang="ts">
import { headersIndex } from '@/constants/tables/lab'
import { useGetLab } from '@/hooks/lab'
import type { PageQueryType, SortItem } from '@/types'

const last_page = ref(1)
const total = ref(0)
const search = ref('')
const pageQuery = ref<PageQueryType>({
  search: '',
  sort: '',
  per_page: 10,
  page: 1,
  last_page: 1,
})

const { data, isLoading, isFetching, error } = useGetLab(pageQuery)

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
    <div class="d-flex justify-between align-center items-center">
      <VCardText>
        <VBtn
          color="primary"
          @click="$router.push({ name: 'laboratory.create' })"
          >Tambah Laboratorium</VBtn
        >
      </VCardText>
      <VTextField
        v-model="search"
        append-inner-icon="mdi-magnify"
        density="compact"
        label="Cari"
        variant="solo"
        hide-details
        single-line
        max-width="300"
        class="mr-4"
      />
    </div>
    <VDataTableServer
      :headers="headersIndex"
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
    </VDataTableServer>
  </VCard>
</template>
