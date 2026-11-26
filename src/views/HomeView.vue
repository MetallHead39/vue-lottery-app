<template>
  <div class="home-view">
    <div class="p-5 mb-4 bg-white rounded-3 shadow-sm border text-center">
      <div class="container-fluid py-4">
        <h1 class="display-5 fw-bold text-dark mb-3">🎰 Vue Lottery App</h1>
        <p class="col-md-8 fs-5 text-muted mx-auto mb-4">
          Сучасний SPA-додаток на Vue 3 з повнофункціональною маршрутизацією, автентифікацією через DummyJSON API,
          патерном Repository, Pinia Store та валідацією форм за допомогою VeeValidate + Zod.
        </p>
        <div class="d-flex justify-content-center gap-3">
          <RouterLink to="/users" class="btn btn-primary btn-lg px-4">
            Перейти до користувачів
          </RouterLink>
          <a
            href="https://github.com/metallhead/vue-lottery-app"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline-secondary btn-lg px-4"
          >
            GitHub репозиторій
          </a>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="card h-100 p-3">
          <div class="card-body">
            <h5 class="card-title fw-bold text-primary">⚡ Стек технологій</h5>
            <ul class="list-unstyled mt-3 mb-0 text-muted">
              <li><strong>Vue 3</strong> (Composition API, <code>&lt;script setup lang="ts"&gt;</code>)</li>
              <li><strong>TypeScript</strong> із суворою типізацією</li>
              <li><strong>Vue Router 4</strong> (Guards, Layouts, Lazy Loading)</li>
              <li><strong>Pinia</strong> для керування глобальним станом</li>
              <li><strong>VeeValidate + Zod</strong> для надійної валідації форм</li>
              <li><strong>SCSS + Bootstrap 5</strong> (модульний імпорт)</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 p-3">
          <div class="card-body">
            <h5 class="card-title fw-bold text-primary">🏛️ Архітектура</h5>
            <ul class="list-unstyled mt-3 mb-0 text-muted">
              <li><strong>Repository Pattern</strong>: <code>Readable</code>, <code>Creatable</code>, <code>Editable</code>, <code>Deletable</code></li>
              <li><strong>Service Provider</strong>: єдина точка доступу до сервісів</li>
              <li><strong>HTTP-клієнт</strong>: автоматичний Refresh Token interceptor на 401</li>
              <li><strong>Layout Pattern</strong>: динамічний рендеринг за <code>meta.layout</code></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 p-3">
          <div class="card-body">
            <h5 class="card-title fw-bold text-primary">🎯 Можливості</h5>
            <ul class="list-unstyled mt-3 mb-0 text-muted">
              <li>Авторизація та захист маршрутів (JWT + Refresh)</li>
              <li>Керування користувачами (CRUD, пошук, пагінація)</li>
              <li>Синхронізація фільтрів та сторінок із URL query params</li>
              <li>Вбудований модуль розіграшу лотереї серед зареєстрованих</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped lang="scss">
.home-view {
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
