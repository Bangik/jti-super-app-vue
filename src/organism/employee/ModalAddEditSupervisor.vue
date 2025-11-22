<script lang="ts" setup>
import { SUPERVISOR_POSITION } from '@/constants/employee'
import { SupervisorStudentSchema } from '@/constants/forms/employee'
import { useAddSupervisorStudent } from '@/hooks/employee'
import { useGetMajorAsOptions } from '@/hooks/major'
import { useGetStudentAsOptions } from '@/hooks/student'
import { useGetStudyProgramAsOptions } from '@/hooks/study-program'
import { useForm } from 'vee-validate'

const route = useRoute()
const dialog = defineModel<boolean>()

const { mutateAsync, isPending, isSuccess } = useAddSupervisorStudent()

const { errors, defineField, handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: SupervisorStudentSchema,
  initialValues: {
    m_major_id: undefined,
    m_study_program_id: undefined,
    m_employee_id: '',
    m_student_id: undefined,
    position: undefined,
  },
})

const [m_major_id] = defineField('m_major_id')
const [m_study_program_id] = defineField('m_study_program_id')
// const [m_employee_id] = defineField('m_employee_id')
const [m_student_id] = defineField('m_student_id')
const [position] = defineField('position')

setFieldValue('m_employee_id', route.params.employeeId as string)

const onSubmit = handleSubmit(async values => {
  if (!values.m_major_id || !values.m_study_program_id || !values.position || !values.m_student_id) {
    return
  }

  await mutateAsync({
    m_employee_id: route.params.employeeId as string,
    m_major_id: values.m_major_id,
    m_student_id: values.m_student_id,
    m_study_program_id: values.m_study_program_id,
    position: values.position,
  })

  if (isSuccess.value) {
    resetForm()
    dialog.value = false
  }
})

const cancel = () => {
  resetForm()
  dialog.value = false
}

const { data: dataListMajor, isLoading: isLoadingListMajor, isFetching: isFetchingListMajor } = useGetMajorAsOptions()
const shouldFetchStudyProgram = computed(() => !!m_major_id.value)
const shouldFetchStudent = computed(() => !!m_study_program_id.value)
const {
  data: studyProgramOptions,
  isLoading: isLoadingStudyProgram,
  isFetching: isFetchingStudyProgram,
} = useGetStudyProgramAsOptions(
  computed(() => m_major_id.value ?? ''),
  shouldFetchStudyProgram,
)
const {
  data: studentOptions,
  isLoading: isLoadingStudent,
  isFetching: isFetchingStudent,
} = useGetStudentAsOptions(
  computed(() => m_major_id.value ?? ''),
  computed(() => m_study_program_id.value ?? ''),
  shouldFetchStudent,
)

watch(
  () => m_major_id.value,
  newValue => {
    if (newValue === undefined || newValue === '' || newValue === null) {
      m_study_program_id.value = undefined
      m_major_id.value = undefined
      m_student_id.value = undefined
    } else {
      m_study_program_id.value = undefined
      m_student_id.value = undefined
    }
  },
)
</script>

<template>
  <VDialog
    max-width="600"
    v-model="dialog"
  >
    <VCard>
      <VCardTitle>
        <p>Tambah Mahasiswa</p>
      </VCardTitle>
      <VCardText>
        <VForm>
          <VRow dense>
            <VCol cols="12">
              <VAutocomplete
                :items="dataListMajor?.data"
                item-title="label"
                item-value="value"
                label="Pilih Jurusan"
                clearable
                required
                v-model="m_major_id"
                :error-messages="errors.m_major_id"
                :loading="isLoadingListMajor || isFetchingListMajor"
              />
            </VCol>
            <VCol cols="12">
              <VAutocomplete
                :items="studyProgramOptions?.data"
                :loading="isLoadingStudyProgram || isFetchingStudyProgram"
                item-title="label"
                item-value="value"
                label="Program Studi"
                clearable
                placeholder="Pilih Program Studi"
                :error-messages="errors.m_study_program_id"
                :disabled="!m_major_id"
                v-model="m_study_program_id"
              />
            </VCol>
            <VCol cols="12">
              <VAutocomplete
                :items="studentOptions?.data"
                :loading="isLoadingStudent || isFetchingStudent"
                item-title="name"
                item-value="id"
                label="Pilih Mahasiswa"
                clearable
                placeholder="Pilih Mahasiswa"
                :error-messages="errors.m_student_id"
                :disabled="!m_study_program_id"
                v-model="m_student_id"
              />
            </VCol>
            <VCol cols="12">
              <VSelect
                :items="SUPERVISOR_POSITION"
                label="Posisi"
                clearable
                required
                v-model="position"
                :error-messages="errors.position"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="error"
          variant="plain"
          type="button"
          @click="cancel"
        >
          Batal
        </VBtn>
        <VBtn
          color="primary"
          variant="tonal"
          :loading="isPending"
          @click="onSubmit"
        >
          Simpan
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
