<template>
  <RouterLink to="/" class="logo-link text-decoration-none d-flex align-items-center gap-2">
    <span class="logo-icon">🎰</span>
    <span class="logo-text fw-bold text-dark fs-5">Vue Lottery</span>
  </RouterLink>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppLogo',
})
import { RouterLink } from 'vue-router'
</script>

<style scoped lang="scss">
.logo-link {
  user-select: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
}

.logo-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.logo-text {
  letter-spacing: -0.5px;
}
</style>
