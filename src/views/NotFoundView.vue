<template>
  <div class="not-found-view text-center py-5">
    <div class="display-1 fw-bold text-primary mb-3">404</div>
    <h2 class="fw-bold mb-3">Сторінку не знайдено</h2>
    <p class="text-muted mb-4 col-md-6 mx-auto">
      Вибачте, адреса, яку ви запросили, не існує або була переміщена.
    </p>
    <RouterLink to="/" class="btn btn-primary btn-lg">
      ← Повернутися на головну
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped lang="scss">
.not-found-view {
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
