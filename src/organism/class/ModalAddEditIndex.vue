<script lang="ts" setup>
import { ClassSchema } from '@/constants/forms/class'
import { useAddClass, useUpdateClass } from '@/hooks/class'
import { useGetStudyProgramAsOptions } from '@/hooks/study-program'
import type { ClassList } from '@/types/class'
import { useForm } from 'vee-validate'

interface Props {
  type?: 'add' | 'edit' | 'delete'
  data?: ClassList
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
})
const dialog = defineModel<boolean>()
const { type } = toRefs(props)
const id = computed(() => props.data?.id ?? '')

const {
  data: dataListStudyProgram,
  isLoading: isLoadingStudyProgram,
  isFetching: isFetchingStudyProgram,
} = useGetStudyProgramAsOptions()

const createMutation = useAddClass()
const updateMutation = useUpdateClass(id)
const isAddMode = computed(() => type.value === 'add')

const mutateAsync = computed(() => (isAddMode.value ? createMutation.mutateAsync : updateMutation.mutateAsync))
const isSuccess = computed(() => (isAddMode.value ? createMutation.isSuccess : updateMutation.isSuccess))
const isPending = computed(() => (isAddMode.value ? createMutation.isPending : updateMutation.isPending))

const { errors, defineField, handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: ClassSchema,
  initialValues: {
    study_program_id: '',
    code: '',
    name: '',
  },
})

const [code] = defineField('code')
const [name] = defineField('name')
const [study_program_id] = defineField('study_program_id')

setFieldValue('study_program_id', props.data?.study_program?.id as string)
setFieldValue('code', props.data?.code as string)
setFieldValue('name', props.data?.name as string)

const onSubmit = handleSubmit(async values => {
  if (!mutateAsync.value) return
  await mutateAsync.value(values)

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
        code: props.data?.code,
        name: props.data?.name,
        study_program_id: props.data?.study_program.id ?? '',
      },
    })
  } else {
    resetForm({
      values: {
        code: '',
        name: '',
        study_program_id: undefined,
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
        <p>{{ isAddMode ? 'Tambah' : 'Edit' }} Kelas</p>
      </VCardTitle>
      <VCardText>
        <VForm>
          <VRow dense>
            <VCol cols="12">
              <VAutocomplete
                v-model="study_program_id"
                :items="dataListStudyProgram?.data"
                :loading="isLoadingStudyProgram || isFetchingStudyProgram"
                item-title="label"
                item-value="value"
                label="Program Studi"
                required
                clearable
                :error-messages="errors.study_program_id"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                required
                label="Kode Kelas"
                v-model="code"
                :error-messages="errors.code"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                required
                label="Nama Kelas"
                v-model="name"
                :error-messages="errors.name"
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
