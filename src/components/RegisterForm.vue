<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import type { Participant } from '@/types/participant'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

const props = defineProps<{
  existingEmails: string[]
}>()

const emit = defineEmits<{
  (e: 'add-participant', participant: Omit<Participant, 'id'>): void
}>()

interface FormState {
  name: string
  dob: string
  email: string
  phone: string
}

const form = reactive<FormState>({
  name: '',
  dob: '',
  email: '',
  phone: '',
})

const touched = reactive({
  name: false,
  dob: false,
  email: false,
  phone: false,
})

const isSubmitted = ref(false)

const PHONE_REGEX = /^\+380\d{9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const errors = computed(() => {
  const errs: Record<keyof FormState, string> = {
    name: '',
    dob: '',
    email: '',
    phone: '',
  }

  // Name validation
  if (!form.name.trim()) {
    errs.name = 'This value is required.'
  }

  // DOB validation
  if (!form.dob) {
    errs.dob = 'This value is required.'
  } else {
    const selectedDate = new Date(form.dob)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate > today) {
      errs.dob = 'Date of birth cannot be in the future.'
    }
  }

  // Email validation
  if (!form.email.trim()) {
    errs.email = 'This value is required.'
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errs.email = 'Please enter a valid email address.'
  } else {
    const normalizedEmail = form.email.trim().toLowerCase()
    const isDuplicate = props.existingEmails.some((e) => e.trim().toLowerCase() === normalizedEmail)
    if (isDuplicate) {
      errs.email = 'This email is already registered.'
    }
  }

  // Phone validation
  if (!form.phone.trim()) {
    errs.phone = 'This value is required.'
  } else if (!PHONE_REGEX.test(form.phone.trim())) {
    errs.phone = 'Phone number must match format +380XXXXXXXXX.'
  }

  return errs
})

const isFormValid = computed(() => {
  return !errors.value.name && !errors.value.dob && !errors.value.email && !errors.value.phone
})

function getErrorMessage(field: keyof FormState): string {
  if (touched[field] || isSubmitted.value) {
    return errors.value[field]
  }
  return ''
}

function getIsValid(field: keyof FormState): boolean {
  if ((touched[field] || isSubmitted.value) && !errors.value[field]) {
    return true
  }
  return false
}

function resetForm() {
  form.name = ''
  form.dob = ''
  form.email = ''
  form.phone = ''
  touched.name = false
  touched.dob = false
  touched.email = false
  touched.phone = false
  isSubmitted.value = false
}

function handleSubmit() {
  isSubmitted.value = true
  touched.name = true
  touched.dob = true
  touched.email = true
  touched.phone = true

  if (!isFormValid.value) {
    return
  }

  emit('add-participant', {
    name: form.name.trim(),
    dob: form.dob,
    email: form.email.trim(),
    phone: form.phone.trim(),
  })

  resetForm()
}
</script>

<template>
  <div class="card mb-4">
    <div class="card-body">
      <h2 class="h5 card-title fw-bold text-uppercase mb-1">Register Form</h2>
      <p class="card-subtitle text-muted mb-4">Please fill in all the fields.</p>

      <form @submit.prevent="handleSubmit" @keydown.enter.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <BaseInput
              v-model="form.name"
              label="Name"
              placeholder="Enter name"
              required
              :error-message="getErrorMessage('name')"
              :is-valid="getIsValid('name')"
              @blur="touched.name = true"
            />
          </div>

          <div class="col-12 col-md-6">
            <BaseInput
              v-model="form.dob"
              type="date"
              label="Date of Birth"
              required
              :error-message="getErrorMessage('dob')"
              :is-valid="getIsValid('dob')"
              @blur="touched.dob = true"
            />
          </div>

          <div class="col-12 col-md-6">
            <BaseInput
              v-model="form.email"
              type="email"
              label="Email"
              placeholder="example@mail.com"
              required
              :error-message="getErrorMessage('email')"
              :is-valid="getIsValid('email')"
              @blur="touched.email = true"
            />
          </div>

          <div class="col-12 col-md-6">
            <BaseInput
              v-model="form.phone"
              type="tel"
              label="Phone number"
              placeholder="+380XXXXXXXXX"
              required
              :error-message="getErrorMessage('phone')"
              :is-valid="getIsValid('phone')"
              @blur="touched.phone = true"
            />
          </div>
        </div>

        <div class="d-flex justify-content-end mt-3">
          <BaseButton type="submit" variant="primary">
            Save
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>
