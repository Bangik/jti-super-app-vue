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
