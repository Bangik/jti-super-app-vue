<script setup lang="ts">
import { CLASS_LIST } from '@/constants/student'
import { headers } from '@/constants/tables/student'
import { useGetMajorAsOptions } from '@/hooks/major'
import { useGetSemesterAsOptions } from '@/hooks/semester'
import { useGetSessionAsOptions } from '@/hooks/session'
import { useGetStudent } from '@/hooks/student'
import { useGetStudyProgramAsOptions } from '@/hooks/study-program'
import type { PageQueryType, SortItem } from '@/types'
import type { FilterStudent, StudentList } from '@/types/student'

const last_page = ref(1)
const total = ref(0)
const search = ref('')
const sessionId = ref<string | undefined>(undefined)
const selected = reactive({
  type: '' as 'edit' | 'delete' | 'add',
  open: false,
  dialog: false,
  selectedStudent: {} as StudentList,
})

const pageQuery = ref<PageQueryType>({
  search: '',
  sort: '',
  per_page: 10,
  page: 1,
  last_page: 1,
})

const filter = ref<FilterStudent>({
  major_id: undefined,
  study_program_id: undefined,
  class: undefined,
  semester_id: undefined,
})

const shouldFetchStudyProgram = computed(() => !!filter.value.major_id)
const shouldFetchSemester = computed(() => !!sessionId.value && !!filter.value.class)

const { data: majorOption, isLoading: isLoadingMajor, isFetching: isFetchingMajor } = useGetMajorAsOptions()
const {
  data: studyProgramOptions,
  isLoading: isLoadingStudyProgram,
  isFetching: isFetchingStudyProgram,
} = useGetStudyProgramAsOptions(
  computed(() => filter.value.major_id || ''),
  shouldFetchStudyProgram,
)
const { data: sessionOptions, isLoading: isLoadingSession, isFetching: isFetchingSession } = useGetSessionAsOptions()
const {
  data: semesterOptions,
  isLoading: isLoadingSemester,
  isFetching: isFetchingSemester,
} = useGetSemesterAsOptions(
  computed(() => sessionId.value || ''),
  shouldFetchSemester,
)
const { data, isLoading, isFetching, error } = useGetStudent(pageQuery)

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

watch(
  () => filter.value.major_id,
  () => {
    filter.value.study_program_id = undefined
  },
)

watch(
  () => filter.value.study_program_id,
  () => {
    filter.value.class = undefined
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

const handleOpenModalDelete = (item: StudentList) => {
  selected.selectedStudent = item
  selected.type = 'delete'
  selected.open = true
}

const handleOpenModalAddEdit = (type: 'add' | 'edit', data?: StudentList) => {
  selected.type = type
  selected.selectedStudent = data ? { ...data } : ({} as StudentList)
  selected.dialog = true
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="text-lg">Filter</VCardTitle>
    </VCardItem>
    <VCardText class="d-flex flex-wrap gap-3">
      <VAutocomplete
        label="Jurusan"
        v-model="filter.major_id"
        :items="majorOption?.data"
        item-title="label"
        item-value="value"
        clearable
        :loading="isLoadingMajor || isFetchingMajor"
      />
      <VAutocomplete
        label="Program Studi"
        v-model="filter.study_program_id"
        :items="studyProgramOptions?.data"
        item-title="label"
        item-value="value"
        clearable
        :loading="isLoadingStudyProgram || isFetchingStudyProgram"
        :disabled="!filter.major_id"
      />
      <VAutocomplete
        label="Kelas / Golongan"
        v-model="filter.class"
        :items="CLASS_LIST"
        item-title="name"
        item-value="id"
        clearable
        :disabled="!filter.study_program_id"
      />
      <VAutocomplete
        label="Tahun Ajaran"
        v-model="sessionId"
        :items="sessionOptions?.data"
        item-title="label"
        item-value="value"
        clearable
        :loading="isLoadingSession || isFetchingSession"
      />
      <VAutocomplete
        label="Semester"
        v-model="filter.semester_id"
        :items="semesterOptions?.data"
        :item-title="item => `${item.semester} tahun ${item.year}`"
        item-value="id"
        clearable
        :loading="isLoadingSemester || isFetchingSemester"
        :disabled="!sessionId"
      />
    </VCardText>
    <div class="d-flex justify-between align-center items-center">
      <VCardText>
        <VBtn
          color="primary"
          @click="$router.push({ name: 'student.create' })"
        >
          Tambah Mahasiswa
        </VBtn>
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
</template>
