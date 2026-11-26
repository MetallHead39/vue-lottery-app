<template>
  <header class="app-header bg-white border-bottom shadow-sm">
    <div class="container py-3 d-flex justify-content-between align-items-center">
      <Logo />
      <AppNavigation />
    </div>
  </header>
</template>

<script setup lang="ts">
import Logo from './Logo.vue'
import AppNavigation from './AppNavigation.vue'
</script>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.95) !important;
}
</style>
