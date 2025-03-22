<script lang="ts" setup>
import { MajorSchema } from '@/constants/forms/major'
import { useAddMajor, useUpdateMajor } from '@/hooks/major'
import type { MajorList } from '@/types/major'
import { useForm } from 'vee-validate'

interface Props {
  type?: 'add' | 'edit' | 'delete'
  data?: MajorList
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
})
const dialog = defineModel<boolean>()
const { type } = toRefs(props)
const id = computed(() => props.data?.id ?? '')

const createMutation = useAddMajor()
const updateMutation = useUpdateMajor(id)
const isAddMode = computed(() => type.value === 'add')

const mutateAsync = computed(() => (isAddMode.value ? createMutation.mutateAsync : updateMutation.mutateAsync))
const isSuccess = computed(() => (isAddMode.value ? createMutation.isSuccess : updateMutation.isSuccess))
const isPending = computed(() => (isAddMode.value ? createMutation.isPending : updateMutation.isPending))

const { errors, defineField, handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: MajorSchema,
  initialValues: {
    code: '',
    name: '',
  },
})

const [code] = defineField('code')
const [name] = defineField('name')

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
      },
    })
  } else {
    resetForm({
      values: {
        code: '',
        name: '',
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
        <p>{{ isAddMode ? 'Tambah' : 'Edit' }} Jurusan</p>
      </VCardTitle>
      <VCardText>
        <VForm>
          <VRow dense>
            <VCol cols="12">
              <VTextField
                required
                label="Code Jurusan"
                v-model="code"
                :error-messages="errors.code"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                required
                label="Nama Jurusan"
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
