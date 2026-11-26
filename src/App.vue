<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import type { Participant } from '@/types/participant'
import WinnersBlock from '@/components/WinnersBlock.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'

const STORAGE_KEY_PARTICIPANTS = 'vue-lottery-participants'
const STORAGE_KEY_WINNERS = 'vue-lottery-winners'

const participants = ref<Participant[]>([])
const winners = ref<Participant[]>([])

// Load from localStorage on mount
onMounted(() => {
  try {
    const savedParticipants = localStorage.getItem(STORAGE_KEY_PARTICIPANTS)
    if (savedParticipants) {
      participants.value = JSON.parse(savedParticipants)
    }

    const savedWinners = localStorage.getItem(STORAGE_KEY_WINNERS)
    if (savedWinners) {
      const parsedWinners: Participant[] = JSON.parse(savedWinners)
      // Keep only winners that still exist in participants
      const validParticipantsMap = new Map(participants.value.map((p) => [p.id, p]))
      winners.value = parsedWinners
        .filter((w) => validParticipantsMap.has(w.id))
        .map((w) => validParticipantsMap.get(w.id)!)
    }
  } catch (error) {
    console.error('Failed to load data from localStorage:', error)
  }
})

// Persist participants to localStorage
watch(
  participants,
  (newParticipants) => {
    try {
      localStorage.setItem(STORAGE_KEY_PARTICIPANTS, JSON.stringify(newParticipants))
    } catch (error) {
      console.error('Failed to save participants to localStorage:', error)
    }
  },
  { deep: true },
)

// Persist winners to localStorage
watch(
  winners,
  (newWinners) => {
    try {
      localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(newWinners))
    } catch (error) {
      console.error('Failed to save winners to localStorage:', error)
    }
  },
  { deep: true },
)

const existingEmails = computed(() => participants.value.map((p) => p.email))

// Add participant
function handleAddParticipant(newParticipantData: Omit<Participant, 'id'>) {
  const newParticipant: Participant = {
    ...newParticipantData,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  }
  participants.value.push(newParticipant)
}

// Update participant
function handleUpdateParticipant(updated: Participant) {
  const index = participants.value.findIndex((p) => p.id === updated.id)
  if (index !== -1) {
    participants.value[index] = { ...updated }
  }

  // Also update winner info if the participant is a winner
  const winnerIndex = winners.value.findIndex((w) => w.id === updated.id)
  if (winnerIndex !== -1) {
    winners.value[winnerIndex] = { ...updated }
  }
}

// Delete participant
function handleDeleteParticipant(id: string) {
  participants.value = participants.value.filter((p) => p.id !== id)
  // If participant was among winners - remove automatically
  winners.value = winners.value.filter((w) => w.id !== id)
}

// Select random winner
function handleSelectWinner() {
  if (winners.value.length >= 3) {
    return
  }

  const winnerIds = new Set(winners.value.map((w) => w.id))
  const candidates = participants.value.filter((p) => !winnerIds.has(p.id))

  if (candidates.length === 0) {
    return
  }

  const randomIndex = Math.floor(Math.random() * candidates.length)
  const selectedWinner = candidates[randomIndex]
  if (selectedWinner) {
    winners.value.push(selectedWinner)
  }
}

// Remove winner
function handleRemoveWinner(id: string) {
  winners.value = winners.value.filter((w) => w.id !== id)
}
</script>

<template>
  <div class="app-layout">
    <main class="app-container">
      <!-- 1. Winners Block -->
      <WinnersBlock
        :winners="winners"
        :participants="participants"
        @select-winner="handleSelectWinner"
        @remove-winner="handleRemoveWinner"
      />

      <!-- 2. Register Form -->
      <RegisterForm
        :existing-emails="existingEmails"
        @add-participant="handleAddParticipant"
      />

      <!-- 3. Participants Table -->
      <ParticipantsTable
        :participants="participants"
        @update-participant="handleUpdateParticipant"
        @delete-participant="handleDeleteParticipant"
      />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2.5rem 1rem;
}

.app-container {
  width: 100%;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
