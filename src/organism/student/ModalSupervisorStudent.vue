<script lang="ts" setup>
import { SUPERVISOR_POSITION, SUPERVISOR_POSITION_ID_MAP } from '@/constants/employee'
import { useGetEmployeeAsOptions, useGetSupervisorsByStudent, useUpdateSupervisorsByStudent } from '@/hooks/employee'
import type { UpdateStudentSupervisorsPayload } from '@/services/employee'

const props = defineProps<{ studentId: string; studentName: string }>()
const dialog = defineModel<boolean>()

const studentId = computed(() => props.studentId)
const { data: current, isFetching } = useGetSupervisorsByStudent(studentId, dialog as Ref<boolean>)
const { data: employeeOptions, isLoading: isLoadingEmployee } = useGetEmployeeAsOptions(
  ref(''),
  ref('DOSEN'),
  dialog as Ref<boolean>,
)
const { mutateAsync, isPending } = useUpdateSupervisorsByStudent(studentId)

const form = reactive<Record<string, string | null>>({})
const initial = reactive<Record<string, string | null>>({})

watch(
  () => [current.value, dialog.value],
  () => {
    if (!dialog.value) return
    for (const pos of SUPERVISOR_POSITION) {
      const val = current.value?.data?.find(s => s.position === pos)?.employee_id ?? null
      form[pos] = val
      initial[pos] = val
    }
  },
  { immediate: true },
)

const manual = (pos: string) => current.value?.data?.find(s => s.position === pos)?.is_manual

const onSubmit = async () => {
  const payload: UpdateStudentSupervisorsPayload = {}
  for (const pos of SUPERVISOR_POSITION) {
    if (form[pos] !== initial[pos]) {
      payload[pos.toLowerCase() as Lowercase<typeof pos>] = form[pos] ?? ''
    }
  }
  if (Object.keys(payload).length) await mutateAsync(payload)
  dialog.value = false
}
</script>

<template>
  <VDialog
    max-width="600"
    v-model="dialog"
  >
    <VCard :loading="isFetching">
      <VCardTitle>Atur Pembimbing - {{ studentName }}</VCardTitle>
      <VCardText>
        <VRow dense>
          <VCol
            v-for="pos in SUPERVISOR_POSITION"
            :key="pos"
            cols="12"
          >
            <VAutocomplete
              v-model="form[pos]"
              :items="employeeOptions?.data"
              item-title="label"
              item-value="value"
              :label="SUPERVISOR_POSITION_ID_MAP[pos]"
              :hint="manual(pos) ? 'Diatur manual (tidak ditimpa sinkronisasi Polije)' : undefined"
              persistent-hint
              :loading="isLoadingEmployee"
              clearable
            />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="error"
          variant="plain"
          @click="dialog = false"
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
