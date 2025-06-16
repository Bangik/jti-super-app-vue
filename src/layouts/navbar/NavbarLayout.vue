<script setup lang="ts">
import NavbarThemeSwitcher from './fragments/NavbarThemeSwitcher.vue'
import UserProfile from './fragments/UserProfile.vue'

defineProps<{
  toggleVerticalOverlayNavActive: (value: boolean) => void
}>()
</script>

<template>
  <div class="d-flex h-100 align-center">
    <!-- 👉 Vertical nav toggle in overlay mode -->
    <IconBtn
      class="ms-n3 d-lg-none"
      @click="toggleVerticalOverlayNavActive(true)"
    >
      <VIcon icon="ri-menu-line" />
    </IconBtn>

    <LinkBack
      v-if="
        $route.name !== 'major.index' &&
        $route.name !== 'study-program.index' &&
        $route.name !== 'class.index' &&
        $route.name !== 'session.index' &&
        $route.name !== 'semester.index' &&
        $route.name !== 'employee.index' &&
        $route.name !== 'student.index' &&
        $route.name !== 'subject.index'
      "
      class="mr-3"
    />

    <h2 class="font-weight-medium leading-normal text-xl">{{ $route.meta.title }}</h2>

    <VSpacer />

    <IconBtn
      href="https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free"
      target="_blank"
      rel="noopener noreferrer"
    >
      <VIcon icon="ri-github-fill" />
    </IconBtn>

    <IconBtn>
      <VIcon icon="ri-notification-line" />
    </IconBtn>

    <NavbarThemeSwitcher class="me-2" />

    <UserProfile />
  </div>
</template>
