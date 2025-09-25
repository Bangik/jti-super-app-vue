<script lang="ts" setup>
import { useGetEmployeeAsOptions } from '@/hooks/employee'
import { useGetMajorAsOptions } from '@/hooks/major'

const { data: dataListMajor, isLoading: isLoadingListMajor, isFetching: isFetchingListMajor } = useGetMajorAsOptions()
const {
  data: employeeOptions,
  isLoading: isLoadingEmployee,
  isFetching: isFetchingEmployee,
} = useGetEmployeeAsOptions()

const headIndex = ref<number>(0)

type EmployeeRow = {
  _key: string
  employee_id: string | null
  period: string
  order: number | null
}

const form = reactive<{
  name: string
  code: string
  major_id: string | null
  employees: EmployeeRow[]
}>({
  name: '',
  code: '',
  major_id: null,
  employees: [{ _key: crypto.randomUUID(), employee_id: null, period: '', order: 1 }],
})

function removeRow(idx: number) {
  const wasHead = headIndex.value === idx
  form.employees.splice(idx, 1)
  // Re-index headIndex jika baris dihapus
  if (!form.employees.length) {
    headIndex.value = -1 as unknown as number
    return
  }
  if (wasHead) headIndex.value = 0
  else if (headIndex.value > idx) headIndex.value = headIndex.value - 1
}

function move(from: number, to: number) {
  if (to < 0 || to >= form.employees.length) return
  const [row] = form.employees.splice(from, 1)
  form.employees.splice(to, 0, row)
  // sesuaikan index head jika perlu
  if (headIndex.value === from) headIndex.value = to
  else if (headIndex.value > from && headIndex.value <= to) headIndex.value--
  else if (headIndex.value < from && headIndex.value >= to) headIndex.value++
}
</script>

<template>
  <VCard>
    <VToolbar
      flat
      class="px-4"
    >
      <VToolbarTitle class="text-h6">Tambah Lab</VToolbarTitle>
      <VSpacer />
      <VBtn
        variant="text"
        @click="$router.back()"
      >
        <VIcon
          icon="mdi-arrow-left"
          class="me-2"
        />
        Kembali
      </VBtn>
    </VToolbar>

    <VDivider />

    <VCardText>
      <!-- <VAlert
        v-if="headError"
        type="error"
        variant="tonal"
        class="mb-4"
        density="compact"
        :text="headError"
      /> -->

      <VForm>
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              label="Kode Lab"
              placeholder="Masukkan kode lab"
              counter="10"
              prepend-inner-icon="mdi-pound"
              clearable
              autofocus
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              label="Nama Lab"
              placeholder="Masukkan nama lab"
              prepend-inner-icon="mdi-flask-outline"
              clearable
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VAutocomplete
              :items="dataListMajor?.data"
              :loading="isLoadingListMajor || isFetchingListMajor"
              item-title="label"
              item-value="value"
              label="Jurusan"
              placeholder="Pilih jurusan"
              clearable
              prepend-inner-icon="mdi-domain"
            />
          </VCol>

          <VCol cols="12">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-subtitle-1 font-weight-medium">Anggota Lab</div>
              <div class="d-flex align-center gap-2">
                <VChip
                  size="small"
                  class="me-2"
                  variant="tonal"
                >
                  Minimal 1, tepat 1 Kalab
                </VChip>
                <VBtn
                  size="small"
                  variant="tonal"
                  prepend-icon="mdi-plus"
                >
                  Tambah Pegawai
                </VBtn>
              </div>
            </div>

            <VTable
              density="comfortable"
              class="rounded-lg border"
            >
              <thead>
                <tr>
                  <th style="width: 38%">Pegawai</th>
                  <th style="width: 20%">Periode</th>
                  <th style="width: 16%">Kalab</th>
                  <th style="width: 10%">Urutan</th>
                  <th
                    style="width: 16%"
                    class="text-end"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, idx) in form.employees"
                  :key="row._key"
                >
                  <td>
                    <VAutocomplete
                      v-model="row.employee_id"
                      :items="employeeOptions?.data"
                      :loading="isLoadingEmployee || isFetchingEmployee"
                      item-title="label"
                      item-value="value"
                      label="Pilih pegawai"
                      placeholder="Ketik nama…"
                      clearable
                      density="comfortable"
                      hide-details="auto"
                      prepend-inner-icon="mdi-account-badge-outline"
                    />
                  </td>
                  <td>
                    <VTextField
                      v-model="row.period"
                      label="Periode"
                      placeholder="Mis. 2025–2026"
                      density="comfortable"
                      hide-details="auto"
                      prepend-inner-icon="mdi-calendar-range"
                    />
                  </td>
                  <td>
                    <!-- radio style: tepat satu Kalab -->
                    <VRadioGroup
                      v-model="headIndex"
                      :inline="true"
                      class="mt-0"
                      hide-details
                    >
                      <VRadio
                        :value="idx"
                        label="Kalab"
                      />
                    </VRadioGroup>
                  </td>
                  <td>
                    <VTextField
                      v-model.number="row.order"
                      type="number"
                      min="1"
                      label="Urut"
                      placeholder="1"
                      density="comfortable"
                      hide-details="auto"
                      prepend-inner-icon="mdi-sort"
                    />
                  </td>
                  <td class="text-end">
                    <VBtn
                      icon
                      variant="text"
                      :disabled="form.employees.length === 1"
                      @click="removeRow(idx)"
                    >
                      <VIcon icon="mdi-delete-outline" />
                    </VBtn>
                    <VBtn
                      icon
                      variant="text"
                      :disabled="idx === 0"
                      @click="move(idx, idx - 1)"
                    >
                      <VIcon icon="mdi-arrow-up" />
                    </VBtn>
                    <VBtn
                      icon
                      variant="text"
                      :disabled="idx === form.employees.length - 1"
                      @click="move(idx, idx + 1)"
                    >
                      <VIcon icon="mdi-arrow-down" />
                    </VBtn>
                  </td>
                </tr>
                <tr v-if="!form.employees.length">
                  <td
                    colspan="5"
                    class="text-medium-emphasis text-center py-6"
                  >
                    Belum ada pegawai. Klik <strong>Tambah Pegawai</strong>.
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
