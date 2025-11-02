<script lang="ts" setup>
import { SessionSchema } from '@/constants/forms/session'
import { useAddSession, useUpdateSession } from '@/hooks/session'
import type { SessionList } from '@/types/session'
import { useForm } from 'vee-validate'

interface Props {
  type?: 'add' | 'edit' | 'delete'
  data?: SessionList
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
})
const dialog = defineModel<boolean>()
const { type } = toRefs(props)
const id = computed(() => props.data?.id ?? '')

const createMutation = useAddSession()
const updateMutation = useUpdateSession(id)
const isAddMode = computed(() => type.value === 'add')

const mutateAsync = computed(() => (isAddMode.value ? createMutation.mutateAsync : updateMutation.mutateAsync))
const isSuccess = computed(() => (isAddMode.value ? createMutation.isSuccess : updateMutation.isSuccess))
const isPending = computed(() => (isAddMode.value ? createMutation.isPending : updateMutation.isPending))

const { errors, defineField, handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: SessionSchema,
  initialValues: {
    session: '',
    is_active: false,
  },
})

const [session] = defineField('session')
const [is_active] = defineField('is_active')

setFieldValue('session', props.data?.session as string)
setFieldValue('is_active', props.data?.is_active as boolean)

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
        session: props.data?.session,
        is_active: props.data?.is_active,
      },
    })
  } else {
    resetForm({
      values: {
        session: '',
        is_active: false,
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
        <p>{{ isAddMode ? 'Tambah' : 'Edit' }} Tahun Ajaran</p>
      </VCardTitle>
      <VCardText>
        <VForm>
          <VRow dense>
            <VCol cols="12">
              <VTextField
                required
                label="Tahun Ajaran"
                v-model="session"
                :error-messages="errors.session"
              />
            </VCol>
          </VRow>
          <VRow dense>
            <VCol cols="12">
              <VSwitch
                v-model="is_active"
                label="Status"
                :error-messages="errors.is_active"
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
