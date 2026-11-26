<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline-primary' | 'outline-danger' | 'outline-secondary'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    :class="['custom-btn', `btn-${variant}`]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.custom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.45rem 1.15rem;
  border-radius: 3px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  line-height: 1.4;
}

.custom-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #00a8e8;
  border-color: #00a8e8;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0093cc;
  border-color: #0093cc;
}

.btn-secondary {
  background-color: #6b7280;
  border-color: #6b7280;
  color: #ffffff;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
  border-color: #4b5563;
}

.btn-danger {
  background-color: #e74c3c;
  border-color: #e74c3c;
  color: #ffffff;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c0392b;
  border-color: #c0392b;
}

.btn-outline-primary {
  background-color: transparent;
  border-color: #00a8e8;
  color: #00a8e8;
}

.btn-outline-primary:hover:not(:disabled) {
  background-color: #00a8e8;
  color: #ffffff;
}

.btn-outline-danger {
  background-color: transparent;
  border-color: #e74c3c;
  color: #e74c3c;
}

.btn-outline-danger:hover:not(:disabled) {
  background-color: #e74c3c;
  color: #ffffff;
}

.btn-outline-secondary {
  background-color: transparent;
  border-color: #d1d5db;
  color: #4b5563;
}

.btn-outline-secondary:hover:not(:disabled) {
  background-color: #e5e7eb;
}
</style>
