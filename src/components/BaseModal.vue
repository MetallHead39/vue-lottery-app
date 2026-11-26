<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

defineProps<{
  show: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="show"
        class="modal d-block modal-backdrop-custom"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        @click.self="emit('close')"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <slot name="header">
                <h5 class="modal-title">{{ title }}</h5>
              </slot>
              <button
                type="button"
                class="btn-close"
                aria-label="Close"
                @click="emit('close')"
              ></button>
            </div>
            <div class="modal-body">
              <slot />
            </div>
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop-custom {
  background-color: rgba(0, 0, 0, 0.45);
  overflow-y: auto;
}

.modal-content {
  border-radius: 3px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.modal-header {
  border-bottom: 1px solid #f3f4f6;
  padding: 1rem 1.25rem;
}

.modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}

.modal-body {
  padding: 1.25rem;
}

.modal-footer {
  border-top: 1px solid #f3f4f6;
  padding: 0.75rem 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-dialog,
.modal-fade-leave-active .modal-dialog {
  transition: transform 0.2s ease;
}

.modal-fade-enter-from .modal-dialog,
.modal-fade-leave-to .modal-dialog {
  transform: translateY(-15px);
}
</style>
