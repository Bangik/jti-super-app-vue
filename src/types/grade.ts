export type GradeHistorySubject = {
  grade_id: string
  assignment_score: number
  attitude_score: number
  credit: number
  final_score: number
  grade_score: number
  grade_letter: string
  grade_point: number
  midterm_score: number
  quiz_score: number
  subject_code: string
  subject_name: string
  workshop_score: number
}

export type GradeHistorySemester = {
  semester: string
  semester_id: string
  subjects: GradeHistorySubject[]
  year: number
}

export type GradeHistoryStudent = {
  id: string
  major: string
  name: string
  nim: string
  status: string
  study_program: string
}

export type GradeHistoryData = {
  semesters: GradeHistorySemester[]
  student: GradeHistoryStudent
}

export type GradeUpdatePayload = {
  assignment_score: number
  attitude_score: number
  grade_score: number
  final_score: number
  midterm_score: number
  quiz_score: number
  workshop_score: number
}

export type GradeUpdateResponse = {
  assignment_score: number
  attitude_score: number
  final_score: number
  grade_id: string
  grade_score: number
  grade_letter: string
  grade_point: number
  midterm_score: number
  quiz_score: number
  workshop_score: number
}
