<script lang="ts" setup>
import { PositionSchema } from '@/constants/forms/position'
import { ORG_UNIT_TYPE_VALUES } from '@/constants/org-unit'
import { useAddPosition, useUpdatePosition } from '@/hooks/position'
import type { PositionList } from '@/types/position'
import { useForm } from 'vee-validate'

interface Props {
  type?: 'add' | 'edit' | 'delete'
  data?: PositionList
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
})
const dialog = defineModel<boolean>()
const { type } = toRefs(props)
const id = computed(() => props.data?.id ?? '')

const createMutation = useAddPosition()
const updateMutation = useUpdatePosition(id)
const isAddMode = computed(() => type.value === 'add')

const mutateAsync = computed(() => (isAddMode.value ? createMutation.mutateAsync : updateMutation.mutateAsync))
const isSuccess = computed(() => (isAddMode.value ? createMutation.isSuccess : updateMutation.isSuccess))
const isPending = computed(() => (isAddMode.value ? createMutation.isPending : updateMutation.isPending))

const { errors, defineField, handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: PositionSchema,
  initialValues: {
    code: '',
    name: '',
    is_single_holder: false,
    max_holder: null as number | null,
    allowed_unit_types: null as string[] | null,
  },
})

const [code] = defineField('code')
const [name] = defineField('name')
const [is_single_holder] = defineField('is_single_holder')
const [max_holder] = defineField('max_holder')
const [allowed_unit_types] = defineField('allowed_unit_types')

setFieldValue('code', props.data?.code as string)
setFieldValue('name', props.data?.name as string)
setFieldValue('is_single_holder', props.data?.is_single_holder ?? false)
setFieldValue('max_holder', props.data?.max_holder ?? null)
setFieldValue('allowed_unit_types', props.data?.allowed_unit_types ?? null)

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
        is_single_holder: props.data?.is_single_holder ?? false,
        max_holder: props.data?.max_holder ?? null,
        allowed_unit_types: props.data?.allowed_unit_types ?? null,
      },
    })
  } else {
    resetForm({
      values: {
        code: '',
        name: '',
        is_single_holder: false,
        max_holder: null,
        allowed_unit_types: null,
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
        <p>{{ isAddMode ? 'Tambah' : 'Edit' }} Posisi</p>
      </VCardTitle>
      <VCardText>
        <VForm>
          <VRow dense>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                required
                label="Kode Posisi"
                v-model="code"
                :error-messages="errors.code"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                required
                label="Nama Posisi"
                v-model="name"
                :error-messages="errors.name"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model.number="max_holder"
                label="Max Holder"
                type="number"
                min="1"
                :error-messages="errors.max_holder"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="is_single_holder"
                label="Single Holder"
                color="primary"
                inset
              />
            </VCol>
            <VCol cols="12">
              <VAutocomplete
                v-model="allowed_unit_types"
                :items="ORG_UNIT_TYPE_VALUES"
                label="Allowed Unit Types"
                :error-messages="errors.allowed_unit_types"
                chips
                clearable
                multiple
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
