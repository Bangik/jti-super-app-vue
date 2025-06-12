<script lang="ts" setup>
import { POSITION } from '@/constants/employee'
import { useAddEmployee, useUpdateEmployee } from '@/hooks/employee'
import { useGetMajorAsOptions } from '@/hooks/major'
import avatar1 from '@images/avatars/avatar-1.png'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

interface Props {
  type?: 'add' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
})

const refInputEl = ref<HTMLElement>()
const avatarPreview = ref<string | null>(null)
const router = useRouter()
const { data: dataListMajor, isLoading, isFetching } = useGetMajorAsOptions()

const createMutation = useAddEmployee()
const updateMutation = useUpdateEmployee(ref(''))
const isAddMode = computed(() => props.type === 'add')

const mutateAsync = computed(() => (isAddMode.value ? createMutation.mutateAsync : updateMutation.mutateAsync))
const isSuccess = computed(() => (isAddMode.value ? createMutation.isSuccess : updateMutation.isSuccess))
const isPending = computed(() => (isAddMode.value ? createMutation.isPending : updateMutation.isPending))

const { errors, defineField, handleSubmit, resetForm } = useForm({
  initialValues: {
    m_major_id: '',
    nip: '',
    name: '',
    email: '',
    position: '',
    avatar: null as File | null,
  },
})

const [m_major_id] = defineField('m_major_id')
const [nip] = defineField('nip')
const [name] = defineField('name')
const [email] = defineField('email')
const [position] = defineField('position')
const [avatar] = defineField('avatar')

const onSubmit = handleSubmit(async values => {
  if (!mutateAsync.value) return

  const formData = new FormData()
  formData.append('m_major_id', values.m_major_id)
  formData.append('nip', values.nip)
  formData.append('name', values.name)
  formData.append('email', values.email)
  formData.append('position', values.position)
  if (values.avatar) {
    formData.append('avatar', values.avatar)
  }

  await mutateAsync.value(values)

  if (isSuccess.value) {
    resetForm()
    router.back()
  }
})

// changeAvatar function
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

// reset avatar image
const resetAvatar = () => {
  avatar.value = null
  avatarPreview.value = avatar1
}

const resetFormOnUpdate = () => {
  resetForm({
    values: {
      m_major_id: undefined,
      nip: '',
      name: '',
      email: '',
      position: undefined,
      avatar: null,
    },
  })
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

            <p class="text-body-1 mb-0">Format yang diizinkan: JPG, GIF, atau PNG. Ukuran maksimum 2MB</p>
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
                  v-model="m_major_id"
                  :items="dataListMajor?.data"
                  :loading="isLoading || isFetching"
                  item-title="label"
                  item-value="value"
                  label="Jurusan"
                  clearable
                  placeholder="Pilih jurusan pegawai"
                  :error-messages="errors.m_major_id"
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
                />
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="nip"
                  placeholder="Masukkan NIP / NIK"
                  label="NIP / NIK"
                  :error-messages="errors.nip"
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
                />
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
                <VSelect
                  v-model="position"
                  :items="POSITION"
                  placeholder="Jabatan pegawai"
                  label="Jabatan"
                  :error-messages="errors.position"
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
                  :disabled="isPending.value"
                  >Simpan</VBtn
                >

                <VBtn
                  :loading="isPending.value"
                  :disabled="isPending.value"
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
