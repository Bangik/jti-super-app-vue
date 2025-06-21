<script setup lang="ts">
import { useGetEmployeeAsOptions } from '@/hooks/employee'
import { useGetMajorAsOptions } from '@/hooks/major'
import { useGetSemesterAsOptions } from '@/hooks/semester'
import { useGetSessionAsOptions } from '@/hooks/session'
import { useGetStudyProgramAsOptions } from '@/hooks/study-program'
import { useGetLectureOnSubject, useStoreLectureOnSubject } from '@/hooks/subject'
import type { Position } from '@/types/employee'
import type { SelectedLectureData } from '@/types/subject'

const sessionId = ref<string | undefined>(undefined)
const majorId = ref<string | undefined>(undefined)
const studyProgramId = ref<string | undefined>(undefined)
const semesterId = ref<string | undefined>(undefined)
const selectedLecturers = reactive<Record<string, string[]>>({})

const shouldFetchStudyProgram = computed(() => !!majorId.value)
const shouldFetchSemester = computed(() => !!sessionId.value)
const shouldFetchSubjectLectures = computed(() => !!studyProgramId.value && !!semesterId.value)
const shouldFetchLecturer = computed(() => !!studyProgramId.value && !!semesterId.value)

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
const {
  data: subjectLectures,
  isLoading: isLoadingSubjectLectures,
  isFetching: isFetchingSubjectLectures,
} = useGetLectureOnSubject(
  computed(() => studyProgramId.value ?? ''),
  computed(() => semesterId.value ?? ''),
  shouldFetchSubjectLectures,
)
const {
  data: employeeOptions,
  isLoading: isLoadingEmployee,
  isFetching: isFetchingEmployee,
} = useGetEmployeeAsOptions(
  computed(() => majorId.value ?? ''),
  computed(() => 'DOSEN' as Position),
  shouldFetchLecturer,
)

const { mutate: storeLectureOnSubject, isPending: isStoringLecture } = useStoreLectureOnSubject()

const saveLecturers = () => {
  const data: SelectedLectureData = {
    data: [],
  }

  Object.entries(selectedLecturers).forEach(([subjectId, lecturerIds]) => {
    data.data.push({
      subject_semester_id: subjectId,
      lecture_ids: lecturerIds,
    })
  })

  storeLectureOnSubject(data)
}

watch(
  subjectLectures,
  newLectures => {
    if (!newLectures?.data) return

    newLectures.data.forEach(subjectLecture => {
      selectedLecturers[subjectLecture.id] = subjectLecture.lectures.map(lecture => lecture.id)
    })

    console.log('Selected Lecturers:', selectedLecturers)
  },
  { immediate: true },
)
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
            v-model="semesterId"
            :items="semesterOptions?.data"
            :item-title="item => `${item.semester} tahun ${item.year}`"
            item-value="id"
            clearable
            :loading="isLoadingSemester || isFetchingSemester"
            :disabled="!sessionId"
          />
        </VCol>
      </VRow>
    </VCardText>

    <VCardItem>
      <VCardTitle>Daftar Mata Kuliah dan Dosen Pengampu</VCardTitle>
    </VCardItem>
    <VCardItem v-if="!shouldFetchSubjectLectures">
      <VAlert
        type="info"
        variant="tonal"
      >
        Silakan pilih program studi dan semester terlebih dahulu untuk melihat daftar kuliah.
      </VAlert>
    </VCardItem>
    <VCardItem v-else-if="isLoadingSubjectLectures || isFetchingSubjectLectures">
      <VSkeletonLoader
        class="mt-2"
        type="list-item"
        :loading="true"
        :height="48"
        :width="'100%'"
        :count="4"
      />
    </VCardItem>
    <VCardItem v-else-if="!subjectLectures?.data?.length">
      <VAlert
        class="mt-2"
        type="info"
        variant="tonal"
      >
        Tidak ada kuliah yang ditemukan untuk program studi dan semester yang dipilih.
      </VAlert>
    </VCardItem>
    <VCardItem v-else>
      <VRow
        dense
        v-for="subjectLecture in subjectLectures?.data"
        :key="subjectLecture.id"
        class="mb-3 mt-1"
      >
        <VCol cols="3">
          <VCardTitle>
            {{ subjectLecture.subject.name }}
          </VCardTitle>
        </VCol>
        <VCol cols="9">
          <VAutocomplete
            chips
            clearlable
            label="Dosen Pengampu"
            :placeholder="`Pilih Dosen untuk ${subjectLecture.subject.name}`"
            v-model="selectedLecturers[subjectLecture.id]"
            :items="employeeOptions?.data"
            item-title="label"
            item-value="value"
            clearable
            multiple
            :loading="isLoadingEmployee || isFetchingEmployee"
          />
        </VCol>
      </VRow>
    </VCardItem>
    <VCardItem class="d-flex justify-start">
      <VBtn
        color="primary"
        @click="saveLecturers"
        :loading="isStoringLecture"
        :disabled="isStoringLecture"
      >
        Simpan
      </VBtn>
    </VCardItem>
  </VCard>
</template>
