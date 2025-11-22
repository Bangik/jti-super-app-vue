<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { headersSupervisor } from '@/constants/tables/employee'
import type { PageQueryType, SortItem } from '@/types'
import { useDeleteSupervisorStudent, useGetSupervisorStudentList } from '@/hooks/employee'
import { SUPERVISOR_POSITION_ID_MAP } from '@/constants/employee'
import type { SupervisorStudentList } from '@/types/employee'
import ModalAddEditSupervisor from '@/organism/employee/ModalAddEditSupervisor.vue'

const route = useRoute()
const last_page = ref(1)
const total = ref(0)
const search = ref('')
const id = computed(() => route.params.userId as string)
const selected = reactive({
  type: '' as 'edit' | 'delete' | 'add',
  open: false,
  dialog: false,
  selectedSupervisor: {} as SupervisorStudentList,
})

const pageQuery = ref<PageQueryType>({
  search: '',
  sort: '',
  per_page: 10,
  page: 1,
  last_page: 1,
})

const { data, isLoading, isFetching, error } = useGetSupervisorStudentList(pageQuery, id)
const { mutateAsync, isPending, isSuccess } = useDeleteSupervisorStudent()

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

const handleOpenModalDelete = (item: SupervisorStudentList) => {
  selected.type = 'delete'
  selected.open = true
  selected.selectedSupervisor = item
}

const handleDelete = async () => {
  if (!selected.selectedSupervisor.id) {
    return
  }

  await mutateAsync(selected.selectedSupervisor.id)

  if (isSuccess.value) {
    selected.open = false
  }
}

const handleCloseModalDelete = () => {
  selected.type = 'delete'
  selected.open = false
}
</script>

<template>
  <VCard>
    <div class="d-flex justify-between align-center items-center">
      <VCardText>
        <VBtn
          color="primary"
          @click="selected.dialog = true"
          >Tambah Mahasiswa</VBtn
        >
      </VCardText>
      <VTextField
        v-model="search"
        append-inner-icon="mdi-magnify"
        density="compact"
        label="Cari Mahasiswa"
        variant="solo"
        hide-details
        single-line
        max-width="300"
        class="mr-4"
      />
    </div>

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
      <template #item.action="{ item }">
        <IconBtn
          class="mr-2"
          @click="handleOpenModalDelete(item)"
          color="error"
        >
          <VIcon icon="ri-delete-bin-line" />
          <VTooltip
            activator="parent"
            open-delay="300"
            scroll-strategy="close"
          >
            <span class="text-capitalize">Hapus</span>
          </VTooltip>
        </IconBtn>
      </template>
    </VDataTableServer>
  </VCard>

  <ModalAddEditSupervisor v-model="selected.dialog" />

  <ModalConfirmation
    v-model="selected.open"
    :title="`Hapus Supervisor ${selected.selectedSupervisor.name}?`"
    sub-title="Tindakan ini tidak dapat dibatalkan."
  >
    <div class="flex w-full items-center justify-between gap-3">
      <VBtn
        color="primary"
        @click="handleDelete"
        :loading="isPending"
        >Ya</VBtn
      >
      <VBtn
        color="error"
        variant="tonal"
        @click="handleCloseModalDelete"
        :loading="isPending"
        >Tidak</VBtn
      >
    </div>
  </ModalConfirmation>
</template>
