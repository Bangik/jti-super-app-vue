<script lang="ts" setup>
import { useGetMajorAsOptions } from '@/hooks/major'
import { useGetStudyProgramAsOptions } from '@/hooks/study-program'
import avatar1 from '@images/avatars/avatar-1.png'
// import { CLASS_LIST } from '@/constants/student'
// import { useGetSessionAsOptions } from '@/hooks/session'
// import { useGetSemesterAsOptions } from '@/hooks/semester'
import type { StudentDetail } from '@/types/student'
import { useUpdateStudent } from '@/hooks/student'
import { StudentUpdateSchema } from '@/constants/forms/student'
import { VDateInput } from 'vuetify/labs/components'
import { useForm } from 'vee-validate'
import type { Gender, Religion, Status } from '@/types/user'
import { GENDER_OPTIONS, RELIGION_OPTIONS, STATUS_OPTIONS } from '@/constants/user'

interface Props {
  data?: StudentDetail
  isLoading?: boolean
  isFetching?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  isLoading: false,
  isFetching: false,
})

const router = useRouter()
const avatarPreview = ref<string | null>(null)
const refInputEl = ref<HTMLElement>()
const selectedMajor = ref<string | null>(null)
// const selectedSession = ref<string | null>(null)

const shouldFetchStudyProgram = computed(() => !!selectedMajor.value)
// const shouldFetchSemester = computed(() => !!selectedSession.value)

const { data: dataListMajor, isLoading: isLoadingListMajor, isFetching: isFetchingListMajor } = useGetMajorAsOptions()
// const { data: sessionOptions, isLoading: isLoadingSession, isFetching: isFetchingSession } = useGetSessionAsOptions()

const {
  data: studyProgramOptions,
  isLoading: isLoadingStudyProgram,
  isFetching: isFetchingStudyProgram,
} = useGetStudyProgramAsOptions(
  computed(() => selectedMajor.value || ''),
  shouldFetchStudyProgram,
)

// const {
//   data: semesterOptions,
//   isLoading: isLoadingSemester,
//   isFetching: isFetchingSemester,
// } = useGetSemesterAsOptions(
//   computed(() => selectedSession.value || ''),
//   shouldFetchSemester,
// )

const { mutateAsync, isSuccess, isPending } = useUpdateStudent(computed(() => props.data?.id ?? ''))

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: StudentUpdateSchema,
  initialValues: {
    study_program_id: '',
    m_user_id: undefined as string | undefined,
    name: '',
    email: '',
    nim: '',
    generation: '',
    gender: '' as Gender,
    religion: '' as Religion,
    birth_place: '',
    birth_date: null as Date | null,
    tuition_fee: '',
    tuition_method: '',
    address: '',
    phone_number: '',
    nationality: '',
    status: '' as Status,
    avatar: null as File | null,
  },
})

const [study_program_id] = defineField('study_program_id')
const [nim] = defineField('nim')
const [email] = defineField('email')
const [name] = defineField('name')
const [generation] = defineField('generation')
const [gender] = defineField('gender')
const [religion] = defineField('religion')
const [birth_place] = defineField('birth_place')
const [birth_date] = defineField('birth_date')
const [tuition_fee] = defineField('tuition_fee')
const [tuition_method] = defineField('tuition_method')
const [address] = defineField('address')
const [nationality] = defineField('nationality')
const [status] = defineField('status')
const [phone_number] = defineField('phone_number')
const [avatar] = defineField('avatar')

const onSubmit = handleSubmit(async values => {
  if (!mutateAsync) return

  await mutateAsync(values)

  if (isSuccess.value) {
    resetForm()
    router.back()
  }
})

const changeAvatar = (file: Event) => {
  const fileReader = new FileReader()
  const { files } = file.target as HTMLInputElement

  if (files && files.length) {
    avatar.value = files[0]
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      avatarPreview.value = fileReader.result as string
    }
  }
}

const resetAvatar = () => {
  avatar.value = null
  avatarPreview.value = avatar1
}

const handleGoToGradeHistory = (semesterId?: string) => {
  if (!props.data?.id || !semesterId) {
    return
  }

  router.push({
    name: 'student.grade-history',
    params: {
      studentId: props.data.id,
      semesterId,
    },
  })
}

const resetFormOnUpdate = () => {
  resetForm({
    values: {
      study_program_id: props.data?.study_program_id || '',
      m_user_id: props.data?.user?.id || '',
      name: props.data?.user?.name || '',
      email: props.data?.user?.email || '',
      nim: props.data?.nim || '',
      generation: props.data?.generation || '',
      gender: props.data?.user?.gender || undefined,
      religion: props.data?.user?.religion || undefined,
      birth_place: props.data?.user?.birth_place || '',
      birth_date: null,
      tuition_fee: props.data?.tuition_fee || '',
      tuition_method: props.data?.tuition_method || '',
      address: props.data?.user?.address || '',
      nationality: props.data?.user?.nationality || '',
      phone_number: props.data?.user?.phone_number || '',
      status: props.data?.user?.status || undefined,
      avatar: null,
    },
  })
  resetAvatar()

  selectedMajor.value = props.data?.major_id || null
}

watch(
  () => props,
  () => {
    resetFormOnUpdate()
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <VRow>
    <VCol>
      <VCard title="Detail Akun">
        <VCardText class="d-flex">
          <VAvatar
            rounded="lg"
            size="100"
            class="me-6"
            :image="avatarPreview || avatar1"
          />

          <div class="d-flex flex-column justify-center gap-5">
            <div class="d-flex flex-wrap gap-2">
              <VBtn
                color="primary"
                @click="refInputEl?.click()"
              >
                <VIcon
                  icon="ri-upload-cloud-line"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Upload photo</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              />

              <VBtn
                type="reset"
                color="error"
                variant="outlined"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Reset</span>
                <VIcon
                  icon="ri-refresh-line"
                  class="d-sm-none"
                />
              </VBtn>
            </div>
          </div>
        </VCardText>

        <VDivider />
        <VCardText>
          <VForm class="mt-6">
            <VRow>
              <VCol
                md="6"
                cols="12"
              >
                <VAutocomplete
                  v-model="selectedMajor"
                  :items="dataListMajor?.data"
                  :loading="isLoadingListMajor || isFetchingListMajor"
                  item-title="label"
                  item-value="value"
                  label="Jurusan"
                  clearable
                  placeholder="Pilih jurusan"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <VAutocomplete
                  label="Program Studi"
                  :items="studyProgramOptions?.data"
                  item-title="label"
                  item-value="value"
                  clearable
                  placeholder="Pilih program studi"
                  :loading="isLoadingStudyProgram || isFetchingStudyProgram"
                  :disabled="!selectedMajor"
                  v-model="study_program_id"
                  :error-messages="errors.study_program_id"
                />
              </VCol>

              <!-- <VCol
                md="4"
                cols="12"
              >
                <VAutocomplete
                  label="Kelas / Golongan"
                  :items="CLASS_LIST"
                  item-title="name"
                  item-value="id"
                  clearable
                />
              </VCol> -->

              <!-- <VCol
                md="6"
                cols="12"
              >
                <VAutocomplete
                  label="Tahun Ajaran"
                  v-model="selectedSession"
                  :items="sessionOptions?.data"
                  item-title="label"
                  item-value="value"
                  clearable
                  :loading="isLoadingSession || isFetchingSession"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <VAutocomplete
                  label="Semester"
                  :items="semesterOptions?.data"
                  :item-title="item => `${item.semester} tahun ${item.year}`"
                  item-value="id"
                  clearable
                  :loading="isLoadingSemester || isFetchingSemester"
                  :disabled="!selectedSession"
                />
              </VCol> -->

              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  placeholder="Masukkan NIM"
                  label="NIM"
                  v-model="nim"
                  :error-messages="errors.nim"
                  :loading="isPending"
                  :disabled="isPending || isLoading || isFetching"
                  required
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="name"
                  placeholder="Masukkan nama lengkap dan gelar"
                  label="Nama Lengkap"
                  :error-messages="errors.name"
                  :loading="isLoading || isFetching"
                />
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="email"
                  placeholder="Masukkan email pegawai"
                  label="Email"
                  :error-messages="errors.email"
                  :loading="isLoading || isFetching"
                />
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="phone_number"
                  placeholder="Masukkan nomor telepon"
                  label="Nomor Telepon"
                  :error-messages="errors.phone_number"
                  :loading="isLoading || isFetching"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <VSelect
                  v-model="gender"
                  :items="GENDER_OPTIONS"
                  item-title="label"
                  item-value="value"
                  placeholder="Pilih jenis kelamin"
                  label="Jenis Kelamin"
                  :error-messages="errors.gender"
                  :loading="isLoading || isFetching"
                />
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
                <VSelect
                  v-model="religion"
                  :items="RELIGION_OPTIONS"
                  item-title="label"
                  item-value="value"
                  placeholder="Pilih agama"
                  label="Agama"
                  :error-messages="errors.religion"
                  :loading="isLoading || isFetching"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="birth_place"
                  placeholder="Masukkan tempat lahir"
                  label="Tempat Lahir"
                  :error-messages="errors.birth_place"
                  :loading="isLoading || isFetching"
                />
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
                <VDateInput
                  clearable
                  prepend-icon=""
                  v-model="birth_date"
                  placeholder="Pilih tanggal lahir"
                  label="Tanggal Lahir"
                  :error-messages="errors.birth_date"
                  :loading="isLoading || isFetching"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="address"
                  placeholder="Masukkan alamat lengkap"
                  label="Alamat"
                  :error-messages="errors.address"
                  :loading="isLoading || isFetching"
                />
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="nationality"
                  placeholder="Masukkan kewarganegaraan"
                  label="Kewarganegaraan"
                  :error-messages="errors.nationality"
                  :loading="isLoading || isFetching"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="generation"
                  placeholder="Masukkan angkatan"
                  label="Angkatan"
                  :error-messages="errors.generation"
                  :loading="isLoading || isFetching"
                  type="number"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="tuition_fee"
                  placeholder="Masukkan biaya kuliah"
                  label="Biaya Kuliah"
                  :error-messages="errors.tuition_fee"
                  :loading="isLoading || isFetching"
                  type="number"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="tuition_method"
                  placeholder="Masukkan metode pembayaran"
                  label="Metode Pembayaran"
                  :error-messages="errors.tuition_method"
                  :loading="isLoading || isFetching"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <VSelect
                  v-model="status"
                  :items="STATUS_OPTIONS"
                  item-title="label"
                  item-value="value"
                  placeholder="Pilih status"
                  label="Status"
                  :error-messages="errors.status"
                  :loading="isLoading || isFetching"
                />
              </VCol>

              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn
                  color="primary"
                  @click="onSubmit"
                  :loading="isPending"
                  :disabled="isPending || isLoading || isFetching"
                  >Simpan</VBtn
                >

                <VBtn
                  :loading="isPending"
                  :disabled="isPending || isLoading || isFetching"
                  color="secondary"
                  variant="outlined"
                  type="reset"
                  @click="resetFormOnUpdate"
                >
                  Reset
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>

      <VCard class="mt-6">
        <VCardText>
          <VBtn
            color="primary"
            class="mb-4"
            >Tambah Semester Tempuh</VBtn
          >

          <VTable>
            <thead>
              <tr>
                <th>Semester</th>
                <th>Kelas / Golongan</th>
                <th>Tahun</th>
                <th>Tahun Ajaran</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="semester in props.data?.semesters || []"
                :key="semester.id"
              >
                <td>{{ semester.semester }}</td>
                <td>{{ semester.class }}</td>
                <td>{{ semester.year }}</td>
                <td>
                  <div class="d-flex align-center gap-2">
                    <span>{{ semester.session }}</span>
                    <VBtn
                      size="small"
                      variant="tonal"
                      color="primary"
                      @click="handleGoToGradeHistory(semester.semester_id || semester.id)"
                    >
                      Lihat Nilai
                    </VBtn>
                  </div>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
