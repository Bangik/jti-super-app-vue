<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

onMounted(() => {
  const token = route.query.token
  const user = route.query.user
  const error = route.query.error

  if (token && user) {
    let parsedUser = null
    try {
      const decodedUser = atob(String(user))
      parsedUser = JSON.parse(decodedUser)
    } catch (e) {
      console.log(e)
      toast.error('Failed to login with google')
    }

    authStore.setUserAccess({ token: String(token), user: parsedUser })
    router.push({ name: 'dashboard.index' })
  } else if (error) {
    toast.error(atob(String(error)))
    router.push({ name: 'login' })
  } else {
    toast.error('Failed to login with google')
    router.push({ name: 'login' })
  }
})
</script>

<template>
  <VContainer
    class="fill-height d-flex align-center justify-center"
    fluid
  >
    <VRow
      align="center"
      justify="center"
      class="w-100"
    >
      <VCol
        cols="auto"
        class="d-flex flex-column align-center"
      >
        <VProgressCircular
          indeterminate
          color="primary"
          size="64"
        ></VProgressCircular>
        <div class="mt-4 text-center">Logging you in...</div>
      </VCol>
    </VRow>
  </VContainer>
</template>
