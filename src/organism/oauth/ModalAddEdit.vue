<script lang="ts" setup>
import { OauthClientSchema } from '@/constants/forms/oauth'
import { useAddOauthClient, useUpdateOauthClient } from '@/hooks/oauth'
import type { OauthClient } from '@/types/oauth'
import { useForm } from 'vee-validate'

interface Props {
  type?: 'add' | 'edit' | 'delete'
  data?: OauthClient
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
})
const dialog = defineModel<boolean>()
const { type } = toRefs(props)
const id = computed(() => props.data?.id ?? '')

const createMutation = useAddOauthClient()
const updateMutation = useUpdateOauthClient(id)
const isAddMode = computed(() => type.value === 'add')

const mutateAsync = computed(() => (isAddMode.value ? createMutation.mutateAsync : updateMutation.mutateAsync))
const isSuccess = computed(() => (isAddMode.value ? createMutation.isSuccess : updateMutation.isSuccess))
const isPending = computed(() => (isAddMode.value ? createMutation.isPending : updateMutation.isPending))

const { errors, defineField, handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: OauthClientSchema,
  initialValues: {
    name: '',
    secret: '',
    redirect: '',
  },
})

const [name] = defineField('name')
const [secret] = defineField('secret')
const [redirect] = defineField('redirect')

setFieldValue('name', props.data?.name as string)
setFieldValue('redirect', props.data?.redirect as string)

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
        name: props.data?.name,
        redirect: props.data?.redirect,
      },
    })
  } else {
    resetForm({
      values: {
        name: '',
        secret: '',
        redirect: '',
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
        <p>{{ isAddMode ? 'Tambah' : 'Edit' }} Oauth Client</p>
      </VCardTitle>
      <VCardText>
        <VForm>
          <VRow dense>
            <VCol cols="12">
              <VTextField
                required
                label="Nama Client"
                v-model="name"
                :error-messages="errors.name"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                required
                label="Secret"
                v-model="secret"
                :error-messages="errors.secret"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                required
                label="Redirect"
                v-model="redirect"
                :error-messages="errors.redirect"
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
