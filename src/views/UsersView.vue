<template>
  <div class="users-view">
    <!-- Lottery Winners Block at the top -->
    <div class="mb-4">
      <div class="card p-3 shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div class="d-flex align-items-center gap-2 flex-grow-1 flex-wrap p-2 border rounded bg-white" style="min-height: 44px;">
              <span v-if="winners.length === 0" class="text-muted small">
                Переможців ще не обрано (макс. 3)
              </span>
              <div
                v-for="winner in winners"
                :key="winner.id"
                class="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-2 px-3 py-2 fs-6 rounded-pill"
              >
                <span>🏆 {{ winner.firstName }} {{ winner.lastName }} (#{{ winner.id }})</span>
                <button
                  type="button"
                  class="btn-close btn-close-sm"
                  style="font-size: 0.65rem;"
                  aria-label="Remove"
                  @click="removeWinner(winner.id)"
                ></button>
              </div>
            </div>

            <div class="d-flex gap-2">
              <button
                type="button"
                class="btn btn-primary"
                :disabled="isNewWinnerDisabled"
                @click="pickNewWinner"
              >
                🎲 New winner
              </button>
              <button
                v-if="winners.length > 0"
                type="button"
                class="btn btn-outline-secondary"
                @click="resetWinners"
              >
                Скинути
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Users Management Section -->
    <div class="card p-4 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h3 class="fw-bold mb-1">Користувачі</h3>
            <p class="text-muted small mb-0">
              Всього знайдено: {{ usersStore.total }} користувачів
            </p>
          </div>
          <div>
            <button
              type="button"
              class="btn btn-success"
              @click="isCreateModalOpen = true"
            >
              + Додати користувача
            </button>
          </div>
        </div>

        <!-- Search Bar with debounced sync to route -->
        <div class="row mb-4">
          <div class="col-md-6 col-lg-5">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0">🔍</span>
              <input
                v-model="searchInput"
                type="search"
                class="form-control border-start-0"
                placeholder="Пошук користувачів (ім'я, email, username)..."
                @keyup.enter="handleSearchSubmit"
              />
              <button
                v-if="searchInput"
                type="button"
                class="btn btn-outline-secondary"
                @click="clearSearch"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="usersStore.error" class="alert alert-danger" role="alert">
          {{ usersStore.error }}
        </div>

        <!-- Loading spinner -->
        <div v-if="usersStore.isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Завантаження...</span>
          </div>
          <p class="mt-2 text-muted small">Завантаження користувачів...</p>
        </div>

        <!-- Users Table -->
        <div v-else-if="usersStore.users.length > 0" class="table-responsive">
          <table class="table table-hover align-middle border">
            <thead class="table-light">
              <tr>
                <th scope="col" style="width: 60px;">ID</th>
                <th scope="col">Користувач</th>
                <th scope="col">Email</th>
                <th scope="col">Телефон</th>
                <th scope="col">Вік</th>
                <th scope="col">Стать</th>
                <th scope="col" class="text-end" style="width: 220px;">Дії</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in usersStore.users" :key="user.id">
                <td class="fw-bold text-muted">{{ user.id }}</td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <img
                      :src="user.image || 'https://dummyjson.com/icon/user/32'"
                      :alt="user.username"
                      class="rounded-circle border"
                      style="width: 34px; height: 34px; object-fit: cover;"
                    />
                    <div>
                      <div class="fw-bold">{{ user.firstName }} {{ user.lastName }}</div>
                      <div class="text-muted small">@{{ user.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="text-break">{{ user.email }}</td>
                <td>{{ user.phone || '—' }}</td>
                <td>{{ user.age }}</td>
                <td>
                  <span
                    class="badge"
                    :class="user.gender === 'female' ? 'bg-info' : 'bg-primary'"
                  >
                    {{ user.gender }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm">
                    <RouterLink
                      :to="`/users/${user.id}`"
                      class="btn btn-outline-primary"
                      title="Переглянути профіль"
                    >
                      Перегляд
                    </RouterLink>
                    <RouterLink
                      :to="`/users/${user.id}/edit`"
                      class="btn btn-outline-secondary"
                      title="Редагувати"
                    >
                      Редагувати
                    </RouterLink>
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      title="Видалити"
                      @click="confirmDeleteUser(user)"
                    >
                      Видалити
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-5 text-muted">
          <p class="fs-5 mb-2">Користувачів не знайдено</p>
          <p class="small">Спробуйте змінити пошуковий запит або створіть нового користувача</p>
        </div>

        <!-- Pagination Controls -->
        <div
          v-if="totalPages > 1"
          class="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-4 pt-3 border-top"
        >
          <div class="text-muted small">
            Сторінка {{ currentPage }} з {{ totalPages }} (показано {{ usersStore.users.length }} із {{ usersStore.total }})
          </div>
          <nav aria-label="Пагінація користувачів">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: currentPage <= 1 }">
                <button
                  type="button"
                  class="page-link"
                  @click="goToPage(currentPage - 1)"
                >
                  « Попередня
                </button>
              </li>

              <li
                v-for="p in visiblePages"
                :key="p"
                class="page-item"
                :class="{ active: p === currentPage }"
              >
                <button
                  type="button"
                  class="page-link"
                  @click="goToPage(p)"
                >
                  {{ p }}
                </button>
              </li>

              <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
                <button
                  type="button"
                  class="page-link"
                  @click="goToPage(currentPage + 1)"
                >
                  Наступна »
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Create User Modal -->
    <BaseModal
      :show="isCreateModalOpen"
      title="Створення нового користувача"
      @close="isCreateModalOpen = false"
    >
      <form id="createUserForm" @submit="onCreateSubmit">
        <div v-if="createError" class="alert alert-danger py-2 px-3 small mb-3">
          {{ createError }}
        </div>

        <div class="row g-2">
          <div class="col-md-6">
            <label for="createFirstName" class="form-label fw-bold small">Ім'я *</label>
            <input
              id="createFirstName"
              v-model="createFirstName"
              v-bind="createFirstNameAttrs"
              type="text"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': createErrors.firstName }"
            />
            <div v-if="createErrors.firstName" class="invalid-feedback">
              {{ createErrors.firstName }}
            </div>
          </div>

          <div class="col-md-6">
            <label for="createLastName" class="form-label fw-bold small">Прізвище *</label>
            <input
              id="createLastName"
              v-model="createLastName"
              v-bind="createLastNameAttrs"
              type="text"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': createErrors.lastName }"
            />
            <div v-if="createErrors.lastName" class="invalid-feedback">
              {{ createErrors.lastName }}
            </div>
          </div>

          <div class="col-md-6">
            <label for="createEmail" class="form-label fw-bold small">Email *</label>
            <input
              id="createEmail"
              v-model="createEmail"
              v-bind="createEmailAttrs"
              type="email"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': createErrors.email }"
            />
            <div v-if="createErrors.email" class="invalid-feedback">
              {{ createErrors.email }}
            </div>
          </div>

          <div class="col-md-6">
            <label for="createUsername" class="form-label fw-bold small">Username *</label>
            <input
              id="createUsername"
              v-model="createUsername"
              v-bind="createUsernameAttrs"
              type="text"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': createErrors.username }"
            />
            <div v-if="createErrors.username" class="invalid-feedback">
              {{ createErrors.username }}
            </div>
          </div>

          <div class="col-md-6">
            <label for="createPassword" class="form-label fw-bold small">Пароль *</label>
            <input
              id="createPassword"
              v-model="createPassword"
              v-bind="createPasswordAttrs"
              type="password"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': createErrors.password }"
            />
            <div v-if="createErrors.password" class="invalid-feedback">
              {{ createErrors.password }}
            </div>
          </div>

          <div class="col-md-3">
            <label for="createAge" class="form-label fw-bold small">Вік *</label>
            <input
              id="createAge"
              v-model.number="createAge"
              v-bind="createAgeAttrs"
              type="number"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': createErrors.age }"
            />
            <div v-if="createErrors.age" class="invalid-feedback">
              {{ createErrors.age }}
            </div>
          </div>

          <div class="col-md-3">
            <label for="createGender" class="form-label fw-bold small">Стать *</label>
            <select
              id="createGender"
              v-model="createGender"
              v-bind="createGenderAttrs"
              class="form-select form-select-sm"
              :class="{ 'is-invalid': createErrors.gender }"
            >
              <option value="male">Чоловіча</option>
              <option value="female">Жіноча</option>
              <option value="other">Інша</option>
            </select>
            <div v-if="createErrors.gender" class="invalid-feedback">
              {{ createErrors.gender }}
            </div>
          </div>

          <div class="col-12">
            <label for="createPhone" class="form-label fw-bold small">Телефон *</label>
            <input
              id="createPhone"
              v-model="createPhone"
              v-bind="createPhoneAttrs"
              type="tel"
              class="form-control form-control-sm"
              :class="{ 'is-invalid': createErrors.phone }"
            />
            <div v-if="createErrors.phone" class="invalid-feedback">
              {{ createErrors.phone }}
            </div>
          </div>
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="isCreateModalOpen = false"
        >
          Скасувати
        </button>
        <button
          type="submit"
          form="createUserForm"
          class="btn btn-sm btn-primary"
          :disabled="isCreateSubmitting"
        >
          <span
            v-if="isCreateSubmitting"
            class="spinner-border spinner-border-sm me-1"
            role="status"
            aria-hidden="true"
          ></span>
          {{ isCreateSubmitting ? 'Створення...' : 'Створити' }}
        </button>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :show="isDeleteModalOpen"
      title="Підтвердження видалення"
      @close="isDeleteModalOpen = false"
    >
      <p class="mb-0">
        Ви впевнені, що бажаєте видалити користувача
        <strong>{{ userToDelete?.firstName }} {{ userToDelete?.lastName }} (#{{ userToDelete?.id }})</strong>?
      </p>

      <template #footer>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="isDeleteModalOpen = false"
        >
          Скасувати
        </button>
        <button
          type="button"
          class="btn btn-sm btn-danger"
          :disabled="isDeleting"
          @click="executeDeleteUser"
        >
          <span
            v-if="isDeleting"
            class="spinner-border spinner-border-sm me-1"
            role="status"
            aria-hidden="true"
          ></span>
          {{ isDeleting ? 'Видалення...' : 'Видалити' }}
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type { User, CreateUserDto } from '@/types/user'
import { useUsersStore } from '@/stores/users'
import BaseModal from '@/components/BaseModal.vue'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

// Query params & pagination
const pageSize = 10
const searchInput = ref<string>('')

const currentPage = computed(() => {
  const page = Number(route.query.page)
  return isNaN(page) || page < 1 ? 1 : page
})

const currentQ = computed(() => {
  return typeof route.query.q === 'string' ? route.query.q : ''
})

const totalPages = computed(() => {
  return Math.ceil(usersStore.total / pageSize) || 1
})

const visiblePages = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  const pages: number[] = []

  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// --- Winners feature ---
const STORAGE_KEY_WINNERS = 'vue-lottery-dummyjson-winners'
const winners = ref<User[]>(
  (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WINNERS)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })(),
)

watch(
  winners,
  (newWinners) => {
    try {
      localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(newWinners))
    } catch {
      // ignore
    }
  },
  { deep: true },
)

const isNewWinnerDisabled = computed(() => {
  const winnerIds = new Set(winners.value.map((w) => w.id))
  const available = usersStore.users.filter((u) => !winnerIds.has(u.id))
  return winners.value.length >= 3 || available.length === 0
})

function pickNewWinner() {
  const winnerIds = new Set(winners.value.map((w) => w.id))
  const available = usersStore.users.filter((u) => !winnerIds.has(u.id))
  if (available.length === 0 || winners.value.length >= 3) return

  const randomIndex = Math.floor(Math.random() * available.length)
  const selected = available[randomIndex]
  if (selected) {
    winners.value.push(selected)
  }
}

function removeWinner(id: number) {
  winners.value = winners.value.filter((w) => w.id !== id)
}

function resetWinners() {
  winners.value = []
}

// --- Sync Route & Data ---
async function syncFromRoute() {
  searchInput.value = currentQ.value
  await usersStore.fetchUsers({
    page: currentPage.value,
    limit: pageSize,
    q: currentQ.value,
  })
}

function updateRouteQuery(newPage: number, newQ?: string) {
  const query: Record<string, string> = {}
  if (newPage > 1) {
    query.page = String(newPage)
  }
  const qVal = newQ !== undefined ? newQ.trim() : currentQ.value.trim()
  if (qVal) {
    query.q = qVal
  }
  router.push({ path: '/users', query })
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  updateRouteQuery(page)
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function handleSearchSubmit() {
  updateRouteQuery(1, searchInput.value)
}

function clearSearch() {
  searchInput.value = ''
  updateRouteQuery(1, '')
}

watch(searchInput, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (val !== currentQ.value) {
      updateRouteQuery(1, val)
    }
  }, 400)
})

watch(
  () => [route.query.page, route.query.q],
  () => {
    syncFromRoute()
  },
)

onMounted(() => {
  syncFromRoute()
})

// --- Create User Modal & Validation ---
const isCreateModalOpen = ref(false)
const createError = ref<string | null>(null)

const createUserSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, "Ім'я обов'язкове"),
    lastName: z.string().min(1, "Прізвище обов'язкове"),
    email: z.string().email('Некоректний email'),
    username: z.string().min(3, 'Username щонайменше 3 символи'),
    password: z.string().min(6, 'Пароль щонайменше 6 символів'),
    age: z
      .number({ invalid_type_error: 'Вік має бути числом' })
      .min(1, 'Вік повинен бути більше 0')
      .max(120, 'Некоректний вік'),
    gender: z.enum(['male', 'female', 'other']),
    phone: z.string().min(5, 'Вкажіть телефон'),
  }),
)

const {
  defineField: defineCreateField,
  handleSubmit: handleCreateSubmit,
  errors: createErrors,
  isSubmitting: isCreateSubmitting,
  resetForm: resetCreateForm,
} = useForm({
  validationSchema: createUserSchema,
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    age: 25,
    gender: 'male' as const,
    phone: '',
  },
})

const [createFirstName, createFirstNameAttrs] = defineCreateField('firstName')
const [createLastName, createLastNameAttrs] = defineCreateField('lastName')
const [createEmail, createEmailAttrs] = defineCreateField('email')
const [createUsername, createUsernameAttrs] = defineCreateField('username')
const [createPassword, createPasswordAttrs] = defineCreateField('password')
const [createAge, createAgeAttrs] = defineCreateField('age')
const [createGender, createGenderAttrs] = defineCreateField('gender')
const [createPhone, createPhoneAttrs] = defineCreateField('phone')

const onCreateSubmit = handleCreateSubmit(async (values) => {
  createError.value = null
  try {
    const payload: CreateUserDto = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      username: values.username,
      password: values.password,
      age: values.age,
      gender: values.gender,
      phone: values.phone,
    }
    await usersStore.createUser(payload)
    isCreateModalOpen.value = false
    resetCreateForm()
  } catch (err: unknown) {
    createError.value = err instanceof Error ? err.message : 'Помилка створення'
  }
})

// --- Delete User Confirmation ---
const isDeleteModalOpen = ref(false)
const userToDelete = ref<User | null>(null)
const isDeleting = ref(false)

function confirmDeleteUser(user: User) {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

async function executeDeleteUser() {
  if (!userToDelete.value) return
  isDeleting.value = true
  try {
    await usersStore.deleteUser(userToDelete.value.id)
    removeWinner(userToDelete.value.id)
    isDeleteModalOpen.value = false
    userToDelete.value = null
  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : 'Не вдалося видалити')
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped lang="scss">
.users-view {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
