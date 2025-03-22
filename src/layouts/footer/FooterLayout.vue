<template>
  <div class="h-100 d-flex align-center justify-md-space-between justify-center">
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      Made With
      <VIcon
        icon="ri-heart-line"
        color="error"
        size="1.25rem"
        class="mx-1"
      />
      By
      <a
        href="https://bangik.github.io"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary ms-1"
        >Bangik</a
      >
    </span>
  </div>
</template>
