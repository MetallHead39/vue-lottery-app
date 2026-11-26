<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    delay?: number
  }>(),
  {
    modelValue: '',
    placeholder: 'Search by name...',
    delay: 300,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'filter-by-name', value: string): void
}>()

const searchQuery = ref(props.modelValue)
let timer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== searchQuery.value) {
      searchQuery.value = newVal
    }
  },
)

watch(searchQuery, (newVal) => {
  emit('update:modelValue', newVal)
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    emit('filter-by-name', newVal)
  }, props.delay)
})
</script>

<template>
  <div class="search-bar">
    <div class="input-group">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control"
        :placeholder="placeholder"
        aria-label="Search by name"
      />
      <button
        v-if="searchQuery"
        class="btn btn-outline-secondary"
        type="button"
        title="Очистити"
        @click="searchQuery = ''"
      >
        ×
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  max-width: 350px;
  width: 100%;
}
</style>
