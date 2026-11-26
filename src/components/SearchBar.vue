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
    <div class="search-input-container">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        :placeholder="placeholder"
        aria-label="Search by name"
      />
      <button
        v-if="searchQuery"
        class="clear-btn"
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
  max-width: 260px;
  width: 100%;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  height: 32px;
  padding: 0.25rem 1.75rem 0.25rem 0.65rem;
  font-size: 0.8rem;
  color: #1f2937;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 3px;
  outline: none;
  transition: border-color 0.15s ease;
}

.search-input:focus {
  border-color: #00a8e8;
}

.clear-btn {
  position: absolute;
  right: 0.5rem;
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.clear-btn:hover {
  color: #4b5563;
}
</style>
