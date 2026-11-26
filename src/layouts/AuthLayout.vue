<template>
  <div class="layout-auth min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
    <div class="auth-card-wrapper w-100" style="max-width: 440px;">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// AuthLayout provides a clean centered container without navigation header
</script>

<style scoped lang="scss">
.layout-auth {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}
</style>
