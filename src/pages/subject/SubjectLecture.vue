<script setup lang="ts">
import { headersFiltered } from '@/constants/tables/subject'
import { useGetMajorAsOptions } from '@/hooks/major'
import { useGetSessionAsOptions } from '@/hooks/session'
import { useGetStudyProgramAsOptions } from '@/hooks/study-program'
import { useGetSubjectFiltered } from '@/hooks/subject'
import type { PageQueryType, SortItem } from '@/types'
import type { FilterSubject } from '@/types/subject'

const sessionId = ref<string | undefined>(undefined)
const majorId = ref<string | undefined>(undefined)
const studyProgramId = ref<string | undefined>(undefined)
const semester = ref<string | undefined>(undefined)
const semesterOptions = [
  { label: 'Ganjil', value: 'odd' },
  { label: 'Genap', value: 'even' },
]

const last_page = ref(1)
const total = ref(0)
const search = ref('')

const filter = ref<FilterSubject>({
  study_program_id: majorId.value,
  session_id: sessionId.value,
  semester_type: semester.value,
})

const pageQuery = ref<PageQueryType>({
  search: '',
  sort: '',
  per_page: 10,
  page: 1,
  last_page: 1,
  filter: JSON.stringify(filter.value),
})

const shouldFetchStudyProgram = computed(() => !!majorId.value)

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

const { data, isLoading, isFetching, error } = useGetSubjectFiltered(pageQuery)

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
  [majorId, studyProgramId, sessionId, semester],
  ([newMajor, newStudy, newSession, newSemester]) => {
    const activeFilters: Record<string, string | undefined> = {
      major_id: newMajor,
      study_program_id: newStudy,
      session_id: newSession,
      semester_type: newSemester,
    }

    // Buang key yang valuenya undefined/null/string kosong
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cleanedFilters = Object.fromEntries(Object.entries(activeFilters).filter(([_, v]) => v))

    // Update pageQuery filter stringifier
    if (Object.keys(cleanedFilters).length > 0) {
      pageQuery.value.filter = JSON.stringify(cleanedFilters)
    } else {
      pageQuery.value.filter = undefined
    }

    // Kembalikan ke halaman 1 setiap kali filter berubah
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

watch(majorId, newVal => {
  if (!newVal) studyProgramId.value = undefined
})
watch(sessionId, newVal => {
  if (!newVal) semester.value = undefined
})
</script>
<template>
  <VCard>
    <VCardItem>
      <VCardTitle class="text-lg">Filter</VCardTitle>
    </VCardItem>
    <VCardText>
      <VRow dense>
        <VCol
          cols="12"
          sm="6"
          md="3"
        >
          <VAutocomplete
            v-model="majorId"
            label="Jurusan"
            :items="majorOption?.data"
            item-title="label"
            item-value="value"
            clearable
            :loading="isLoadingMajor || isFetchingMajor"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
          md="3"
        >
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
        </VCol>
        <VCol
          cols="12"
          sm="6"
          md="3"
        >
          <VAutocomplete
            label="Tahun Ajaran"
            v-model="sessionId"
            :items="sessionOptions?.data"
            item-title="label"
            item-value="value"
            clearable
            :loading="isLoadingSession || isFetchingSession"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
          md="3"
        >
          <VAutocomplete
            label="Semester"
            v-model="semester"
            :items="semesterOptions"
            item-title="label"
            item-value="value"
            clearable
            :disabled="!sessionId"
          />
        </VCol>
      </VRow>
    </VCardText>
    <VCardText class="d-flex justify-end">
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
    </VCardText>
    <VDataTableServer
      :headers="headersFiltered"
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
    </VDataTableServer>
  </VCard>
</template>
