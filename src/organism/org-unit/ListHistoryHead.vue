<script setup lang="ts">
import { headersHistoryHead } from '@/constants/tables/org-unit'
import { useDeactivateHeadOrgUnit, useGetOrgUnitById } from '@/hooks/org-unit'
import type { PageQueryType, SortItem } from '@/types'
import ModalAddEditHead from '@/organism/org-unit/ModalAddEditHead.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import type { HistoryHead } from '@/types/org-unit'

const route = useRoute()
const last_page = ref(1)
const total = ref(0)
const search = ref('')
const id = ref<string>(route.params.orgUnitId as string)
const dialog = ref(false)
const selectedAssignment = ref<HistoryHead | null>(null)
const openDeactivateDialog = ref(false)

const pageQuery = ref<PageQueryType>({
  search: '',
  sort: '',
  per_page: 10,
  page: 1,
  last_page: 1,
})

const { data, isLoading, isFetching, error } = useGetOrgUnitById(id, pageQuery)
const {
  mutateAsync: deactivateHeadAssignment,
  isPending: isPendingDeactivate,
  isSuccess: isSuccessDeactivate,
} = useDeactivateHeadOrgUnit(id)

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

  const sortOrder = sort[0].order === 'asc' ? '' : '-'
  pageQuery.value.sort = `${sortOrder}${sort[0].key}`
}

const handleOpenDeactivateModal = (item: HistoryHead) => {
  selectedAssignment.value = item
  openDeactivateDialog.value = true
}

const handleCloseDeactivateModal = () => {
  selectedAssignment.value = null
  openDeactivateDialog.value = false
}

const handleDeactivate = async () => {
  if (!selectedAssignment.value?.id) {
    return
  }

  await deactivateHeadAssignment(selectedAssignment.value.id)

  if (isSuccessDeactivate.value) {
    handleCloseDeactivateModal()
  }
}
</script>

<template>
  <VCard>
    <div class="d-flex justify-between align-center items-center">
      <VCardText>
        <VBtn
          color="primary"
          @click="dialog = true"
          >Tambah Pejabat</VBtn
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
      :headers="headersHistoryHead"
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

      <template #item.is_active="{ item }">
        <VChip
          :color="item.is_active ? 'success' : 'error'"
          class="text-capitalize"
          size="small"
        >
          {{ item.is_active ? 'Aktif' : 'Tidak Aktif' }}
        </VChip>
      </template>

      <template #item.action="{ item }">
        <IconBtn
          v-if="item.is_active"
          class="mr-2"
          @click="handleOpenDeactivateModal(item)"
          color="warning"
        >
          <VIcon icon="ri-user-unfollow-line" />
          <VTooltip
            activator="parent"
            open-delay="300"
            scroll-strategy="close"
          >
            <span class="text-capitalize">Nonaktifkan</span>
          </VTooltip>
        </IconBtn>
      </template>
    </VDataTableServer>
  </VCard>

  <ModalAddEditHead v-model="dialog" />

  <ModalConfirmation
    v-model="openDeactivateDialog"
    :title="`Apakah anda ingin menonaktifkan pegawai ini?`"
    sub-title="Penugasan jabatan yang dinonaktifkan tidak akan lagi tercatat sebagai aktif. Lanjutkan?"
  >
    <div class="flex w-full items-center justify-between gap-3">
      <VBtn
        color="primary"
        @click="handleDeactivate"
        :loading="isPendingDeactivate"
        >Ya</VBtn
      >
      <VBtn
        color="error"
        variant="tonal"
        @click="handleCloseDeactivateModal"
        :loading="isPendingDeactivate"
        >Tidak</VBtn
      >
    </div>
  </ModalConfirmation>
</template>
