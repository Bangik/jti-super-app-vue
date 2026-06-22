<script setup lang="ts">
import { useGetGradeHistory, useUpdateGrade } from '@/hooks/grade'
import type { GradeHistorySemester } from '@/types/grade'

const route = useRoute()

const studentId = computed(() => String(route.params.studentId || ''))
const semesterId = computed(() => String(route.params.semesterId || ''))
const shouldFetchGradeHistory = computed(() => !!studentId.value && !!semesterId.value)

const { data, isLoading, isFetching, error } = useGetGradeHistory(studentId, semesterId, shouldFetchGradeHistory)
const { mutateAsync: updateGrade, isPending: isUpdatingGrade } = useUpdateGrade()

const student = computed(() => data.value?.data?.student)
const semesters = ref<GradeHistorySemester[]>([])
const editingCell = ref<{ semesterId: string; subjectCode: string } | null>(null)
const editingFinalScore = ref('')

const isEditing = (semesterId: string, subjectCode: string) => {
  return editingCell.value?.semesterId === semesterId && editingCell.value?.subjectCode === subjectCode
}

const startEditFinalScore = (semesterId: string, subjectCode: string, score: number) => {
  editingCell.value = { semesterId, subjectCode }
  editingFinalScore.value = String(score)
}

const cancelEditFinalScore = () => {
  editingCell.value = null
  editingFinalScore.value = ''
}

const saveFinalScore = async (semesterId: string, subjectCode: string) => {
  if (isUpdatingGrade.value) {
    return
  }

  const parsedScore = Number(editingFinalScore.value)

  if (Number.isNaN(parsedScore)) {
    cancelEditFinalScore()
    return
  }

  const selectedSemester = semesters.value.find(item => item.semester_id === semesterId)
  const selectedSubject = selectedSemester?.subjects.find(item => item.subject_code === subjectCode)

  if (!selectedSubject) {
    cancelEditFinalScore()
    return
  }

  const payload = {
    assignment_score: selectedSubject.assignment_score,
    attitude_score: selectedSubject.attitude_score,
    final_score: selectedSubject.final_score,
    grade_score: parsedScore,
    midterm_score: selectedSubject.midterm_score,
    quiz_score: selectedSubject.quiz_score,
    workshop_score: selectedSubject.workshop_score,
  }

  try {
    const response = await updateGrade({
      id: selectedSubject.grade_id,
      payload,
    })

    selectedSubject.assignment_score = response.data?.assignment_score ?? selectedSubject.assignment_score
    selectedSubject.attitude_score = response.data?.attitude_score ?? selectedSubject.attitude_score
    selectedSubject.final_score = response.data?.final_score ?? selectedSubject.final_score
    selectedSubject.grade_score = response.data?.grade_score ?? selectedSubject.grade_score
    selectedSubject.grade_letter = response.data?.grade_letter ?? selectedSubject.grade_letter
    selectedSubject.grade_point = response.data?.grade_point ?? selectedSubject.grade_point
    selectedSubject.midterm_score = response.data?.midterm_score ?? selectedSubject.midterm_score
    selectedSubject.quiz_score = response.data?.quiz_score ?? selectedSubject.quiz_score
    selectedSubject.workshop_score = response.data?.workshop_score ?? selectedSubject.workshop_score

    cancelEditFinalScore()
  } catch {
    // Error toast is already handled in mutation hook.
  }
}

const cloneSemesters = (value?: GradeHistorySemester[]) => {
  if (!value) {
    return []
  }

  return value.map(semester => ({
    ...semester,
    subjects: semester.subjects.map(subject => ({ ...subject })),
  }))
}

watch(
  () => data.value?.data?.semesters,
  value => {
    semesters.value = cloneSemesters(value)
  },
  { immediate: true },
)
</script>

<template>
  <VCard>
    <VCardText>
      <VAlert
        v-if="error"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ error.message }}
      </VAlert>

      <template v-if="student">
        <VRow class="mb-2">
          <VCol
            cols="12"
            md="6"
          >
            <p class="mb-1"><strong>Nama:</strong> {{ student.name }}</p>
            <p class="mb-1"><strong>NIM:</strong> {{ student.nim }}</p>
            <p class="mb-1"><strong>Status:</strong> {{ student.status }}</p>
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <p class="mb-1"><strong>Jurusan:</strong> {{ student.major }}</p>
            <p class="mb-1"><strong>Program Studi:</strong> {{ student.study_program }}</p>
          </VCol>
        </VRow>
      </template>

      <VProgressLinear
        v-if="isLoading || isFetching"
        indeterminate
        color="primary"
        class="mb-4"
      />

      <VAlert
        v-if="!isLoading && !isFetching && !semesters.length"
        type="info"
        variant="tonal"
      >
        Data nilai belum tersedia.
      </VAlert>

      <VAlert
        v-if="semesters.length"
        type="info"
        variant="tonal"
        class="mb-4"
      >
        Klik dua kali pada kolom Nilai Akhir untuk mengubah nilai.
      </VAlert>

      <div
        v-for="semester in semesters"
        :key="semester.semester_id"
        class="mb-6"
      >
        <p class="text-subtitle-1 mb-2 font-weight-medium">Semester {{ semester.semester }} - {{ semester.year }}</p>

        <VTable>
          <thead>
            <tr>
              <th>Kode MK</th>
              <th>Mata Kuliah</th>
              <th>SKS</th>
              <th>Quiz</th>
              <th>Tugas</th>
              <th>UTS</th>
              <th>UAS</th>
              <th>Workshop</th>
              <th>Sikap</th>
              <th>Nilai Akhir</th>
              <th>Huruf</th>
              <th>Mutu</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="subject in semester.subjects"
              :key="subject.subject_code"
            >
              <td>{{ subject.subject_code }}</td>
              <td>{{ subject.subject_name }}</td>
              <td>{{ subject.credit }}</td>
              <td>{{ subject.quiz_score }}</td>
              <td>{{ subject.assignment_score }}</td>
              <td>{{ subject.midterm_score }}</td>
              <td>{{ subject.final_score }}</td>
              <td>{{ subject.workshop_score }}</td>
              <td>{{ subject.attitude_score }}</td>
              <td>
                <VTextField
                  v-if="isEditing(semester.semester_id, subject.subject_code)"
                  v-model="editingFinalScore"
                  type="number"
                  hide-details
                  density="compact"
                  variant="outlined"
                  :loading="isUpdatingGrade"
                  :disabled="isUpdatingGrade"
                  autofocus
                  @keyup.enter="saveFinalScore(semester.semester_id, subject.subject_code)"
                  @keyup.esc="cancelEditFinalScore"
                  @blur="saveFinalScore(semester.semester_id, subject.subject_code)"
                />
                <span
                  v-else
                  class="cursor-pointer"
                  @dblclick="startEditFinalScore(semester.semester_id, subject.subject_code, subject.grade_score)"
                >
                  {{ subject.grade_score }}
                </span>
              </td>
              <td>{{ subject.grade_letter }}</td>
              <td>{{ subject.grade_point.toFixed(2) }}</td>
            </tr>
          </tbody>
        </VTable>
      </div>
    </VCardText>
  </VCard>
</template>
