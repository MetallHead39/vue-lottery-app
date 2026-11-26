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
  <span class="winner-badge">
    <span class="winner-name">{{ winner.name }}</span>
    <button
      type="button"
      class="remove-btn"
      aria-label="Remove winner"
      @click="emit('remove', winner.id)"
    >
      ×
    </button>
  </span>
</template>

<style scoped>
.winner-badge {
  display: inline-flex;
  align-items: center;
  background-color: #00a8e8;
  color: #ffffff;
  border-radius: 3px;
  padding: 0.15rem 0.45rem;
  font-size: 0.8rem;
  font-weight: 500;
  gap: 0.35rem;
  line-height: 1.2;
}

.winner-name {
  white-space: nowrap;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 0;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
}

.remove-btn:hover {
  opacity: 1;
}
</style>
