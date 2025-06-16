<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { headers } from '@/constants/tables/subject'
import { useDeleteSubject, useGetSubject } from '@/hooks/subject'
import type { PageQueryType, SortItem } from '@/types'
import ModalAddEdit from '@/organism/subject/ModalAddEdit.vue'
import ModalConfirmation from '@/components/modal/ModalConfirmation.vue'
import type { SubjectList } from '@/types/subject'
import { useGetStudyProgramAsOptions } from '@/hooks/study-program'

const last_page = ref(1)
const total = ref(0)
const search = ref('')
const selected = reactive({
  type: '' as 'edit' | 'delete' | 'add',
  open: false,
  dialog: false,
  selectedSubject: {} as SubjectList,
})

const pageQuery = ref<PageQueryType>({
  search: '',
  sort: '',
  per_page: 10,
  page: 1,
  last_page: 1,
})

const filter = ref({
  study_program_id: undefined as string | undefined,
})

const {
  data: studyProgramOptions,
  isLoading: isLoadingStudyProgram,
  isFetching: isFetchingStudyProgram,
} = useGetStudyProgramAsOptions()
const { data, isLoading, isFetching, error } = useGetSubject(pageQuery)
const { mutateAsync, isPending, isSuccess } = useDeleteSubject()
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
      pageQuery.value.filter = undefined
    }
    pageQuery.value.page = 1
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

const handleOpenModalDelete = (item: SubjectList) => {
  selected.selectedSubject = item
  selected.type = 'delete'
  selected.open = true
}

const handleDelete = async () => {
  if (!selected.selectedSubject.id) {
    return
  }

  await mutateAsync(selected.selectedSubject.id)

  if (isSuccess.value) {
    handleCloseModalDelete()
  }
}

const handleCloseModalDelete = () => {
  selected.type = 'delete'
  selected.open = false
}

const handleOpenModalAddEdit = (type: 'add' | 'edit', data?: SubjectList) => {
  selected.type = type
  selected.selectedSubject = data ? { ...data } : ({} as SubjectList)
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
          >Tambah Mata Kuliah</VBtn
        >
      </VCardText>
      <VAutocomplete
        label="Program Studi"
        v-model="filter.study_program_id"
        :items="studyProgramOptions?.data"
        item-title="label"
        item-value="value"
        clearable
        max-width="300"
        single-line
        class="mr-4"
        density="compact"
        :loading="isLoadingStudyProgram || isFetchingStudyProgram"
      />
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

      <template #item.status="{ item }">
        <VChip
          :color="item.status === 'ACTIVE' ? 'success' : 'error'"
          class="text-capitalize"
          size="small"
        >
          {{ item.status === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif' }}
        </VChip>
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
    :data="selected.selectedSubject"
    v-model="selected.dialog"
  />
  <ModalConfirmation
    v-model="selected.open"
    :title="`Apakah anda ingin menghapus jurusan ${selected.selectedSubject.name}?`"
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
