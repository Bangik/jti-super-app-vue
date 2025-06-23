<script lang="ts" setup>
import { SemesterSchema } from '@/constants/forms/semester'
import { useAddSemester, useUpdateSemester } from '@/hooks/semester'
import { useGetSessionAsOptions } from '@/hooks/session'
import type { SemesterList } from '@/types/semester'
import { useForm } from 'vee-validate'

interface Props {
  type?: 'add' | 'edit' | 'delete'
  data?: SemesterList
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
})
const dialog = defineModel<boolean>()
const { type } = toRefs(props)
const id = computed(() => props.data?.id ?? '')

const { data: dataListSession, isLoading, isFetching } = useGetSessionAsOptions()

const createMutation = useAddSemester()
const updateMutation = useUpdateSemester(id)
const isAddMode = computed(() => type.value === 'add')

const mutateAsync = computed(() => (isAddMode.value ? createMutation.mutateAsync : updateMutation.mutateAsync))
const isSuccess = computed(() => (isAddMode.value ? createMutation.isSuccess : updateMutation.isSuccess))
const isPending = computed(() => (isAddMode.value ? createMutation.isPending : updateMutation.isPending))

const { errors, defineField, handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: SemesterSchema,
  initialValues: {
    session_id: '',
    year: '',
    semester: '',
  },
})

const [session_id] = defineField('session_id')
const [year] = defineField('year')
const [semester] = defineField('semester')

setFieldValue('session_id', props.data?.session?.id as string)
setFieldValue('year', props.data?.year as string)
setFieldValue('semester', props.data?.semester as string)

const onSubmit = handleSubmit(async values => {
  if (!mutateAsync.value) return

  const submitValues = {
    ...values,
    year: parseInt(values.year, 10),
  }

  await mutateAsync.value(submitValues)

  if (isSuccess.value) {
    resetForm()
    dialog.value = false
  }
})

const cancel = () => {
  resetForm()
  dialog.value = false
}

const resetFormOnUpdate = () => {
  if (props.type === 'edit') {
    resetForm({
      values: {
        session_id: props.data?.session.id,
        year: props.data?.year,
        semester: props.data?.semester,
      },
    })
  } else {
    resetForm({
      values: {
        session_id: undefined,
        year: '',
        semester: '',
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
</script>

<template>
  <VDialog
    v-model="dialog"
    max-width="600"
  >
    <VCard>
      <VCardTitle>
        <p>{{ isAddMode ? 'Tambah' : 'Edit' }} Semester</p>
      </VCardTitle>
      <VCardText>
        <VForm>
          <VRow dense>
            <VCol cols="12">
              <VAutocomplete
                required
                label="Tahun Ajaran"
                v-model="session_id"
                :error-messages="errors.session_id"
                :items="dataListSession?.data"
                item-title="label"
                item-value="value"
                clearable
                :loading="isLoading || isFetching"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                required
                label="Tahun"
                v-model="year"
                :error-messages="errors.year"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                required
                label="Semester"
                v-model="semester"
                :error-messages="errors.semester"
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
          :loading="isPending.value"
          @click="onSubmit"
        >
          Simpan
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
