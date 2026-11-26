<script setup lang="ts">
import { computed } from 'vue'
import type { Participant } from '@/types/participant'
import BaseButton from './BaseButton.vue'
import WinnerBadge from './WinnerBadge.vue'

const props = defineProps<{
  winners: Participant[]
  participants: Participant[]
}>()

const emit = defineEmits<{
  (e: 'select-winner'): void
  (e: 'remove-winner', id: string): void
}>()

const availableCandidates = computed(() => {
  const winnerIds = new Set(props.winners.map((w) => w.id))
  return props.participants.filter((p) => !winnerIds.has(p.id))
})

const isNewWinnerDisabled = computed(() => {
  return (
    props.winners.length >= 3 ||
    props.participants.length === 0 ||
    availableCandidates.value.length === 0
  )
})
</script>

<template>
  <div class="card winners-card">
    <div class="card-body">
      <div class="d-flex align-items-center justify-content-between gap-3">
        <!-- Display box with border matching input style -->
        <div class="winners-display flex-grow-1 d-flex align-items-center gap-2 flex-wrap">
          <WinnerBadge
            v-for="winner in winners"
            :key="winner.id"
            :winner="winner"
            @remove="emit('remove-winner', $event)"
          />
          <span class="placeholder-text">Winners</span>
        </div>
        <div>
          <BaseButton
            variant="primary"
            :disabled="isNewWinnerDisabled"
            @click="emit('select-winner')"
          >
            New winner
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.winners-card .card-body {
  padding: 1.25rem 1.5rem;
}

.winners-display {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 3px;
  padding: 0.4rem 0.75rem;
  min-height: 38px;
}

.placeholder-text {
  color: #9ca3af;
  font-size: 0.875rem;
  user-select: none;
}
</style>
