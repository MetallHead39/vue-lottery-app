<template>
  <div class="layout-default min-vh-100 d-flex flex-column">
    <AppHeader />
    <main class="flex-grow-1 py-4">
      <div class="container">
        <slot />
      </div>
    </main>
    <footer class="bg-white border-top py-3 text-center text-muted small">
      <div class="container">
        &copy; {{ currentYear }} Vue Lottery App. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/navigation/AppHeader.vue'

const currentYear = new Date().getFullYear()
</script>
