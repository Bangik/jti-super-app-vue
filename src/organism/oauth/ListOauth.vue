<script setup lang="ts">
import { headersIndex } from '@/constants/tables/oauth'
import { useDeleteOauthClient, useGetOauthClients } from '@/hooks/oauth'
import type { PageQueryType, SortItem } from '@/types'
import type { OauthClient } from '@/types/oauth'
import ModalAddEdit from '@/organism/oauth/ModalAddEdit.vue'

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
  selectedOauthClient: {} as OauthClient,
})

const { data, isLoading, isFetching, error } = useGetOauthClients(pageQuery)
const { mutateAsync, isPending, isSuccess } = useDeleteOauthClient()

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

const handleOpenModalDelete = (item: OauthClient) => {
  selected.selectedOauthClient = item
  selected.type = 'delete'
  selected.open = true
}

const handleDelete = async () => {
  if (!selected.selectedOauthClient.id) {
    return
  }

  await mutateAsync(selected.selectedOauthClient.id)

  if (isSuccess.value) {
    handleCloseModalDelete()
  }
}

const handleCloseModalDelete = () => {
  selected.type = 'delete'
  selected.open = false
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

const handleOpenModalAddEdit = (type: 'add' | 'edit', data?: OauthClient) => {
  selected.type = type
  selected.selectedOauthClient = data ? { ...data } : ({} as OauthClient)
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
          >Tambah Client</VBtn
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
      <template #item.id="{ item }">
        {{ item.id }}
        <VBtn
          icon
          size="small"
          @click="copyToClipboard(item.id)"
        >
          <VIcon icon="ri-file-copy-line" />
          <VTooltip
            activator="parent"
            open-delay="300"
            scroll-strategy="close"
          >
            <span class="text-capitalize">Salin</span>
          </VTooltip>
        </VBtn>
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

  <ModalAddEdit
    v-if="!isFetching || !isLoading"
    :type="selected.type"
    :data="selected.selectedOauthClient"
    v-model="selected.dialog"
  />

  <ModalConfirmation
    v-model="selected.open"
    :title="`Apakah anda ingin menghapus jurusan ${selected.selectedOauthClient.name}?`"
    sub-title="Jurusan yang dihapus tidak dapat dikembalikan. dan akan menghapus data yang berhubungan dengan jurusan ini. Lanjutkan?"
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
