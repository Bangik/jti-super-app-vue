<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useCreateRoom, useUpdateRoom } from '@/hooks/room'
import { roomTypeOptions } from '@/constants/tables/room'
import type { Room } from '@/types/room'
import { RoomSchema } from '@/constants/forms/room'
// import { useGetLab } from '@/hooks/lab'

interface Props {
  typeMode?: 'add' | 'edit' | 'delete'
  data?: Room
}

const props = withDefaults(defineProps<Props>(), {
  typeMode: 'add',
})

const dialog = defineModel<boolean>()
const { typeMode } = toRefs(props)
const id = computed(() => props.data?.id ?? '')

const { handleSubmit, defineField, resetForm, setValues, errors } = useForm({
  validationSchema: RoomSchema,
  initialValues: {
    code: '',
    name: '',
    is_active: true,
    capacity: 30,
    type: 'CLASS',
  },
})

const [code] = defineField('code')
const [name] = defineField('name')
const [capacity] = defineField('capacity')
const [type] = defineField('type')
// const [labId] = defineField('lab_id')
const [isActive] = defineField('is_active')

// Hooks
const createMutation = useCreateRoom()
const updateMutation = useUpdateRoom(id)

const isAddMode = computed(() => typeMode.value === 'add')

const mutateAsync = computed(() => (isAddMode.value ? createMutation.mutateAsync : updateMutation.mutateAsync))
const isSuccess = computed(() => (isAddMode.value ? createMutation.isSuccess : updateMutation.isSuccess))
const isPending = computed(() => (isAddMode.value ? createMutation.isPending : updateMutation.isPending))

// Fetch Labs Option (Ambil semua untuk dropdown)
// Jika useGetLabs butuh params, sesuaikan pageQuery-nya
// const { data: labData } = useGetLab(ref({ page: 1, per_page: 100, search: '' }))
// const labOptions = computed(() =>
//   labData.value?.data.map((l: any) => ({ title: l.name, value: l.id })) || []
// )

const onSubmit = handleSubmit(async values => {
  if (!mutateAsync.value) return
  await mutateAsync.value(values)

  if (isSuccess.value) {
    resetForm()
    dialog.value = false
  }
})

const resetFormOnUpdate = () => {
  if (props.data && props.typeMode === 'edit') {
    setValues({
      code: props.data.code,
      name: props.data.name,
      capacity: props.data.capacity,
      type: props.data.type,
      // lab_id: props.data.lab_id,
      is_active: props.data.is_active,
    })
  } else {
    resetForm({
      values: {
        code: '',
        name: '',
        capacity: 30,
        type: 'CLASS',
        // lab_id: null,
        is_active: true,
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

const close = () => {
  resetForm()
  dialog.value = false
}
</script>

<template>
  <VDialog
    v-model="dialog"
    max-width="600"
  >
    <VCard :title="isAddMode ? 'Tambah Ruangan' : 'Edit Ruangan'">
      <VCardText>
        <VForm>
          <VRow dense>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="code"
                label="Kode Ruangan"
                :error-messages="errors.code"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="name"
                label="Nama Ruangan"
                :error-messages="errors.name"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model.number="capacity"
                label="Kapasitas"
                type="number"
                :error-messages="errors.capacity"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="type"
                :items="roomTypeOptions"
                label="Tipe Ruangan"
                :error-messages="errors.type"
              />
            </VCol>
            <!-- <VCol cols="12">
              <VAutocomplete
                v-model="labId"
                :items="labOptions"
                label="Milik Laboratorium (Opsional)"
                clearable
                :error-messages="errors.lab_id"
              />
            </VCol> -->
            <VCol cols="12">
              <VSwitch
                v-model="isActive"
                label="Status Aktif"
                color="primary"
                inset
              />
            </VCol>
          </VRow>

          <VCardActions>
            <VSpacer />
            <VBtn
              color="error"
              variant="plain"
              @click="close"
              >Batal</VBtn
            >
            <VBtn
              type="submit"
              color="primary"
              variant="tonal"
              :loading="isPending.value"
              @click="onSubmit"
              >Simpan</VBtn
            >
          </VCardActions>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
