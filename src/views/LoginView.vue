<template>
  <div class="card login-card p-4 shadow-sm">
    <div class="card-body">
      <div class="text-center mb-4">
        <div class="login-logo mb-2">🎰</div>
        <h3 class="fw-bold text-dark">Авторизація</h3>
        <p class="text-muted small">Введіть ваші облікові дані для входу</p>
      </div>

      <div v-if="authError" class="alert alert-danger py-2 px-3 small mb-3" role="alert">
        {{ authError }}
      </div>

      <form @submit="onSubmit">
        <div class="mb-3">
          <label for="username" class="form-label fw-bold small">Ім'я користувача (Username)</label>
          <input
            id="username"
            v-model="username"
            v-bind="usernameAttrs"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.username }"
            placeholder="Введіть username"
            autocomplete="username"
          />
          <div v-if="errors.username" class="invalid-feedback">
            {{ errors.username }}
          </div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label fw-bold small">Пароль</label>
          <input
            id="password"
            v-model="password"
            v-bind="passwordAttrs"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            placeholder="Введіть пароль"
            autocomplete="current-password"
          />
          <div v-if="errors.password" class="invalid-feedback">
            {{ errors.password }}
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100 py-2 fw-semibold"
          :disabled="isSubmitting"
        >
          <span
            v-if="isSubmitting"
            class="spinner-border spinner-border-sm me-1"
            role="status"
            aria-hidden="true"
          ></span>
          {{ isSubmitting ? 'Вхід...' : 'Увійти' }}
        </button>
      </form>

      <div class="demo-credentials mt-4 p-3 bg-light rounded border">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="small fw-bold text-dark">Тестовий акаунт DummyJSON:</span>
          <button
            type="button"
            class="btn btn-sm btn-link p-0 text-decoration-none"
            @click="fillDemoCredentials"
          >
            Підставити
          </button>
        </div>
        <div class="small text-muted font-monospace">
          <div><strong>Username:</strong> emilys</div>
          <div><strong>Password:</strong> emilyspass</div>
        </div>
      </div>

      <div class="text-center mt-3">
        <RouterLink to="/" class="small text-decoration-none text-muted">
          ← На головну
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const authError = ref<string | null>(null)

const loginSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, 'Username є обовʼязковим полем'),
    password: z.string().min(6, 'Пароль повинен містити щонайменше 6 символів'),
  }),
)

const { defineField, handleSubmit, errors, isSubmitting, setValues } = useForm({
  validationSchema: loginSchema,
  initialValues: {
    username: '',
    password: '',
  },
})

const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

function fillDemoCredentials() {
  setValues({
    username: 'emilys',
    password: 'emilyspass',
  })
  authError.value = null
}

const onSubmit = handleSubmit(async (values) => {
  authError.value = null
  try {
    await authStore.login({
      username: values.username,
      password: values.password,
    })

    const redirect = (route.query.redirect as string) || '/users'
    router.push(redirect)
  } catch (err: unknown) {
    authError.value =
      err instanceof Error ? err.message : 'Невірні дані користувача або помилка сервера'
  }
})
</script>

<style scoped lang="scss">
.login-card {
  border-radius: 8px;
  background-color: #ffffff;
}

.login-logo {
  font-size: 2.5rem;
  line-height: 1;
}
</style>
