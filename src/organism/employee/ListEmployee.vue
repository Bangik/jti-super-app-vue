<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { headers } from '@/constants/tables/employee'
import { useDeleteEmployee, useGetEmployee } from '@/hooks/employee'
import type { PageQueryType, SortItem } from '@/types'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import type { EmployeeList } from '@/types/employee'

const last_page = ref(1)
const total = ref(0)
const search = ref('')
const selected = reactive({
  type: '' as 'edit' | 'delete' | 'add',
  open: false,
  dialog: false,
  selectedEmployee: {} as EmployeeList,
})

const pageQuery = ref<PageQueryType>({
  search: '',
  sort: '',
  per_page: 10,
  page: 1,
  last_page: 1,
})

const { data, isLoading, isFetching, error } = useGetEmployee(pageQuery)
const { mutateAsync, isPending, isSuccess } = useDeleteEmployee()
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

const handleOpenModalDelete = (item: EmployeeList) => {
  selected.selectedEmployee = item
  selected.type = 'delete'
  selected.open = true
}

const handleDelete = async () => {
  if (!selected.selectedEmployee.id) {
    return
  }

  await mutateAsync(selected.selectedEmployee.id)

  if (isSuccess.value) {
    handleCloseModalDelete()
  }
}

const handleCloseModalDelete = () => {
  selected.type = 'delete'
  selected.open = false
}

// const handleOpenModalAddEdit = (type: 'add' | 'edit', data?: EmployeeList) => {
//   selected.type = type
//   selected.selectedEmployee = data ? { ...data } : ({} as EmployeeList)
//   selected.dialog = true
// }
</script>
<template>
  <VCard>
    <div class="d-flex justify-between align-center items-center">
      <VCardText>
        <VBtn
          color="primary"
          @click="$router.push({ name: 'employee.create' })"
          >Tambah Pegawai</VBtn
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
      :headers="headers"
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

      <template #item.name="{ item }">
        <div class="d-flex justify-start align-center">
          <VAvatar
            v-if="item.avatar"
            :image="item.avatar"
            size="32"
            class="mr-2"
          ></VAvatar>
          <VAvatar
            v-else
            color="primary"
            size="32"
            class="mr-2"
          >
            {{ item.name.charAt(0).toUpperCase() }}
          </VAvatar>
          <span class="text-capitalize">{{ item.name }}</span>
        </div>
      </template>

      <template #item.action="{ item }">
        <IconBtn
          @click="$router.push({ name: 'employee.detail', params: { employeeId: item.id } })"
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
  <ModalConfirmation
    v-model="selected.open"
    :title="`Apakah anda ingin menghapus pegawai ${selected.selectedEmployee.name}?`"
    sub-title="Pegawai yang dihapus tidak dapat dikembalikan. dan akan menghapus data yang berhubungan dengan pegawai ini. Lanjutkan?"
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
