<template>
  <div class="user-detail-view">
    <div class="mb-3">
      <RouterLink to="/users" class="btn btn-outline-secondary btn-sm">
        ← Повернутися до списку
      </RouterLink>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Завантаження...</span>
      </div>
      <p class="mt-2 text-muted">Завантаження профілю користувача...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <div v-else-if="user" class="row g-4">
      <div class="col-lg-5">
        <div class="card p-3 shadow-sm h-100">
          <div class="card-body text-center">
            <img
              :src="user.image || 'https://dummyjson.com/icon/user/128'"
              :alt="user.username"
              class="rounded-circle mb-3 border p-1"
              style="width: 120px; height: 120px; object-fit: cover;"
            />
            <h4 class="fw-bold mb-1">{{ user.firstName }} {{ user.lastName }}</h4>
            <p class="text-muted mb-2">@{{ user.username }}</p>
            <span class="badge bg-primary mb-3 text-capitalize">{{ user.role || user.gender }}</span>

            <div class="text-start mt-3 pt-3 border-top">
              <div class="row g-2 small">
                <div class="col-sm-4 text-muted fw-bold">ID:</div>
                <div class="col-sm-8">{{ user.id }}</div>

                <div class="col-sm-4 text-muted fw-bold">Email:</div>
                <div class="col-sm-8 text-break">{{ user.email }}</div>

                <div class="col-sm-4 text-muted fw-bold">Телефон:</div>
                <div class="col-sm-8">{{ user.phone || '—' }}</div>

                <div class="col-sm-4 text-muted fw-bold">Вік:</div>
                <div class="col-sm-8">{{ user.age }}</div>

                <div class="col-sm-4 text-muted fw-bold">Стать:</div>
                <div class="col-sm-8 text-capitalize">{{ user.gender }}</div>

                <template v-if="user.address">
                  <div class="col-sm-4 text-muted fw-bold">Адреса:</div>
                  <div class="col-sm-8">
                    {{ user.address.city || '' }}
                    <template v-if="user.address.address">, {{ user.address.address }}</template>
                  </div>
                </template>
              </div>
            </div>

            <div class="mt-4 d-flex justify-content-center gap-2">
              <RouterLink
                v-if="!isEditing"
                :to="`/users/${user.id}/edit`"
                class="btn btn-primary"
              >
                Редагувати профіль
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-7">
        <!-- Nested RouterView for /users/:id/edit -->
        <RouterView :user="user" @saved="handleUserSaved" />

        <div v-if="!isEditing" class="card p-4 shadow-sm">
          <div class="card-body">
            <h5 class="fw-bold mb-3">Інформація облікового запису</h5>
            <p class="text-muted">
              Дані отримано через метод <code>ServiceProvider.users.getById({{ user.id }})</code>.
              Ви можете змінити персональні дані користувача за допомогою форми редагування.
            </p>
            <div class="alert alert-light border small text-muted">
              <strong>Підказка:</strong> Оскільки бекенд DummyJSON є mock API, збережені зміни оновлюються
              в пам'яті локального Pinia стору на час поточної сесії.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import type { User } from '@/types/user'
import { ServiceProvider } from '@/services/service-provider'

const props = defineProps<{
  id: number
}>()

const route = useRoute()
const user = ref<User | null>(null)
const isLoading = ref<boolean>(false)
const errorMessage = ref<string | null>(null)

const isEditing = computed(() => route.name === 'user-edit')

async function loadUser() {
  isLoading.value = true
  errorMessage.value = null
  try {
    user.value = await ServiceProvider.users.getById(props.id)
  } catch (err: unknown) {
    errorMessage.value =
      err instanceof Error ? err.message : `Не вдалося завантажити користувача #${props.id}`
  } finally {
    isLoading.value = false
  }
}

function handleUserSaved(updated: User) {
  user.value = { ...user.value, ...updated }
}

onMounted(() => {
  loadUser()
})

watch(
  () => props.id,
  () => {
    loadUser()
  },
)
</script>

<style scoped lang="scss">
.user-detail-view {
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
