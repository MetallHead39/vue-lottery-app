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
  <div class="card table-card">
    <div class="card-body">
      <!-- Search & Controls row -->
      <div class="d-flex flex-column flex-sm-row justify-content-end align-items-sm-center mb-3">
        <SearchBar @filter-by-name="handleFilterByName" />
      </div>

      <div class="table-container">
        <table class="participants-table">
          <thead>
            <tr>
              <th class="col-num">#</th>
              <th class="col-sortable user-select-none" @click="toggleSort('name')">
                <div class="th-content">
                  <span>Name</span>
                  <span v-if="sortField === 'name'" class="sort-icon active">
                    <span v-if="sortOrder === 'asc'">▲</span>
                    <span v-else>▼</span>
                  </span>
                  <span v-else class="sort-icon">⇅</span>
                </div>
              </th>
              <th class="col-sortable user-select-none" @click="toggleSort('dob')">
                <div class="th-content">
                  <span>Date of Birth</span>
                  <span v-if="sortField === 'dob'" class="sort-icon active">
                    <span v-if="sortOrder === 'asc'">▲</span>
                    <span v-else>▼</span>
                  </span>
                  <span v-else class="sort-icon">⇅</span>
                </div>
              </th>
              <th>Email</th>
              <th>Phone number</th>
              <th class="col-actions text-end"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="processedParticipants.length === 0">
              <td colspan="6" class="empty-state text-center">
                {{ participants.length === 0 ? 'Список учасників порожній.' : 'Учасників за даним запитом не знайдено.' }}
              </td>
            </tr>
            <tr v-for="(participant, index) in processedParticipants" :key="participant.id">
              <td class="col-num">{{ index + 1 }}</td>
              <td class="col-name">{{ participant.name }}</td>
              <td>{{ participant.dob }}</td>
              <td>{{ participant.email }}</td>
              <td>{{ participant.phone }}</td>
              <td class="col-actions text-end">
                <div class="actions-group">
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
          placeholder="Enter user name"
          required
          :error-message="getEditErrorMessage('name')"
          :is-valid="getEditIsValid('name')"
          @blur="editTouched.name = true"
        />

        <BaseInput
          v-model="editForm.dob"
          type="date"
          label="Date of Birth"
          placeholder="mm/dd/yyyy"
          required
          :error-message="getEditErrorMessage('dob')"
          :is-valid="getEditIsValid('dob')"
          @blur="editTouched.dob = true"
        />

        <BaseInput
          v-model="editForm.email"
          type="email"
          label="Email"
          placeholder="Enter email"
          required
          :error-message="getEditErrorMessage('email')"
          :is-valid="getEditIsValid('email')"
          @blur="editTouched.email = true"
        />

        <BaseInput
          v-model="editForm.phone"
          type="tel"
          label="Phone number"
          placeholder="Enter Phone number"
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
      <p class="mb-0 text-dark">
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
.table-card .card-body {
  padding: 1.25rem 1.5rem;
}

.table-container {
  overflow-x: auto;
}

.participants-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.participants-table th {
  padding: 0.75rem 0.6rem;
  color: #1f2937;
  font-weight: 700;
  border-bottom: 1px solid #f3f4f6;
  text-align: left;
  white-space: nowrap;
}

.participants-table td {
  padding: 0.75rem 0.6rem;
  color: #4b5563;
  border-bottom: 1px solid #f9fafb;
  vertical-align: middle;
}

.participants-table tr:hover td {
  background-color: #fafbfc;
}

.col-num {
  width: 40px;
  color: #9ca3af;
  font-weight: 500;
}

.col-name {
  color: #1f2937;
  font-weight: 500;
}

.col-sortable {
  cursor: pointer;
}

.th-content {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.sort-icon {
  font-size: 0.75rem;
  color: #9ca3af;
}

.sort-icon.active {
  color: #00a8e8;
  font-weight: bold;
}

.col-actions {
  min-width: 200px;
}

.actions-group {
  display: inline-flex;
  gap: 0.4rem;
  justify-content: flex-end;
}

.actions-group :deep(.custom-btn) {
  padding: 0.25rem 0.6rem;
  font-size: 0.775rem;
}

.empty-state {
  padding: 2rem 0;
  color: #9ca3af;
  font-style: italic;
}
</style>
