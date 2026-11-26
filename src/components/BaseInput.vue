<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    placeholder?: string
    type?: 'text' | 'email' | 'tel' | 'date'
    errorMessage?: string
    isValid?: boolean
    required?: boolean
    disabled?: boolean
  }>(),
  {
    id: () => `input-${Math.random().toString(36).substring(2, 9)}`,
    label: '',
    placeholder: '',
    type: 'text',
    errorMessage: '',
    isValid: false,
    required: false,
    disabled: false,
  },
)

const model = defineModel<string>({ default: '' })

const emit = defineEmits<{
  (e: 'blur'): void
}>()

const inputClasses = computed(() => {
  if (props.errorMessage) {
    return 'has-error'
  }
  if (props.isValid) {
    return 'has-success'
  }
  return ''
})
</script>

<template>
  <div class="input-wrapper">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
    </label>
    <div class="input-field-container">
      <input
        :id="id"
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="['form-input', inputClasses]"
        :aria-describedby="errorMessage ? `${id}-feedback` : undefined"
        @blur="emit('blur')"
      />
      <!-- Success checkmark icon inside input right side -->
      <span v-if="isValid && !errorMessage" class="success-checkmark" aria-hidden="true">
        ✓
      </span>
    </div>
    <div v-if="errorMessage" :id="`${id}-feedback`" class="error-text">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.input-wrapper {
  margin-bottom: 1.1rem;
}

.input-label {
  display: block;
  font-weight: 700;
  font-size: 0.875rem;
  color: #1f2937;
  margin-bottom: 0.35rem;
}

.input-field-container {
  position: relative;
  width: 100%;
}

.form-input {
  width: 100%;
  height: 38px;
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
  color: #1f2937;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 3px;
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.form-input::placeholder {
  color: #9ca3af;
  opacity: 1;
}

.form-input:focus {
  background-color: #ffffff;
  border-color: #00a8e8;
}

/* Success state: white background, green border */
.form-input.has-success {
  background-color: #ffffff;
  border-color: #10b981;
  padding-right: 2rem;
}

.success-checkmark {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #10b981;
  font-weight: bold;
  font-size: 0.95rem;
  pointer-events: none;
}

/* Error state: white background, red border */
.form-input.has-error {
  background-color: #ffffff;
  border-color: #e74c3c;
}

.error-text {
  font-size: 0.75rem;
  color: #e74c3c;
  margin-top: 0.25rem;
  line-height: 1.2;
}
</style>
