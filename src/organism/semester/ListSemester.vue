<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { headers } from '@/constants/tables/semester'
import { useDeleteSemester, useGetSemester } from '@/hooks/semester'
import type { PageQueryType, SortItem } from '@/types'
import ModalAddEdit from '@/organism/semester/ModalAddEdit.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import type { FilterSemester, SemesterList } from '@/types/semester'
import { useGetSessionAsOptions } from '@/hooks/session'

const last_page = ref(1)
const total = ref(0)
const search = ref('')
const selected = reactive({
  type: '' as 'edit' | 'delete' | 'add',
  open: false,
  dialog: false,
  selectedSemester: {} as SemesterList,
})
const years = ref<string[]>([])

const pageQuery = ref<PageQueryType>({
  search: '',
  sort: '',
  per_page: 10,
  page: 1,
  last_page: 1,
  filter: '',
})

const filter = ref<FilterSemester>({
  session_id: undefined,
  year: '',
})

const { data: dataListSession, isLoading: isLoadingSession, isFetching: isFetchingSession } = useGetSessionAsOptions()
const { data, isLoading, isFetching, error } = useGetSemester(pageQuery)
const { mutateAsync, isPending, isSuccess } = useDeleteSemester()
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

watch(
  filter,
  newVal => {
    const isNotEmpty = Object.values(newVal).some(v => v) // minimal 1 filter terisi
    if (isNotEmpty) {
      pageQuery.value.filter = JSON.stringify(newVal)
    } else {
      pageQuery.value.filter = ''
    }
    pageQuery.value.page = 1

    years.value = []
    if (newVal.session_id) {
      const session = dataListSession?.value?.data?.find(item => item.value === newVal.session_id)
      if (session) {
        years.value = session.label.split('/')
      }
    }
  },
  { deep: true },
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

const handleOpenModalDelete = (item: SemesterList) => {
  selected.selectedSemester = item
  selected.type = 'delete'
  selected.open = true
}

const handleDelete = async () => {
  if (!selected.selectedSemester.id) {
    return
  }

  await mutateAsync(selected.selectedSemester.id)

  if (isSuccess.value) {
    handleCloseModalDelete()
  }
}

const handleCloseModalDelete = () => {
  selected.type = 'delete'
  selected.open = false
}

const handleOpenModalAddEdit = (type: 'add' | 'edit', data?: SemesterList) => {
  selected.type = type
  selected.selectedSemester = data ? { ...data } : ({} as SemesterList)
  selected.dialog = true
}
</script>
<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="text-lg">Filter</VCardTitle>
    </VCardItem>
    <VCardText class="d-flex flex-wrap gap-4">
      <VAutocomplete
        label="Tahun Ajaran"
        v-model="filter.session_id"
        :items="dataListSession?.data"
        item-title="label"
        item-value="value"
        clearable
        :loading="isLoadingSession || isFetchingSession"
      />
      <VAutocomplete
        label="Tahun"
        v-model="filter.year"
        :items="years"
        :loading="isLoadingSession || isFetchingSession"
        item-title="label"
        item-value="value"
        clearable
        :disabled="!filter.session_id"
      />
    </VCardText>
    <VDivider />
    <div class="d-flex justify-between align-center items-center">
      <VCardText>
        <VBtn
          color="primary"
          @click="handleOpenModalAddEdit('add')"
          >Tambah Semester</VBtn
        >
      </VCardText>
      <VTextField
        v-model="search"
        append-inner-icon="mdi-magnify"
        density="compact"
        label="Cari"
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
    :data="selected.selectedSemester"
    v-model="selected.dialog"
  />
  <ModalConfirmation
    v-model="selected.open"
    :title="`Apakah anda ingin menghapus semester ${selected.selectedSemester.semester}?`"
    sub-title="Tahun Ajaran yang dihapus tidak dapat dikembalikan. dan akan menghapus data yang berhubungan dengan semester ini. Lanjutkan?"
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
