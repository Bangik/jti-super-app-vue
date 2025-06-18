<script setup lang="ts">
import DualListBox from '@/components/select/DualListBox.vue'
import { useGetMajorAsOptions } from '@/hooks/major'
import { useGetSemesterAsOptions, useSettingSubjectSemester } from '@/hooks/semester'
import { useGetSessionAsOptions } from '@/hooks/session'
import { useGetStudyProgramAsOptions } from '@/hooks/study-program'
import { useGetSubjectAsOptions } from '@/hooks/subject'

const sessionId = ref<string | undefined>(undefined)
const majorId = ref<string | undefined>(undefined)
const studyProgramId = ref<string | undefined>(undefined)
const semesterId = ref<string | undefined>(undefined)
const selectedSubjectVal = ref<{ label: string; value: string }[]>([])

const shouldFetchStudyProgram = computed(() => !!majorId.value)
const shouldFetchSemester = computed(() => !!sessionId.value)
const shouldFetchSubject = computed(() => !!studyProgramId.value)
const shouldFetchSelectedSubject = computed(() => !!semesterId.value)

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
  data: subjects,
  isLoading,
  isFetching,
} = useGetSubjectAsOptions(
  computed(() => studyProgramId.value ?? ''),
  undefined,
  shouldFetchSubject,
)
const {
  data: selectedSubjects,
  isLoading: isLoadingSelectedSubject,
  isFetching: isFetchingSelectedSubject,
} = useGetSubjectAsOptions(
  computed(() => studyProgramId.value ?? ''),
  computed(() => semesterId.value ?? ''),
  shouldFetchSelectedSubject,
)

const { mutate: settingSubject, isPending: isSettingSubjectPending } = useSettingSubjectSemester(
  computed(() => semesterId.value ?? ''),
  computed(() => studyProgramId.value ?? ''),
)

const saveSelectedSubjects = async () => {
  const subjectIds = selectedSubjectVal.value.map(item => item.value)
  settingSubject(subjectIds)
}

watch(
  selectedSubjects,
  newValue => {
    if (newValue?.data) {
      selectedSubjectVal.value = newValue.data.map(item => ({
        label: item.label,
        value: item.value,
      }))
    }
  },
  { immediate: true },
)

watch(
  () => majorId.value,
  () => {
    studyProgramId.value = undefined
    subjects.value = undefined
    selectedSubjectVal.value = []
  },
  { immediate: true },
)

watch(
  () => sessionId.value,
  () => {
    semesterId.value = undefined
    selectedSubjectVal.value = []
  },
  { immediate: true },
)

watch(
  () => semesterId.value,
  () => {
    selectedSubjectVal.value = []
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
      <DualListBox
        :items="subjects?.data ?? []"
        v-model:modelValue="selectedSubjectVal"
        :loading="isLoading || isFetching || isLoadingSelectedSubject || isFetchingSelectedSubject"
        label="Pilih Mata Kuliah"
        selected-label="Mata Kuliah Terpilih"
        :disable-add-to="!studyProgramId || !semesterId"
        :disable-remove-from="!studyProgramId || !semesterId"
      />
    </VCardItem>
    <VCardItem class="d-flex justify-start">
      <VBtn
        color="primary"
        @click="saveSelectedSubjects"
        :loading="isSettingSubjectPending"
        :disabled="isSettingSubjectPending"
      >
        Simpan
      </VBtn>
      <VBtn
        class="ml-2"
        variant="tonal"
        @click="() => (selectedSubjectVal = [])"
        :loading="isSettingSubjectPending"
      >
        Reset
      </VBtn>
    </VCardItem>
  </VCard>
</template>
