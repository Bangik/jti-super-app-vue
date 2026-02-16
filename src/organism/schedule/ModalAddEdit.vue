<script setup lang="ts">
import { ScheduleSchema, type ScheduleValues } from '@/constants/forms/schedule'
import { useCreateSchedule, useUpdateSchedule } from '@/hooks/schedule'
import { useGetSemesterAsOptions } from '@/hooks/semester'
import { useGetSessionAsOptions } from '@/hooks/session'
import { useGetStudyProgramAsOptions } from '@/hooks/study-program'
import { CLASS_LIST } from '@/constants/student'
import type { ScheduleList } from '@/types/schedule'
import { useForm } from 'vee-validate'
import { useGetRoomsOptions } from '@/hooks/room'
import { useGetSubjectSemesterAsOptions } from '@/hooks/subject'
import { DAYS_OF_WEEK } from '@/constants/day'

interface Props {
  type?: 'add' | 'edit' | 'delete'
  data?: ScheduleList
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
})

const dialog = defineModel<boolean>()
const { type } = toRefs(props)
const id = computed(() => props.data?.id ?? '')
const sessionId = ref<string | undefined>(undefined)

const shouldFetchSemester = computed(() => !!sessionId.value)
const shouldFetchSubjectSemester = computed(() => !!studyProgramId.value && !!semesterId.value)
const isProgrammaticUpdate = ref(false)

const { handleSubmit, defineField, resetForm, setValues, errors } = useForm({
  validationSchema: ScheduleSchema,
  initialValues: {
    semester_id: undefined as string | undefined,
    subject_semester_id: undefined as string | undefined,
    room_id: undefined as string | undefined,
    study_program_id: undefined as string | undefined,
    semester_level: 1,
    class_group: undefined as string | undefined,
    day_of_week: undefined as string | undefined,
    start_time: '',
    end_time: '',
  },
})

const [semesterId] = defineField('semester_id')
const [subjectSemesterId] = defineField('subject_semester_id')
const [roomId] = defineField('room_id')
const [studyProgramId] = defineField('study_program_id')
const [semesterLevel] = defineField('semester_level')
const [classGroup] = defineField('class_group')
const [dayOfWeek] = defineField('day_of_week')
const [startTime] = defineField('start_time')
const [endTime] = defineField('end_time')

const { data: sessionOptions, isLoading: isLoadingSession, isFetching: isFetchingSession } = useGetSessionAsOptions()

const {
  data: semesterOptions,
  isLoading: isLoadingSemester,
  isFetching: isFetchingSemester,
} = useGetSemesterAsOptions(
  computed(() => sessionId.value ?? ''),
  shouldFetchSemester,
)

const {
  data: studyProgramOptions,
  isLoading: isLoadingStudyProgram,
  isFetching: isFetchingStudyProgram,
} = useGetStudyProgramAsOptions()

const { data: roomOptions, isLoading: isLoadingRoom, isFetching: isFetchingRoom } = useGetRoomsOptions()

const {
  data: subjectSemesterOptions,
  isLoading: isLoadingSubjectSemester,
  isFetching: isFetchingSubjectSemester,
} = useGetSubjectSemesterAsOptions(
  computed(() => studyProgramId.value ?? ''),
  ref(''),
  computed(() => semesterId.value ?? ''),
  shouldFetchSubjectSemester,
)

const safeSubjectOptions = computed(() => {
  const list = subjectSemesterOptions.value?.data
  if (!list || list.length === 0) return []
  return list
})

const createMutation = useCreateSchedule()
const updateMutation = useUpdateSchedule(id)

const isAddMode = computed(() => type.value === 'add')

const mutateAsync = computed(() => (isAddMode.value ? createMutation.mutateAsync : updateMutation.mutateAsync))
const isSuccess = computed(() => (isAddMode.value ? createMutation.isSuccess : updateMutation.isSuccess))
const isPending = computed(() => (isAddMode.value ? createMutation.isPending : updateMutation.isPending))

const onSubmit = handleSubmit(async values => {
  if (!mutateAsync.value) return
  const payload = values as ScheduleValues

  await mutateAsync.value(payload)

  if (isSuccess.value) {
    resetForm()
    dialog.value = false
  }
})

const resetFormOnUpdate = async () => {
  if (props.data && props.type === 'edit') {
    isProgrammaticUpdate.value = true

    sessionId.value = props.data.session_id

    setValues({
      semester_id: props.data.semester_id,
      subject_semester_id: props.data.subject_semester_id,
      room_id: props.data.room_id,
      study_program_id: props.data.study_program_id,
      semester_level: props.data.semester_level,
      class_group: props.data.class_group,
      day_of_week: props.data.day_of_week,
      start_time: props.data.start_time,
      end_time: props.data.end_time,
    })

    await nextTick()
    isProgrammaticUpdate.value = false
  } else {
    sessionId.value = undefined

    resetForm({
      values: {
        semester_id: undefined,
        subject_semester_id: undefined,
        room_id: undefined,
        study_program_id: undefined,
        semester_level: 1,
        class_group: undefined,
        day_of_week: undefined,
        start_time: '',
        end_time: '',
      },
    })
  }
}

watch(
  () => props,
  () => {
    resetFormOnUpdate()
  },
  { immediate: true, deep: true },
)

watch(
  () => sessionId.value,
  () => {
    if (isProgrammaticUpdate.value) return
    semesterId.value = undefined
  },
  { immediate: true },
)

watch(
  () => semesterId.value,
  newId => {
    if (isProgrammaticUpdate.value) return

    subjectSemesterId.value = undefined

    if (newId && semesterOptions.value?.data) {
      const selectedSemester = semesterOptions.value.data.find(item => item.id === newId)

      if (selectedSemester) {
        semesterLevel.value = Number(selectedSemester.semester)
      }
    }
  },
  { immediate: true },
)

watch(
  () => studyProgramId.value,
  () => {
    if (isProgrammaticUpdate.value) return

    subjectSemesterId.value = undefined
  },
  { immediate: true },
)

const close = () => {
  resetForm()
  dialog.value = false
}
</script>

<template>
  <VDialog
    v-model="dialog"
    max-width="800"
  >
    <VCard :title="isAddMode ? 'Tambah Jadwal' : 'Edit Jadwal'">
      <VCardText>
        <VForm>
          <VRow dense>
            <VCol
              cols="12"
              md="6"
            >
              <VAutocomplete
                :items="sessionOptions?.data"
                item-title="label"
                item-value="value"
                label="Pilih Tahun Ajaran"
                clearable
                :loading="isLoadingSession || isFetchingSession"
                v-model="sessionId"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VAutocomplete
                :items="semesterOptions?.data"
                item-value="id"
                :item-title="item => (item.semester ? `${item.semester} tahun ${item.year}` : undefined)"
                label="Pilih Semester"
                clearable
                :loading="isLoadingSemester || isFetchingSemester"
                :disabled="!sessionId"
                v-model="semesterId"
                :error-messages="errors.semester_id"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VAutocomplete
                :items="studyProgramOptions?.data"
                item-title="label"
                item-value="value"
                label="Pilih Program Studi"
                clearable
                :loading="isLoadingStudyProgram || isFetchingStudyProgram"
                v-model="studyProgramId"
                :error-messages="errors.study_program_id"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VAutocomplete
                :items="CLASS_LIST"
                item-title="name"
                item-value="id"
                label="Pilih Kelas / Golongan"
                clearable
                :disabled="!studyProgramId"
                v-model="classGroup"
                :error-messages="errors.class_group"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VAutocomplete
                :items="safeSubjectOptions"
                :item-title="item => (item.name ? `${item.code} - ${item.name}` : undefined)"
                item-value="id"
                label="Pilih Mata Kuliah"
                clearable
                :loading="isLoadingSubjectSemester || isFetchingSubjectSemester"
                :disabled="!studyProgramId || !semesterId"
                v-model="subjectSemesterId"
                :error-messages="errors.subject_semester_id"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VAutocomplete
                :items="roomOptions?.data"
                item-title="label"
                item-value="value"
                label="Pilih Ruangan"
                clearable
                :loading="isLoadingRoom || isFetchingRoom"
                v-model="roomId"
                :error-messages="errors.room_id"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                :items="DAYS_OF_WEEK"
                item-title="label"
                item-value="value"
                label="Pilih Hari"
                clearable
                v-model="dayOfWeek"
                :error-messages="errors.day_of_week"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                label="Tingkat Semester"
                type="number"
                v-model="semesterLevel"
                :error-messages="errors.semester_level"
                disabled
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                label="Waktu Mulai"
                type="time"
                v-model="startTime"
                :error-messages="errors.start_time"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                label="Waktu Selesai"
                type="time"
                v-model="endTime"
                :error-messages="errors.end_time"
              />
            </VCol>
          </VRow>

          <VCardActions class="mt-3">
            <VSpacer />
            <VBtn
              color="error"
              variant="plain"
              @click="close"
              >Batal</VBtn
            >
            <VBtn
              type="submit"
              color="primary"
              variant="tonal"
              :loading="isPending.value"
              @click="onSubmit"
              >Simpan</VBtn
            >
          </VCardActions>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
