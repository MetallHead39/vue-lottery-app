<template>
  <nav class="d-flex align-items-center gap-2">
    <RouterLink to="/" class="nav-link px-3 py-2" active-class="router-link-active" exact>
      Home
    </RouterLink>
    <RouterLink to="/about" class="nav-link px-3 py-2" active-class="router-link-active">
      About author
    </RouterLink>
    <RouterLink
      v-if="authStore.isAuthenticated"
      to="/users"
      class="nav-link px-3 py-2"
      active-class="router-link-active"
    >
      Users
    </RouterLink>

    <div class="nav-auth-actions ms-3 ps-3 border-start d-flex align-items-center gap-2">
      <template v-if="authStore.isAuthenticated">
        <span class="text-muted small me-1 d-none d-md-inline fw-semibold">
          @{{ authStore.user?.username || 'user' }}
        </span>
        <button
          type="button"
          class="btn btn-sm btn-outline-danger px-3 py-1"
          @click="handleLogout"
        >
          Logout
        </button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="btn btn-sm btn-primary px-3 py-1">
          Login
        </RouterLink>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.nav-link {
  color: var(--text-dark, #1f2937);
  text-decoration: none;
  font-weight: 500;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary-accent, #00a8e8);
    background-color: rgba(0, 168, 232, 0.08);
  }

  &.router-link-active {
    color: var(--primary-accent, #00a8e8);
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 12px;
      right: 12px;
      height: 2px;
      background-color: var(--primary-accent, #00a8e8);
      border-radius: 2px;
    }
  }
}
</style>
