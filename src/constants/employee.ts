export const POSITION = ['DOSEN', 'TEKNISI', 'ADMINISTRASI']

export const SUPERVISOR_POSITION = [
  'ACADEMIC_ADVISOR',
  'SUPERVISOR_1',
  'SUPERVISOR_2',
  'SUPERVISOR_INTERNSHIP',
] as const

export const SUPERVISOR_POSITION_ID_MAP = {
  ACADEMIC_ADVISOR: 'Dosen Wali',
  SUPERVISOR_1: 'Pembimbing 1',
  SUPERVISOR_2: 'Pembimbing 2',
  SUPERVISOR_INTERNSHIP: 'Pembimbing Magang',
} satisfies Record<(typeof SUPERVISOR_POSITION)[number], string>
