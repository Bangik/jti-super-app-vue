<script setup lang="ts">
import { OrgUnitHeadSchema } from '@/constants/forms/org-unit'
import { useGetEmployeeAsOptions } from '@/hooks/employee'
import { useStoreHeadOrgUnit } from '@/hooks/org-unit'
import { useGetPositionAsOptions } from '@/hooks/position'
// import type { Position } from '@/types/employee'
import { useForm } from 'vee-validate'

const route = useRoute()
const dialog = defineModel<boolean>()
// const position = ref<Position>('DOSEN' as Position)
const id = ref<string>(route.params.orgUnitId as string)

const {
  data: employeeOptions,
  isLoading: isLoadingEmployee,
  isFetching: isFetchingEmployee,
} = useGetEmployeeAsOptions(undefined, undefined)

const {
  data: positionOptions,
  isLoading: isLoadingPosition,
  isFetching: isFetchingPosition,
} = useGetPositionAsOptions()

const { mutateAsync, isPending, isSuccess } = useStoreHeadOrgUnit(id)

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: OrgUnitHeadSchema,
  initialValues: {
    employee_id: undefined,
    position_id: undefined,
    started_at: '',
    ended_at: '',
    decree_number: '',
    notes: '',
    is_acting: false,
  },
})

const [employee_id] = defineField('employee_id')
const [position_id] = defineField('position_id')
const [started_at] = defineField('started_at')
const [ended_at] = defineField('ended_at')
const [decree_number] = defineField('decree_number')
const [notes] = defineField('notes')
const [is_acting] = defineField('is_acting')

const onSubmit = handleSubmit(async values => {
  await mutateAsync({
    employee_id: values.employee_id!,
    position_id: values.position_id!,
    started_at: new Date(values.started_at),
    ended_at: values.ended_at ? new Date(values.ended_at) : null,
    decree_number: values.decree_number || null,
    notes: values.notes || null,
    is_acting: values.is_acting,
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
</script>

<template>
  <VDialog
    v-model="dialog"
    max-width="600"
  >
    <VCard>
      <VCardTitle>
        <p>Tambah Kepala Unit</p>
      </VCardTitle>
      <VCardText>
        <VForm>
          <VRow dense>
            <VCol cols="12">
              <VAutocomplete
                :items="employeeOptions?.data"
                :loading="isLoadingEmployee || isFetchingEmployee"
                item-title="label"
                item-value="value"
                label="Pilih pegawai"
                placeholder="Ketik nama…"
                clearable
                required
                v-model="employee_id"
                :error-messages="errors.employee_id"
              />
            </VCol>
            <VCol cols="12">
              <VAutocomplete
                :items="positionOptions?.data"
                :loading="isLoadingPosition || isFetchingPosition"
                item-title="label"
                item-value="value"
                label="Pilih jabatan"
                clearable
                required
                v-model="position_id"
                :error-messages="errors.position_id"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                label="Tanggal Mulai"
                type="date"
                required
                v-model="started_at"
                :error-messages="errors.started_at"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                label="Tanggal Selesai"
                type="date"
                v-model="ended_at"
                :error-messages="errors.ended_at"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                label="Nomor SK"
                placeholder="Masukkan nomor SK…"
                v-model="decree_number"
                :error-messages="errors.decree_number"
              />
            </VCol>
            <VCol cols="12">
              <VTextarea
                label="Catatan"
                placeholder="Masukkan catatan…"
                rows="3"
                v-model="notes"
                :error-messages="errors.notes"
              />
            </VCol>
            <VCol cols="12">
              <VCheckbox
                label="Pelaksana Tugas (PLT)"
                v-model="is_acting"
                :error-messages="errors.is_acting"
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
