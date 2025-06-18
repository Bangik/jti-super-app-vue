<script setup lang="ts">
interface Item {
  label: string
  value: string
}

const props = defineProps({
  items: {
    type: Array as PropType<Item[]>,
    required: true,
  },

  modelValue: {
    type: Array as PropType<Item[]>,
    required: true,
  },

  loading: {
    type: Boolean,
    default: false,
  },

  label: {
    type: String,
    default: 'Pilih Item',
  },

  selectedLabel: {
    type: String,
    default: 'Item Terpilih',
  },

  disableAddTo: {
    type: Boolean,
    default: false,
  },

  disableRemoveFrom: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Item[]): void
}>()

const searchAvailable = ref('')
const searchSelected = ref('')

const availableItems = computed(() =>
  props.items.filter(item => !props.modelValue.some(selected => selected.value === item.value)),
)

const filteredAvailable = computed(() =>
  availableItems.value.filter(item => item.label.toLowerCase().includes(searchAvailable.value.toLowerCase())),
)

const filteredSelected = computed(() =>
  props.modelValue.filter(item => item.label.toLowerCase().includes(searchSelected.value.toLowerCase())),
)

function addToSelected(items: Item[]) {
  const newSelected = [
    ...props.modelValue,
    ...items.filter(item => !props.modelValue.some(s => s.value === item.value)),
  ]
  emit('update:modelValue', newSelected)
}

function removeFromSelected(items: Item[]) {
  const newSelected = props.modelValue.filter(item => !items.some(i => i.value === item.value))
  emit('update:modelValue', newSelected)
}
</script>

<template>
  <VRow>
    <VCol cols="6">
      <VCardTitle class="text-sm-subtitle-1">{{ props.label }}</VCardTitle>
      <VTextField
        class="mt-2"
        label="Filter"
        density="compact"
        hide-details
        clearable
        v-model="searchAvailable"
        :loading="loading"
      />
      <VBtn
        class="mt-2 rounded-b-0"
        color="primary"
        variant="tonal"
        block
        @click="addToSelected(filteredAvailable.length ? filteredAvailable : availableItems)"
        :loading="loading"
        :disabled="disableAddTo"
      >
        <VIcon icon="ri-arrow-right-line" />
      </VBtn>
      <VList
        class="border border-solid border-gray-300 rounded border-t-0 rounded-t-0"
        max-height="300px"
        height="300px"
      >
        <template v-if="loading">
          <VSkeletonLoader
            v-for="n in 6"
            :key="n"
            type="list-item"
          />
        </template>
        <template v-else>
          <VListItem
            v-if="!filteredAvailable.length"
            title="No items available"
            disabled
          />
          <VListItem
            v-for="item in filteredAvailable"
            :key="item.value"
            :title="item.label"
            @click="addToSelected([item])"
          />
        </template>
      </VList>
    </VCol>
    <VCol cols="6">
      <VCardTitle class="text-sm-subtitle-1">{{ props.selectedLabel }}</VCardTitle>
      <VTextField
        class="mt-2"
        label="Filter"
        density="compact"
        hide-details
        clearable
        v-model="searchSelected"
        :loading="loading"
      />
      <VBtn
        class="mt-2 rounded-b-0"
        color="primary"
        variant="tonal"
        block
        @click="removeFromSelected(filteredSelected.length ? filteredSelected : props.modelValue)"
        :loading="loading"
        :disabled="disableRemoveFrom"
      >
        <VIcon icon="ri-arrow-left-line" />
      </VBtn>
      <VList
        class="border border-solid border-gray-300 rounded border-t-0 rounded-t-0"
        max-height="300px"
        height="300px"
      >
        <template v-if="loading">
          <VSkeletonLoader
            v-for="n in 6"
            :key="n"
            type="list-item"
          />
        </template>
        <template v-else>
          <VListItem
            v-if="!filteredSelected.length"
            title="No items selected"
            disabled
          />
          <VListItem
            v-for="item in filteredSelected"
            :key="item.value"
            :title="item.label"
            @click="removeFromSelected([item])"
          />
        </template>
      </VList>
    </VCol>
  </VRow>
</template>
