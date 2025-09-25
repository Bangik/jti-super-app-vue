<script lang="ts" setup>
import { UpdateUserRoleSchema } from '@/constants/forms/user'
import { useGetRolesAsOptions } from '@/hooks/role'
import { useUpdateUserRoles } from '@/hooks/usert'
import type { UserDetail } from '@/types/user'
import { useForm } from 'vee-validate'

interface Props {
  type?: 'add' | 'edit' | 'delete'
  data?: UserDetail
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
})
const dialog = defineModel<boolean>()
// const id = computed(() => props.data?.id ?? '')

const { data: dataRoleOptions, isLoading, isFetching } = useGetRolesAsOptions()

const { mutateAsync, isSuccess, isPending } = useUpdateUserRoles()

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: UpdateUserRoleSchema,
  initialValues: {
    id: '',
    roles: [] as string[],
  },
})

const [roles] = defineField('roles')

const onSubmit = handleSubmit(async values => {
  if (!mutateAsync) return
  await mutateAsync(values)

  if (isSuccess) {
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
        id: props.data?.id,
        roles: props.data?.roles.map(role => role.id) as string[],
      },
    })
  } else {
    resetForm({
      values: {
        id: '',
        roles: [] as string[],
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
        <p>Edit Roles</p>
      </VCardTitle>
      <VCardText>
        <VForm>
          <VRow dense>
            <VCol cols="12">
              <VAutocomplete
                v-model="roles"
                :error-messages="errors.roles"
                :items="dataRoleOptions?.data"
                item-title="label"
                item-value="value"
                label="Pilih Roles"
                clearable
                required
                chips
                multiple
                :loading="isLoading || isFetching"
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
