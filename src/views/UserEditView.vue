<template>
  <div class="card p-3 shadow-sm mb-4">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">Редагування користувача</h5>
        <RouterLink :to="`/users/${id}`" class="btn btn-sm btn-outline-secondary">
          Скасувати
        </RouterLink>
      </div>

      <div v-if="saveError" class="alert alert-danger py-2 px-3 small mb-3">
        {{ saveError }}
      </div>

      <form @submit="onSubmit">
        <div class="row g-3">
          <div class="col-md-6">
            <label for="firstName" class="form-label fw-bold small">Ім'я</label>
            <input
              id="firstName"
              v-model="firstName"
              v-bind="firstNameAttrs"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.firstName }"
            />
            <div v-if="errors.firstName" class="invalid-feedback">
              {{ errors.firstName }}
            </div>
          </div>

          <div class="col-md-6">
            <label for="lastName" class="form-label fw-bold small">Прізвище</label>
            <input
              id="lastName"
              v-model="lastName"
              v-bind="lastNameAttrs"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.lastName }"
            />
            <div v-if="errors.lastName" class="invalid-feedback">
              {{ errors.lastName }}
            </div>
          </div>

          <div class="col-md-6">
            <label for="email" class="form-label fw-bold small">Email</label>
            <input
              id="email"
              v-model="email"
              v-bind="emailAttrs"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
            />
            <div v-if="errors.email" class="invalid-feedback">
              {{ errors.email }}
            </div>
          </div>

          <div class="col-md-6">
            <label for="username" class="form-label fw-bold small">Username</label>
            <input
              id="username"
              v-model="username"
              v-bind="usernameAttrs"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.username }"
            />
            <div v-if="errors.username" class="invalid-feedback">
              {{ errors.username }}
            </div>
          </div>

          <div class="col-md-6">
            <label for="password" class="form-label fw-bold small">Пароль (необов'язково)</label>
            <input
              id="password"
              v-model="password"
              v-bind="passwordAttrs"
              type="password"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              placeholder="Залиште порожнім, якщо не змінюєте"
            />
            <div v-if="errors.password" class="invalid-feedback">
              {{ errors.password }}
            </div>
          </div>

          <div class="col-md-3">
            <label for="age" class="form-label fw-bold small">Вік</label>
            <input
              id="age"
              v-model.number="age"
              v-bind="ageAttrs"
              type="number"
              class="form-control"
              :class="{ 'is-invalid': errors.age }"
            />
            <div v-if="errors.age" class="invalid-feedback">
              {{ errors.age }}
            </div>
          </div>

          <div class="col-md-3">
            <label for="gender" class="form-label fw-bold small">Стать</label>
            <select
              id="gender"
              v-model="gender"
              v-bind="genderAttrs"
              class="form-select"
              :class="{ 'is-invalid': errors.gender }"
            >
              <option value="male">Чоловіча</option>
              <option value="female">Жіноча</option>
              <option value="other">Інша</option>
            </select>
            <div v-if="errors.gender" class="invalid-feedback">
              {{ errors.gender }}
            </div>
          </div>

          <div class="col-12">
            <label for="phone" class="form-label fw-bold small">Телефон</label>
            <input
              id="phone"
              v-model="phone"
              v-bind="phoneAttrs"
              type="tel"
              class="form-control"
              :class="{ 'is-invalid': errors.phone }"
            />
            <div v-if="errors.phone" class="invalid-feedback">
              {{ errors.phone }}
            </div>
          </div>
        </div>

        <div class="mt-4 d-flex justify-content-end gap-2">
          <RouterLink :to="`/users/${id}`" class="btn btn-outline-secondary">
            Скасувати
          </RouterLink>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <span
              v-if="isSubmitting"
              class="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            ></span>
            {{ isSubmitting ? 'Збереження...' : 'Зберегти зміни' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type { User, UpdateUserDto } from '@/types/user'
import { useUsersStore } from '@/stores/users'

const props = defineProps<{
  id: number
  user?: User | null
}>()

const emit = defineEmits<{
  (e: 'saved', updated: User): void
}>()

const router = useRouter()
const usersStore = useUsersStore()
const saveError = ref<string | null>(null)

const userEditSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, "Ім'я є обовʼязковим"),
    lastName: z.string().min(1, 'Прізвище є обовʼязковим'),
    email: z.string().email('Некоректний email'),
    username: z.string().min(3, 'Username повинен містити щонайменше 3 символи'),
    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: 'Пароль повинен бути щонайменше 6 символів',
      }),
    age: z
      .number({ invalid_type_error: 'Вкажіть вік числом' })
      .min(1, 'Вік повинен бути більше 0')
      .max(120, 'Некоректний вік'),
    gender: z.enum(['male', 'female', 'other'], {
      errorMap: () => ({ message: 'Оберіть стать' }),
    }),
    phone: z.string().min(5, 'Вкажіть контактний телефон'),
  }),
)

const { defineField, handleSubmit, errors, isSubmitting, resetForm } = useForm({
  validationSchema: userEditSchema,
  initialValues: {
    firstName: props.user?.firstName || '',
    lastName: props.user?.lastName || '',
    email: props.user?.email || '',
    username: props.user?.username || '',
    password: '',
    age: props.user?.age || 18,
    gender: (props.user?.gender as 'male' | 'female' | 'other') || 'male',
    phone: props.user?.phone || '',
  },
})

const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')
const [age, ageAttrs] = defineField('age')
const [gender, genderAttrs] = defineField('gender')
const [phone, phoneAttrs] = defineField('phone')

function fillUserData(u: User) {
  resetForm({
    values: {
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      username: u.username,
      password: '',
      age: u.age,
      gender: (u.gender as 'male' | 'female' | 'other') || 'male',
      phone: u.phone,
    },
  })
}

onMounted(async () => {
  if (props.user) {
    fillUserData(props.user)
  } else {
    try {
      const u = await usersStore.getUserById(props.id)
      fillUserData(u)
    } catch (err: unknown) {
      saveError.value = err instanceof Error ? err.message : 'Не вдалося завантажити дані'
    }
  }
})

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      fillUserData(newUser)
    }
  },
)

const onSubmit = handleSubmit(async (values) => {
  saveError.value = null
  try {
    const updatePayload: UpdateUserDto = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      username: values.username,
      age: values.age,
      gender: values.gender,
      phone: values.phone,
    }
    if (values.password) {
      updatePayload.password = values.password
    }

    const updated = await usersStore.updateUser(props.id, updatePayload)
    emit('saved', updated)
    router.push(`/users/${props.id}`)
  } catch (err: unknown) {
    saveError.value = err instanceof Error ? err.message : 'Не вдалося зберегти зміни'
  }
})
</script>
