<script lang="ts" setup>
import { OrgUnitSchema } from '@/constants/forms/org-unit'
import { ORG_UNIT_TYPE_VALUES } from '@/constants/org-unit'
import { useAddOrgUnit, useGetOrgUnitAsOptions, useUpdateOrgUnit } from '@/hooks/org-unit'
import { type OrgUnitList, type OrgUnitType } from '@/types/org-unit'
import { useForm } from 'vee-validate'

interface Props {
  type?: 'add' | 'edit' | 'delete'
  data?: OrgUnitList
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
})
const dialog = defineModel<boolean>()
const { type } = toRefs(props)
const id = computed(() => props.data?.id ?? '')

const createMutation = useAddOrgUnit()
const updateMutation = useUpdateOrgUnit(id)
const isAddMode = computed(() => type.value === 'add')

const mutateAsync = computed(() => (isAddMode.value ? createMutation.mutateAsync : updateMutation.mutateAsync))
const isSuccess = computed(() => (isAddMode.value ? createMutation.isSuccess : updateMutation.isSuccess))
const isPending = computed(() => (isAddMode.value ? createMutation.isPending : updateMutation.isPending))

const { data: orgUnitOption, isLoading, isFetching } = useGetOrgUnitAsOptions()

const { errors, defineField, handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: OrgUnitSchema,
  initialValues: {
    code: '',
    name: '',
    unit_type: '' as OrgUnitType,
    parent_id: '',
  },
})

const [code] = defineField('code')
const [name] = defineField('name')
const [unit_type] = defineField('unit_type')
const [parent_id] = defineField('parent_id')

setFieldValue('code', props.data?.code as string)
setFieldValue('name', props.data?.name as string)
setFieldValue('unit_type', (props.data?.unit_type as OrgUnitType) ?? ('' as OrgUnitType))
setFieldValue('parent_id', props.data?.parent?.value as string)

const onSubmit = handleSubmit(async values => {
  if (!mutateAsync.value) return

  // Ensure unit_type matches expected OrgUnitType type
  const payload: {
    code: string
    name: string
    unit_type: OrgUnitType
    parent_id?: string | null
  } = {
    code: values.code,
    name: values.name,
    unit_type: values.unit_type as OrgUnitType,
    parent_id: values.parent_id || null,
  }

  await mutateAsync.value(payload)

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
        unit_type: props.data?.unit_type,
        parent_id: props.data?.parent?.value,
      },
    })
  } else {
    resetForm({
      values: {
        code: '',
        name: '',
        unit_type: undefined,
        parent_id: undefined,
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
        <p>{{ isAddMode ? 'Tambah' : 'Edit' }} Unit</p>
      </VCardTitle>
      <VCardText>
        <VForm>
          <VRow dense>
            <VCol cols="12">
              <VTextField
                required
                label="Code Unit"
                v-model="code"
                :error-messages="errors.code"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                required
                label="Nama Unit"
                v-model="name"
                :error-messages="errors.name"
              />
            </VCol>
            <VCol cols="12">
              <VSelect
                required
                label="Tipe Unit"
                :items="ORG_UNIT_TYPE_VALUES"
                v-model="unit_type"
                :error-messages="errors.unit_type"
              />
            </VCol>
            <VCol cols="12">
              <VSelect
                :items="orgUnitOption?.data || []"
                item-title="label"
                item-value="value"
                label="Unit Induk (Parent Unit)"
                v-model="parent_id"
                :loading="isLoading || isFetching"
                :error-messages="errors.parent_id"
                clearable
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
