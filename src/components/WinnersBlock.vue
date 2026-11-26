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
  <div class="card mb-4">
    <div class="card-body">
      <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div class="d-flex flex-wrap align-items-center gap-2 flex-grow-1">
          <span v-if="winners.length === 0" class="text-muted fst-italic">
            Winners
          </span>
          <WinnerBadge
            v-for="winner in winners"
            :key="winner.id"
            :winner="winner"
            @remove="emit('remove-winner', $event)"
          />
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
