<script setup lang="ts">
interface Props {
  title?: string
  subTitle?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Confirmation',
})

const open = defineModel<boolean>('open')
</script>

<template>
  <VDialog
    v-model="open"
    max-width="600"
  >
    <VCard max-width="600">
      <VCardTitle>
        <p>{{ title }}</p>
      </VCardTitle>
      <VCardText>
        <p>{{ subTitle }}</p>
      </VCardText>
      <template v-slot:actions>
        <slot />
      </template>
    </VCard>
  </VDialog>
</template>
