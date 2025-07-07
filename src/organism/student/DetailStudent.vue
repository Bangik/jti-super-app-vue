<script lang="ts" setup>
import { StudentSchema } from '@/constants/forms/student'
import { GENDER_OPTIONS, RELIGION_OPTIONS } from '@/constants/user'
import { useAddStudent, useUpdateStudent } from '@/hooks/student'
import { useGetMajorAsOptions } from '@/hooks/major'
import type { StudentDetail } from '@/types/student'
import type { Gender, Religion } from '@/types/user'
import avatar1 from '@images/avatars/avatar-1.png'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { VDateInput } from 'vuetify/labs/components'
import { CLASS_LIST } from '@/constants/student'
import { useGetStudyProgramAsOptions } from '@/hooks/study-program'
import { useGetSessionAsOptions } from '@/hooks/session'
import { useGetSemesterAsOptions } from '@/hooks/semester'

interface Props {
  type?: 'add' | 'edit'
  data?: StudentDetail
  isLoading?: boolean
  isFetching?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  data: undefined,
  isLoading: false,
  isFetching: false,
})

const router = useRouter()
const refInputEl = ref<HTMLElement>()
const avatarPreview = ref<string | null>(null)
const selectedMajor = ref<string | null>(null)
const selectedStudyProgram = ref<string | null>(null)
const selectedSession = ref<string | null>(null)
const { type } = toRefs(props)
const id = computed(() => props.data?.id ?? '')

const shouldFetchStudyProgram = computed(() => !!selectedMajor.value)
const shouldFetchSemester = computed(() => !!selectedSession.value)

const { data: dataListMajor, isLoading: isLoadingListMajor, isFetching: isFetchingListMajor } = useGetMajorAsOptions()
const { data: sessionOptions, isLoading: isLoadingSession, isFetching: isFetchingSession } = useGetSessionAsOptions()

const {
  data: studyProgramOptions,
  isLoading: isLoadingStudyProgram,
  isFetching: isFetchingStudyProgram,
} = useGetStudyProgramAsOptions(
  computed(() => selectedMajor.value || ''),
  shouldFetchStudyProgram,
)

const {
  data: semesterOptions,
  isLoading: isLoadingSemester,
  isFetching: isFetchingSemester,
} = useGetSemesterAsOptions(
  computed(() => selectedSession.value || ''),
  shouldFetchSemester,
)

const createMutation = useAddStudent()
const updateMutation = useUpdateStudent(id)
const isAddMode = computed(() => type.value === 'add')

const mutateAsync = computed(() => (isAddMode.value ? createMutation.mutateAsync : updateMutation.mutateAsync))
const isSuccess = computed(() => (isAddMode.value ? createMutation.isSuccess : updateMutation.isSuccess))
const isPending = computed(() => (isAddMode.value ? createMutation.isPending : updateMutation.isPending))

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: StudentSchema,
  initialValues: {
    semester_id: '',
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
    class: '',
    avatar: null as File | null,
  },
})

const [semester_id] = defineField('semester_id')
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
const [phone_number] = defineField('phone_number')
const [classField] = defineField('class')
const [avatar] = defineField('avatar')

const onSubmit = handleSubmit(async values => {
  if (!mutateAsync.value) return

  await mutateAsync.value(values)

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

const resetFormOnUpdate = () => {
  if (props.type === 'edit') {
    resetForm({
      values: {
        semester_id: props.data?.major?.id,
        study_program_id: props.data?.study_program?.id,
        m_user_id: props.data?.user?.id,
        name: props.data?.user?.name,
        email: props.data?.user?.email,
        nim: props.data?.nim,
        generation: props.data?.generation,
        gender: props.data?.user?.gender,
        religion: props.data?.user?.religion,
        birth_place: props.data?.user?.birth_place,
        birth_date: props.data?.user?.birth_date ? new Date(props.data.user.birth_date) : null,
        tuition_fee: props.data?.tuition_fee,
        tuition_method: props.data?.tuition_method,
        address: props.data?.user?.address,
        phone_number: props.data?.user?.phone_number,
        nationality: props.data?.user?.nationality,
        class: props.data?.class,
        avatar: null,
      },
    })
    avatarPreview.value = props.data?.user?.avatar || avatar1
  } else {
    resetForm({
      values: {
        semester_id: undefined,
        study_program_id: undefined,
        m_user_id: undefined,
        name: '',
        email: '',
        nim: '',
        generation: '',
        gender: undefined,
        religion: undefined,
        birth_place: '',
        birth_date: null,
        tuition_fee: '',
        tuition_method: '',
        address: '',
        nationality: '',
        phone_number: '',
        class: '',
        avatar: null,
      },
    })
    resetAvatar()
  }
}

watch(
  () => props,
  () => {
    resetFormOnUpdate()
  },
  { immediate: true, deep: true },
)

watch(
  () => selectedMajor.value,
  () => {
    selectedStudyProgram.value = null
  },
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
            <p class="text-body-1 mb-0">
              Format yang diizinkan: JPG, GIF, atau PNG. Ukuran maksimum 2MB
              <VAlert
                v-if="errors.avatar"
                type="error"
                variant="tonal"
              >
                {{ errors.avatar }}
              </VAlert>
            </p>
          </div>
        </VCardText>

        <VDivider />
        <VCardText>
          <VForm class="mt-6">
            <VRow>
              <VCol
                md="4"
                cols="12"
              >
                <VAutocomplete
                  v-model="selectedMajor"
                  :items="dataListMajor?.data"
                  :loading="isLoadingListMajor || isFetchingListMajor || isLoading || isFetching"
                  item-title="label"
                  item-value="value"
                  label="Jurusan"
                  clearable
                  placeholder="Pilih jurusan"
                />
              </VCol>

              <VCol
                md="4"
                cols="12"
              >
                <VAutocomplete
                  label="Program Studi"
                  :items="studyProgramOptions?.data"
                  item-title="label"
                  item-value="value"
                  clearable
                  v-model="study_program_id"
                  placeholder="Pilih program studi"
                  :loading="isLoadingStudyProgram || isFetchingStudyProgram"
                  :disabled="!selectedMajor"
                />
              </VCol>

              <VCol
                md="4"
                cols="12"
              >
                <VAutocomplete
                  label="Kelas / Golongan"
                  v-model="classField"
                  :items="CLASS_LIST"
                  item-title="name"
                  item-value="id"
                  clearable
                  :disabled="!study_program_id"
                />
              </VCol>

              <VCol
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
                  v-model="semester_id"
                  :items="semesterOptions?.data"
                  :item-title="item => `${item.semester} tahun ${item.year}`"
                  item-value="id"
                  clearable
                  :loading="isLoadingSemester || isFetchingSemester"
                  :disabled="!selectedSession"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="nim"
                  placeholder="Masukkan NIM"
                  label="NIM"
                  :error-messages="errors.nim"
                  :loading="isLoading || isFetching"
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
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn
                  color="primary"
                  @click="onSubmit"
                  :loading="isPending.value"
                  :disabled="isPending.value || isLoading || isFetching"
                  >Simpan</VBtn
                >

                <VBtn
                  :loading="isPending.value"
                  :disabled="isPending.value || isLoading || isFetching"
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
    </VCol>
  </VRow>
</template>
