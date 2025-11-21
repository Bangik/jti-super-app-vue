<script setup lang="ts">
import { headersIndex } from '@/constants/tables/user'
import { useGetUsers } from '@/hooks/usert'
import type { PageQueryType, SortItem } from '@/types'
import type { UserDetail } from '@/types/user'
import ModalAddEditRole from '@/organism/user/ModalEditRole.vue'

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

const selected = reactive({
  type: '' as 'edit' | 'delete' | 'add',
  open: false,
  dialog: false,
  selectedUserDetail: {} as UserDetail,
})

const { data, isLoading, isFetching, error } = useGetUsers(pageQuery)

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

  if (sort[0].key === 'no' || sort[0].key === 'action' || sort[0].key === 'roles') {
    return
  }

  pageQuery.value.sort = sort[0].key
  pageQuery.value.order = sort[0].order
}

const handleOpenModalAddEdit = (type: 'add' | 'edit', data?: UserDetail) => {
  selected.type = type
  selected.selectedUserDetail = data ? { ...data } : ({} as UserDetail)
  selected.dialog = true
}
</script>

<template>
  <VCard>
    <div class="d-flex justify-between align-center items-center">
      <VCardText>
        <h3 class="mb-0">Daftar User</h3>
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
      <template #item.status="{ item }">
        <VChip
          :color="item.status === 'ACTIVE' ? 'success' : 'error'"
          class="text-capitalize"
          size="small"
        >
          {{ item.status === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif' }}
        </VChip>
      </template>
      <template #item.roles="{ item }">
        <VRow
          class="flex-wrap gap-1 mt-2 mb-2"
          dense
        >
          <VCol
            v-for="role in item.roles"
            :key="role.id"
            cols="auto"
            class="pa-0"
          >
            <VChip
              color="primary"
              variant="tonal"
              size="small"
            >
              {{ role.name }}
            </VChip>
          </VCol>
        </VRow>
      </template>
      <template #item.action="{ item }">
        <IconBtn
          @click="handleOpenModalAddEdit('edit', item)"
          class="mr-2"
          icon="ri-pencil-line"
          color="primary"
        >
          <VIcon icon="ri-pencil-line" />
          <VTooltip
            activator="parent"
            open-delay="300"
            scroll-strategy="close"
          >
            <span class="text-capitalize">Edit</span>
          </VTooltip>
        </IconBtn>
      </template>
    </VDataTableServer>
  </VCard>

  <ModalAddEditRole
    v-if="!isFetching || !isLoading"
    :type="selected.type"
    :data="selected.selectedUserDetail"
    v-model="selected.dialog"
  />
</template>
