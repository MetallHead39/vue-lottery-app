<script setup lang="ts">
import type { Participant } from '@/types/participant'

defineProps<{
  winner: Participant
}>()

const emit = defineEmits<{
  (e: 'remove', id: string): void
}>()
</script>

<template>
  <span class="winner-badge badge bg-primary d-inline-flex align-items-center gap-2 px-3 py-2 fs-6 rounded-pill">
    <span class="fw-medium">{{ winner.name }}</span>
    <button
      type="button"
      class="btn-close btn-close-white"
      aria-label="Remove winner"
      @click="emit('remove', winner.id)"
    ></button>
  </span>
</template>

<style scoped>
.winner-badge {
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-close {
  width: 0.65rem;
  height: 0.65rem;
  padding: 0;
  font-size: 0.75rem;
}
</style>
