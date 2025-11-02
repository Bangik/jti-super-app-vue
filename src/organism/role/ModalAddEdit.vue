<script lang="ts" setup>
import { RoleSchema } from '@/constants/forms/role'
import { useGetPermissionsAsOptions } from '@/hooks/permission'
import { useAddRoles, useUpdateRoles } from '@/hooks/role'
import type { Role } from '@/types/role'
import { useForm } from 'vee-validate'

interface Props {
  type?: 'add' | 'edit' | 'delete'
  data?: Role
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
})
const dialog = defineModel<boolean>()
const { type } = toRefs(props)
const id = computed(() => props.data?.id ?? '')

const createMutation = useAddRoles()
const updateMutation = useUpdateRoles(id)
const isAddMode = computed(() => type.value === 'add')

const mutateAsync = computed(() => (isAddMode.value ? createMutation.mutateAsync : updateMutation.mutateAsync))
const isSuccess = computed(() => (isAddMode.value ? createMutation.isSuccess : updateMutation.isSuccess))
const isPending = computed(() => (isAddMode.value ? createMutation.isPending : updateMutation.isPending))

const {
  data: permissionsOptions,
  isLoading: isLoadingPermissions,
  isFetching: isFetchingPermissions,
} = useGetPermissionsAsOptions()

const { errors, defineField, handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: RoleSchema,
  initialValues: {
    name: '',
    permissions: [] as string[],
  },
})

const [name] = defineField('name')
const [permissions] = defineField('permissions')

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
        name: props.data?.name,
        permissions: props.data?.permissions?.map(p => p.id) ?? [],
      },
    })
  } else {
    resetForm({
      values: {
        name: '',
        permissions: [],
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
        <p>{{ isAddMode ? 'Tambah' : 'Edit' }} Role</p>
      </VCardTitle>
      <VCardText>
        <VForm>
          <VRow dense>
            <VCol cols="12">
              <VTextField
                required
                label="Nama Role"
                v-model="name"
                :error-messages="errors.name"
              />
            </VCol>
            <VCol cols="12">
              <VAutocomplete
                chips
                clearable
                multiple
                label="Permissions"
                v-model="permissions"
                :items="permissionsOptions?.data"
                item-title="label"
                item-value="value"
                :loading="isLoadingPermissions || isFetchingPermissions"
                :error-messages="errors.permissions"
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
