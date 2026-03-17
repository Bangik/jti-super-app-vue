<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useGetWeeklySchedule } from '@/hooks/schedule'
import { useGetStudyProgramAsOptions } from '@/hooks/study-program'
import { useGetSemesterAsOptions } from '@/hooks/semester'
import { useGetEmployeeAsOptions } from '@/hooks/employee'
import { CLASS_LIST } from '@/constants/student'
import { DAYS_OF_WEEK } from '@/constants/day'
import type { WeeklyScheduleFilter, WeeklyScheduleItem, WeeklyTimeSlot } from '@/types/schedule'
import { useGetSessionAsOptions } from '@/hooks/session'
import { useGetMajorAsOptions } from '@/hooks/major'

const search = ref('')
const sessionId = ref<string | undefined>(undefined)
const majorId = ref<string | undefined>(undefined)
const semesterId = ref<string | undefined>(undefined)
const studyProgramId = ref<string | undefined>(undefined)
const classGroup = ref<string | undefined>(undefined)
const technicianId = ref<string | undefined>(undefined)
const selectedDay = ref<string | undefined>(undefined)

const shouldFetchStudyProgram = computed(() => !!majorId.value)
const shouldFetchSemester = computed(() => !!sessionId.value)

const filter = ref<WeeklyScheduleFilter>({})

watch([semesterId, studyProgramId, classGroup, technicianId], () => {
  filter.value = {
    semester_id: semesterId.value || undefined,
    study_program_id: studyProgramId.value || undefined,
    class_group: classGroup.value || undefined,
    employee_id: technicianId.value || undefined,
    search: search.value || undefined,
  }
})

watchDebounced(
  search,
  val => {
    filter.value = { ...filter.value, search: val || undefined }
  },
  { debounce: 600 },
)
const { data: majorOption, isLoading: isLoadingMajor, isFetching: isFetchingMajor } = useGetMajorAsOptions()
const { data: sessionOptions, isLoading: isLoadingSession, isFetching: isFetchingSession } = useGetSessionAsOptions()
const { data: semesterOptions, isLoading: semesterLoading } = useGetSemesterAsOptions(
  computed(() => sessionId.value || ''),
  shouldFetchSemester,
)
const { data: studyProgramOptions, isLoading: studyProgramLoading } = useGetStudyProgramAsOptions(
  computed(() => majorId.value || ''),
  shouldFetchStudyProgram,
)
const { data: technicianOptions, isLoading: technicianLoading } = useGetEmployeeAsOptions(undefined, ref('TEKNISI'))

const { data, isLoading, isFetching } = useGetWeeklySchedule(filter)

const allTimeSlots = computed<Pick<WeeklyTimeSlot, 'start_time' | 'end_time'>[]>(() => {
  if (!data.value?.data) return []
  const map = new Map<string, Pick<WeeklyTimeSlot, 'start_time' | 'end_time'>>()
  data.value.data.forEach(day =>
    day.time_slots.forEach(slot => {
      const key = `${slot.start_time}|${slot.end_time}`
      if (!map.has(key)) map.set(key, { start_time: slot.start_time, end_time: slot.end_time })
    }),
  )
  return [...map.values()].sort((a, b) => a.start_time.localeCompare(b.start_time))
})

const orderedDays = computed(() => {
  const all = DAYS_OF_WEEK.map(d => d.value)
  return selectedDay.value ? all.filter(d => d === selectedDay.value) : all
})

const getSchedules = (dayValue: string, start: string, end: string): WeeklyScheduleItem[] => {
  if (!data.value?.data) return []
  const day = data.value.data.find(d => d.day === dayValue)
  if (!day) return []
  return day.time_slots.find(s => s.start_time === start && s.end_time === end)?.schedules ?? []
}

const dayLabel = (value: string) => DAYS_OF_WEEK.find(d => d.value === value)?.label ?? value

const fmt = (t: string) => t.slice(0, 5)

const hasData = computed(() => (data.value?.data?.length ?? 0) > 0)
</script>

<template>
  <VCard
    class="mb-4"
    flat
    border
  >
    <VCardText>
      <VRow dense>
        <VCol
          cols="12"
          sm="6"
          md
        >
          <VAutocomplete
            v-model="majorId"
            label="Jurusan"
            :items="majorOption?.data"
            item-title="label"
            item-value="value"
            clearable
            :loading="isLoadingMajor || isFetchingMajor"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
          md
        >
          <VAutocomplete
            v-model="studyProgramId"
            label="Program Studi"
            :items="studyProgramOptions?.data ?? []"
            item-title="label"
            item-value="value"
            clearable
            hide-details
            density="comfortable"
            :loading="studyProgramLoading"
            :disabled="!majorId"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
          md
        >
          <VAutocomplete
            label="Tahun Ajaran"
            v-model="sessionId"
            :items="sessionOptions?.data"
            item-title="label"
            item-value="value"
            clearable
            :loading="isLoadingSession || isFetchingSession"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
          md
        >
          <VAutocomplete
            v-model="semesterId"
            label="Semester"
            :items="semesterOptions?.data ?? []"
            :item-title="(item: any) => `${item.semester} – ${item.year}`"
            item-value="id"
            clearable
            hide-details
            density="comfortable"
            :loading="semesterLoading"
            :disabled="!sessionId"
          />
        </VCol>

        <VCol
          cols="12"
          sm="6"
          md
        >
          <VAutocomplete
            v-model="classGroup"
            label="Golongan / Kelas"
            :items="CLASS_LIST"
            item-title="name"
            item-value="id"
            clearable
            hide-details
            density="comfortable"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
          md
        >
          <VAutocomplete
            v-model="technicianId"
            label="Teknisi"
            :items="technicianOptions?.data ?? []"
            item-title="label"
            item-value="value"
            clearable
            hide-details
            density="comfortable"
            :loading="technicianLoading"
          />
        </VCol>
        <VCol
          cols="12"
          sm="6"
          md
        >
          <VAutocomplete
            v-model="selectedDay"
            label="Hari"
            :items="DAYS_OF_WEEK"
            item-title="label"
            item-value="value"
            clearable
            hide-details
            density="comfortable"
          />
        </VCol>
        <VCol
          cols="12"
          md
        >
          <VTextField
            v-model="search"
            label="Cari Mata Kuliah / Ruangan"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            density="comfortable"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <!-- Schedule Table Card -->
  <VCard
    flat
    border
  >
    <VProgressLinear
      v-if="isLoading || isFetching"
      indeterminate
      color="primary"
    />

    <!-- Empty / initial state -->
    <template v-if="!isLoading && !isFetching && !hasData">
      <div class="d-flex flex-column align-center justify-center py-16 text-medium-emphasis">
        <VIcon
          icon="mdi-calendar-blank-outline"
          size="64"
          class="mb-4 text-disabled"
        />
        <p class="text-body-1">Tidak ada jadwal ditemukan.</p>
        <p class="text-caption">Coba ubah atau hapus filter di atas.</p>
      </div>
    </template>

    <!-- Table -->
    <template v-if="hasData || isLoading || isFetching">
      <div class="schedule-wrapper">
        <table class="schedule-table">
          <!-- Header -->
          <thead>
            <tr>
              <th class="th-day">Hari</th>
              <th
                v-for="slot in allTimeSlots"
                :key="`h-${slot.start_time}`"
                class="th-slot"
              >
                {{ fmt(slot.start_time) }} – {{ fmt(slot.end_time) }}
              </th>
            </tr>
          </thead>

          <!-- Body -->
          <tbody>
            <tr
              v-for="day in orderedDays"
              :key="day"
            >
              <!-- Day label -->
              <td class="td-day">
                <span class="font-weight-bold text-body-2">{{ dayLabel(day) }}</span>
              </td>

              <!-- Slot cells -->
              <td
                v-for="slot in allTimeSlots"
                :key="`${day}-${slot.start_time}`"
                class="td-slot"
              >
                <!-- Skeleton while loading -->
                <template v-if="isLoading">
                  <VSkeletonLoader
                    type="chip"
                    class="mb-1"
                  />
                </template>

                <!-- Schedule cards -->
                <template v-else>
                  <div
                    v-for="s in getSchedules(day, slot.start_time, slot.end_time)"
                    :key="s.schedule_id"
                    class="schedule-card"
                  >
                    <!-- Subject -->
                    <p class="text-caption font-weight-bold mb-1 text-white">
                      {{ s.subject_name }}
                    </p>
                    <p class="text-caption mb-1 text-medium-emphasis">
                      {{ s.subject_code }}
                    </p>

                    <VDivider
                      class="my-1"
                      color="white"
                    />

                    <!-- Room -->
                    <div class="d-flex align-start gap-1 mb-1">
                      <VIcon
                        icon="mdi-map-marker-outline"
                        size="12"
                        class="mt-1"
                      />
                      <span class="text-caption text-white">{{ s.room_name }}</span>
                    </div>

                    <!-- Prodi + Smt + Kelas -->
                    <div class="d-flex align-start gap-1 mb-1">
                      <VIcon
                        icon="mdi-school-outline"
                        size="12"
                        class="mt-1"
                      />
                      <span class="text-caption text-white">
                        {{ s.study_program_name }} · Smt {{ s.semester_level }} · {{ s.class_group }}
                      </span>
                    </div>

                    <!-- Teknisi (optional) -->
                    <div
                      v-if="s.technician_name"
                      class="d-flex align-start gap-1"
                    >
                      <VIcon
                        icon="mdi-account-wrench-outline"
                        size="12"
                        class="mt-1"
                      />
                      <span class="text-caption text-white">{{ s.technician_name }}</span>
                    </div>
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </VCard>
</template>

<style scoped>
.schedule-wrapper {
  overflow-x: auto;
  width: 100%;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 700px;
}

.th-day,
.th-slot {
  padding: 10px 12px;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background-color: rgba(var(--v-theme-primary), 0.08);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  white-space: nowrap;
}

.th-day {
  width: 90px;
  min-width: 90px;
  position: sticky;
  left: 0;
  z-index: 3;
}

.th-slot {
  min-width: 220px;
}

.td-day {
  padding: 10px 8px;
  text-align: center;
  font-size: 0.75rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background-color: rgba(var(--v-theme-primary), 0.04);
  vertical-align: middle;
  position: sticky;
  left: 0;
  z-index: 2;
  width: 90px;
  min-width: 90px;
}

.td-slot {
  padding: 6px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  vertical-align: top;
  min-width: 220px;
}

.schedule-card {
  border-radius: 8px;
  background-color: rgb(var(--v-theme-primary));
  color: rgba(var(--v-theme-on-primary), 1);
  padding: 8px 10px;
  margin-bottom: 6px;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
  overflow: hidden;
}

.schedule-card:last-child {
  margin-bottom: 0;
}

.schedule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.35);
}

.schedule-card .text-medium-emphasis {
  color: rgba(var(--v-theme-on-primary), 0.75) !important;
}

.schedule-card .v-icon {
  color: rgba(var(--v-theme-on-primary), 0.85) !important;
  flex-shrink: 0;
}
</style>
