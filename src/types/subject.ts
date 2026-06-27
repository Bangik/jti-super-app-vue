export type SubjectList = {
  id: string
  code: string
  name: string
  study_program_name: string
  study_program_id: string
  status: 'ACTIVE' | 'INACTIVE'
}

export type SubjectOption = {
  value: string
  label: string
}

export type LectureOnSubject = {
  id: string
  semester_id: string
  subject: {
    id: string
    name: string
    code: string
    study_program_id: string
  }
  lectures: Array<{
    id: string
    major_id: string
    user: {
      id: string
      name: string
      img_path: string
      img_name: string
    }
  }>
}

export type SelectedLectureData = {
  data: Array<{
    subject_semester_id: string
    lecture_ids: Array<string>
  }>
}

export type SubjectSemesterOption = {
  id: string
  subject_id: string
  semester_id: string
  name: string
  code: string
}

export type SubjectFiltered = {
  id: string
  code: string
  name: string
  study_program_id: string
  study_program_name: string
  subject_semester_id: string
  semester_id: string
  semester_name: string
  session_id: string
  session_name: string
  lectures: Array<{
    id: string
    major_id: string | null
    user: {
      id: string
      name: string
      avatar?: string
    }
    subject_lecture_id: string
  }>
}

export type FilterSubject = {
  study_program_id?: string
  semester_type?: string
  session_id?: string
  major_id?: string
  user_id?: string
  employee_id?: string
}
