<script setup lang="ts">
import { useTheme } from 'vuetify'
import { ResetPasswordSchema } from '@/constants/forms/auth'
import type { ResetPasswordValues } from '@/constants/forms/auth'
import { useForm } from 'vee-validate'

import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { useResetPassword } from '@/services/auth'
import { useToast } from 'vue-toastification'
import { useRouter, RouterLink } from 'vue-router'

const vuetifyTheme = useTheme()
const toast = useToast()
const router = useRouter()
const isPasswordVisible = ref(false)

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})

const { errors, defineField, handleSubmit, isSubmitting } = useForm({
  validationSchema: ResetPasswordSchema,
})

const [email] = defineField('email')
const [password] = defineField('password')
const [password_confirmation] = defineField('password_confirmation')

const onSubmit = handleSubmit(async values => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  if (!token) {
    toast.error('Invalid or missing token. Please try again.')
    return
  }
  values.token = token
  const response = await useResetPassword(values as ResetPasswordValues)
  router.push({ name: 'login' })
  if (response.message) {
    toast.success(response.message)
  } else {
    toast.error('Failed to send reset password email. Please try again.')
  }
})
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <RouterLink
          to="/"
          class="d-flex align-center gap-3"
        >
          <h2 class="font-weight-medium text-2xl text-uppercase">JTI SUPER APP</h2>
        </RouterLink>
      </VCardItem>

      <VCardText class="pt-2">
        <h4 class="text-h4 mb-1">Reset password JTI SUPER APP!</h4>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="onSubmit">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="email"
                label="Email"
                type="email"
                :error-messages="errors.email"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="password"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                :error-messages="errors.password"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="password_confirmation"
                label="Confirm Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="password"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                :error-messages="errors.password_confirmation"
              />

              <VBtn
                class="mt-4"
                :loading="isSubmitting ? 'white' : false"
                block
                type="submit"
                text="Send Reset Password Email"
              />

              <VSpacer />

              <div class="d-flex align-center justify-space-between flex-wrap my-6">
                <RouterLink
                  class="text-primary"
                  to="/login"
                >
                  Back to Login
                </RouterLink>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    />

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
</template>

<style lang="scss">
@use '@core/scss/template/pages/page-auth';
</style>
