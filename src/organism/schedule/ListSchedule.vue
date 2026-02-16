<script setup lang="ts">
import { scheduleHeaders } from '@/constants/tables/schedule'
import { useDeleteSchedule, useGetSchedule } from '@/hooks/schedule'
import type { PageQueryType, SortItem } from '@/types'
import type { FilterSchedule, ScheduleList } from '@/types/schedule'
import ModalAddEdit from '@/organism/schedule/ModalAddEdit.vue'
import { DAYS_OF_WEEK } from '@/constants/day'
import { useGetMajorAsOptions } from '@/hooks/major'
import { useGetStudyProgramAsOptions } from '@/hooks/study-program'
import { useGetSessionAsOptions } from '@/hooks/session'
import { useGetSemesterAsOptions } from '@/hooks/semester'
import { CLASS_LIST } from '@/constants/student'

const last_page = ref(1)
const total = ref(0)
const search = ref('')
const selected = reactive({
  type: '' as 'edit' | 'delete' | 'add',
  open: false,
  dialog: false,
  selectedSchedule: {} as ScheduleList,
})

const pageQuery = ref<PageQueryType>({
  search: '',
  sort: '',
  per_page: 10,
  page: 1,
  last_page: 1,
})

const filter = ref<FilterSchedule>({
  major_id: undefined as string | undefined,
  study_program_id: undefined as string | undefined,
  semester_id: undefined as string | undefined,
  class_group: undefined as string | undefined,
})

const sessionId = ref<string | undefined>(undefined)
const majorId = ref<string | undefined>(undefined)
const studyProgramId = ref<string | undefined>(undefined)
const semesterId = ref<string | undefined>(undefined)
const classGroup = ref<string | undefined>(undefined)

const shouldFetchStudyProgram = computed(() => !!majorId.value)
const shouldFetchSemester = computed(() => !!sessionId.value)

const { data: majorOption, isLoading: isLoadingMajor, isFetching: isFetchingMajor } = useGetMajorAsOptions()
const {
  data: studyProgramOptions,
  isLoading: isLoadingStudyProgram,
  isFetching: isFetchingStudyProgram,
} = useGetStudyProgramAsOptions(
  computed(() => majorId.value ?? ''),
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

watch(
  [majorId, studyProgramId, semesterId, classGroup],
  () => {
    filter.value.major_id = majorId.value
    filter.value.study_program_id = studyProgramId.value
    filter.value.semester_id = semesterId.value
    filter.value.class_group = classGroup.value
  },
  { deep: true },
)

const { data, isLoading, isFetching, error } = useGetSchedule(pageQuery)
const { mutateAsync, isPending, isSuccess } = useDeleteSchedule()

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

const handleOpenModalDelete = (item: ScheduleList) => {
  selected.selectedSchedule = item
  selected.type = 'delete'
  selected.open = true
}

const handleDelete = async () => {
  if (!selected.selectedSchedule.id) {
    return
  }

  await mutateAsync(selected.selectedSchedule.id)

  if (isSuccess.value) {
    handleCloseModalDelete()
  }
}

const handleCloseModalDelete = () => {
  selected.type = 'delete'
  selected.open = false
}

const handleOpenModalAddEdit = (type: 'add' | 'edit', data?: ScheduleList) => {
  selected.type = type
  selected.selectedSchedule = data ? { ...data } : ({} as ScheduleList)
  selected.dialog = true
}
</script>

<template>
  <VCard class="mb-3">
    <VCardItem>
      <VCardTitle class="text-lg">Filter</VCardTitle>
    </VCardItem>
    <VCardText class="d-flex flex-wrap gap-3 items-center flex-column flex-sm-row">
      <VAutocomplete
        v-model="majorId"
        label="Jurusan"
        :items="majorOption?.data"
        item-title="label"
        item-value="value"
        clearable
        :loading="isLoadingMajor || isFetchingMajor"
      />
      <VAutocomplete
        label="Program Studi"
        v-model="studyProgramId"
        :items="studyProgramOptions?.data"
        item-title="label"
        item-value="value"
        clearable
        :loading="isLoadingStudyProgram || isFetchingStudyProgram"
        :disabled="!majorId"
      />
      <VAutocomplete
        label="Kelas / Golongan"
        v-model="classGroup"
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
        v-model="semesterId"
        :items="semesterOptions?.data"
        :item-title="item => `${item.semester} tahun ${item.year}`"
        item-value="id"
        clearable
        :loading="isLoadingSemester || isFetchingSemester"
        :disabled="!sessionId"
      />
    </VCardText>
  </VCard>

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
      :headers="scheduleHeaders"
      :items="data?.data"
      :items-length="total"
      :loading="isLoading || isFetching"
      :hover="true"
      item-value="id"
      class="text-no-wrap"
      :error="error"
      @update:sort="handleSort"
    >
      <template #item.day_of_week="{ item }">
        {{ item.day_of_week ? DAYS_OF_WEEK.find(d => d.value === item.day_of_week)?.label : '-' }}
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
      :type="selected.type"
      :data="selected.selectedSchedule"
      v-model="selected.dialog"
    />

    <ModalConfirmation
      v-model="selected.open"
      :title="`Apakah anda ingin menghapus jadwal ?`"
      sub-title="Jadwal yang dihapus tidak dapat dikembalikan. dan akan menghapus data yang berhubungan dengan jadwal ini. Lanjutkan?"
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
