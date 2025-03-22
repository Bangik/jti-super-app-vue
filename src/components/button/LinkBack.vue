<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  to?: string
  noRedirect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  noRedirect: false,
})
const router = useRouter()

defineEmits(['update:click'])

const handleClick = () => {
  if (props.to) {
    console.log('routerback')
    return
  }

  if (router.options.history.state.back !== null) {
    router.back()
  }
}
</script>

<template>
  <VBtn
    @click="noRedirect ? $emit('update:click') : handleClick()"
    variant="tonal"
    color="primary"
    prepend-icon="ri-arrow-left-s-line"
    size="x-small"
  >
    Kembali
  </VBtn>
</template>
