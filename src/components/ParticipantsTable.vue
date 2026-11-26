<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { Participant } from '@/types/participant'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import SearchBar from './SearchBar.vue'

const props = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  (e: 'update-participant', updated: Participant): void
  (e: 'delete-participant', id: string): void
}>()

// Search and filter state
const searchQuery = ref('')
function handleFilterByName(query: string) {
  searchQuery.value = query
}

// Sorting state
type SortField = 'name' | 'dob' | null
type SortOrder = 'asc' | 'desc'
const sortField = ref<SortField>(null)
const sortOrder = ref<SortOrder>('asc')

function toggleSort(field: 'name' | 'dob') {
  if (sortField.value === field) {
    if (sortOrder.value === 'asc') {
      sortOrder.value = 'desc'
    } else {
      // Toggle back to asc or cycle
      sortField.value = null
      sortOrder.value = 'asc'
    }
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

// Filtered and Sorted participants (immutable)
const processedParticipants = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  let result = [...props.participants]

  // Filter by name
  if (query) {
    result = result.filter((p) => p.name.toLowerCase().includes(query))
  }

  // Sort
  if (sortField.value) {
    const field = sortField.value
    const order = sortOrder.value === 'asc' ? 1 : -1

    result.sort((a, b) => {
      if (field === 'name') {
        return a.name.localeCompare(b.name) * order
      }
      if (field === 'dob') {
        return (new Date(a.dob).getTime() - new Date(b.dob).getTime()) * order
      }
      return 0
    })
  }

  return result
})

// Delete modal state
const isDeleteModalOpen = ref(false)
const participantToDelete = ref<Participant | null>(null)

function openDeleteModal(participant: Participant) {
  participantToDelete.value = participant
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  participantToDelete.value = null
}

function confirmDelete() {
  if (participantToDelete.value) {
    emit('delete-participant', participantToDelete.value.id)
  }
  closeDeleteModal()
}

// Edit modal state
const isEditModalOpen = ref(false)
const editParticipantId = ref<string>('')
const editForm = reactive({
  name: '',
  dob: '',
  email: '',
  phone: '',
})
const editTouched = reactive({
  name: false,
  dob: false,
  email: false,
  phone: false,
})
const isEditSubmitted = ref(false)

const PHONE_REGEX = /^\+380\d{9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function openEditModal(participant: Participant) {
  editParticipantId.value = participant.id
  editForm.name = participant.name
  editForm.dob = participant.dob
  editForm.email = participant.email
  editForm.phone = participant.phone

  editTouched.name = false
  editTouched.dob = false
  editTouched.email = false
  editTouched.phone = false
  isEditSubmitted.value = false

  isEditModalOpen.value = true
}

function closeEditModal() {
  isEditModalOpen.value = false
  editParticipantId.value = ''
}

const editErrors = computed(() => {
  const errs = {
    name: '',
    dob: '',
    email: '',
    phone: '',
  }

  // Name
  if (!editForm.name.trim()) {
    errs.name = 'This value is required.'
  }

  // DOB
  if (!editForm.dob) {
    errs.dob = 'This value is required.'
  } else {
    const selectedDate = new Date(editForm.dob)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate > today) {
      errs.dob = 'Date of birth cannot be in the future.'
    }
  }

  // Email
  if (!editForm.email.trim()) {
    errs.email = 'This value is required.'
  } else if (!EMAIL_REGEX.test(editForm.email.trim())) {
    errs.email = 'Please enter a valid email address.'
  } else {
    const normalizedEmail = editForm.email.trim().toLowerCase()
    // Duplicate check, excluding current participant
    const isDuplicate = props.participants.some(
      (p) => p.id !== editParticipantId.value && p.email.trim().toLowerCase() === normalizedEmail,
    )
    if (isDuplicate) {
      errs.email = 'This email is already registered.'
    }
  }

  // Phone
  if (!editForm.phone.trim()) {
    errs.phone = 'This value is required.'
  } else if (!PHONE_REGEX.test(editForm.phone.trim())) {
    errs.phone = 'Phone number must match format +380XXXXXXXXX.'
  }

  return errs
})

const isEditFormValid = computed(() => {
  return (
    !editErrors.value.name &&
    !editErrors.value.dob &&
    !editErrors.value.email &&
    !editErrors.value.phone
  )
})

function getEditErrorMessage(field: keyof typeof editForm): string {
  if (editTouched[field] || isEditSubmitted.value) {
    return editErrors.value[field]
  }
  return ''
}

function getEditIsValid(field: keyof typeof editForm): boolean {
  if ((editTouched[field] || isEditSubmitted.value) && !editErrors.value[field]) {
    return true
  }
  return false
}

function handleUpdateSubmit() {
  isEditSubmitted.value = true
  editTouched.name = true
  editTouched.dob = true
  editTouched.email = true
  editTouched.phone = true

  if (!isEditFormValid.value) {
    return
  }

  emit('update-participant', {
    id: editParticipantId.value,
    name: editForm.name.trim(),
    dob: editForm.dob,
    email: editForm.email.trim(),
    phone: editForm.phone.trim(),
  })

  closeEditModal()
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
        <h2 class="h5 card-title fw-bold mb-0">Учасники лотереї</h2>
        <SearchBar @filter-by-name="handleFilterByName" />
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" style="width: 50px">#</th>
              <th scope="col" class="cursor-pointer user-select-none" @click="toggleSort('name')">
                <div class="d-inline-flex align-items-center gap-1">
                  <span>Name</span>
                  <span v-if="sortField === 'name'" class="text-primary">
                    <span v-if="sortOrder === 'asc'">▲</span>
                    <span v-else>▼</span>
                  </span>
                  <span v-else class="text-muted opacity-50">⇅</span>
                </div>
              </th>
              <th scope="col" class="cursor-pointer user-select-none" @click="toggleSort('dob')">
                <div class="d-inline-flex align-items-center gap-1">
                  <span>Date of Birth</span>
                  <span v-if="sortField === 'dob'" class="text-primary">
                    <span v-if="sortOrder === 'asc'">▲</span>
                    <span v-else>▼</span>
                  </span>
                  <span v-else class="text-muted opacity-50">⇅</span>
                </div>
              </th>
              <th scope="col">Email</th>
              <th scope="col">Phone number</th>
              <th scope="col" class="text-end" style="min-width: 220px">Дії</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="processedParticipants.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">
                {{ participants.length === 0 ? 'Список учасників порожній.' : 'Учасників за даним запитом не знайдено.' }}
              </td>
            </tr>
            <tr v-for="(participant, index) in processedParticipants" :key="participant.id">
              <th scope="row">{{ index + 1 }}</th>
              <td class="fw-medium">{{ participant.name }}</td>
              <td>{{ participant.dob }}</td>
              <td>{{ participant.email }}</td>
              <td>{{ participant.phone }}</td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <BaseButton
                    variant="outline-primary"
                    title="Редагувати дані"
                    @click="openEditModal(participant)"
                  >
                    Редагувати дані
                  </BaseButton>
                  <BaseButton
                    variant="outline-danger"
                    title="Видалити учасника"
                    @click="openDeleteModal(participant)"
                  >
                    Видалити учасника
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Participant Modal -->
    <BaseModal :show="isEditModalOpen" title="Редагувати учасника" @close="closeEditModal">
      <form id="edit-form" @submit.prevent="handleUpdateSubmit" @keydown.enter.prevent="handleUpdateSubmit">
        <BaseInput
          v-model="editForm.name"
          label="Name"
          required
          :error-message="getEditErrorMessage('name')"
          :is-valid="getEditIsValid('name')"
          @blur="editTouched.name = true"
        />

        <BaseInput
          v-model="editForm.dob"
          type="date"
          label="Date of Birth"
          required
          :error-message="getEditErrorMessage('dob')"
          :is-valid="getEditIsValid('dob')"
          @blur="editTouched.dob = true"
        />

        <BaseInput
          v-model="editForm.email"
          type="email"
          label="Email"
          required
          :error-message="getEditErrorMessage('email')"
          :is-valid="getEditIsValid('email')"
          @blur="editTouched.email = true"
        />

        <BaseInput
          v-model="editForm.phone"
          type="tel"
          label="Phone number"
          required
          :error-message="getEditErrorMessage('phone')"
          :is-valid="getEditIsValid('phone')"
          @blur="editTouched.phone = true"
        />
      </form>

      <template #footer>
        <BaseButton variant="secondary" @click="closeEditModal">
          Скасувати
        </BaseButton>
        <BaseButton variant="primary" type="submit" form="edit-form" @click="handleUpdateSubmit">
          Оновити дані
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal :show="isDeleteModalOpen" title="Підтвердження видалення" @close="closeDeleteModal">
      <p class="mb-0">
        Ви дійсно бажаєте видалити учасника "{{ participantToDelete?.name }}", "{{ participantToDelete?.email }}"?
      </p>
      <template #footer>
        <BaseButton variant="secondary" @click="closeDeleteModal">
          Ні
        </BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">
          Так
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
