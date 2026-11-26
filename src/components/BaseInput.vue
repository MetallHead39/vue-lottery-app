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

const inputClass = computed(() => {
  if (props.errorMessage) {
    return 'is-invalid'
  }
  if (props.isValid) {
    return 'is-valid'
  }
  return ''
})
</script>

<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <div class="input-group has-validation">
      <input
        :id="id"
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="['form-control', inputClass]"
        :aria-describedby="errorMessage ? `${id}-feedback` : undefined"
        @blur="emit('blur')"
      />
      <div v-if="errorMessage" :id="`${id}-feedback`" class="invalid-feedback d-block">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.invalid-feedback {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
