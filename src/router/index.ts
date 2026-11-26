import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Home',
      layout: 'default',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: 'About Author',
      layout: 'default',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'Login',
      layout: 'auth',
    },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UsersView.vue'),
    meta: {
      title: 'Users',
      requiresAuth: true,
      layout: 'default',
    },
  },
  {
    path: '/users/:id',
    name: 'user-detail',
    component: () => import('@/views/UserDetailView.vue'),
    props: (route) => ({ id: Number(route.params.id) }),
    meta: {
      title: 'User Profile',
      requiresAuth: true,
      layout: 'default',
    },
    children: [
      {
        path: 'edit',
        name: 'user-edit',
        component: () => import('@/views/UserEditView.vue'),
        props: (route) => ({ id: Number(route.params.id) }),
        meta: {
          title: 'Edit User',
          requiresAuth: true,
          layout: 'default',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '404 Not Found',
      layout: 'default',
    },
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'users' }
  }
})

router.afterEach((to) => {
  const baseTitle = 'Vue Lottery App'
  const title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle
  document.title = title
})

export default router
