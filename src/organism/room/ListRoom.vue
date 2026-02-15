<script setup lang="ts">
import { useGetRooms, useDeleteRoom } from '@/hooks/room'
import { roomHeaders } from '@/constants/tables/room'
import ModalAddEdit from '@/organism/room/ModalAddEdit.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue' // Sesuaikan path jika berbeda
import type { PageQueryType, SortItem } from '@/types'
import type { Room } from '@/types/room'

const last_page = ref(1)
const total = ref(0)
const search = ref('')
const selected = reactive({
  type: '' as 'edit' | 'delete' | 'add',
  open: false,
  dialog: false,
  selectedRoom: {} as Room,
})

const pageQuery = ref<PageQueryType>({
  search: '',
  sort: '',
  per_page: 10,
  page: 1,
  last_page: 1,
  filter: '',
})

// Hooks
const { data, isLoading, isFetching, error } = useGetRooms(pageQuery)
const { mutateAsync, isPending, isSuccess } = useDeleteRoom()

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

const handleOpenModalDelete = (item: Room) => {
  selected.selectedRoom = item
  selected.type = 'delete'
  selected.open = true
}

const handleDelete = async () => {
  if (!selected.selectedRoom.id) {
    return
  }

  await mutateAsync(selected.selectedRoom.id)

  if (isSuccess.value) {
    handleCloseModalDelete()
  }
}

const handleCloseModalDelete = () => {
  selected.type = 'delete'
  selected.open = false
}

const handleOpenModalAddEdit = (type: 'add' | 'edit', data?: Room) => {
  selected.type = type
  selected.selectedRoom = data ? { ...data } : ({} as Room)
  selected.dialog = true
}
</script>

<template>
  <VCard>
    <div class="d-flex justify-between align-center items-center">
      <VCardText>
        <VBtn
          color="primary"
          @click="handleOpenModalAddEdit('add')"
        >
          Tambah
        </VBtn>
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
      v-model:page="pageQuery.page"
      v-model:sort="pageQuery.sort"
      v-model:per_page="pageQuery.per_page"
      v-model:items-per-page="pageQuery.per_page"
      :headers="roomHeaders"
      :items="data?.data"
      :items-length="total"
      :loading="isLoading || isFetching"
      :hover="true"
      item-value="id"
      class="text-no-wrap"
      :error="error"
      @update:sort="handleSort"
    >
      <template #item.is_active="{ item }">
        <VChip
          size="small"
          :color="item.is_active ? 'success' : 'error'"
        >
          {{ item.is_active ? 'Aktif' : 'Non-Aktif' }}
        </VChip>
      </template>

      <template #item.action="{ item }">
        <IconBtn
          color="primary"
          @click="handleOpenModalAddEdit('edit', item)"
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
          color="error"
          @click="handleOpenModalDelete(item)"
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

    <ModalAddEdit
      v-if="!isFetching || !isLoading"
      :typeMode="selected.type"
      :data="selected.selectedRoom"
      v-model="selected.dialog"
    />

    <ModalConfirmation
      v-model="selected.open"
      :title="`Apakah anda ingin menghapus ruangan ${selected.selectedRoom.name}?`"
      sub-title="Ruangan yang dihapus tidak dapat dikembalikan. dan akan menghapus data yang berhubungan dengan ruangan ini. Lanjutkan?"
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
  </VCard>
</template>
