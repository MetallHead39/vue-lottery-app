<template>
  <div class="about-view py-2">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card p-4 shadow-sm border mb-4">
          <div class="card-body">
            <div class="d-flex align-items-center gap-4 mb-4 flex-wrap">
              <div class="author-avatar rounded-circle d-flex align-items-center justify-content-center text-white fs-3 fw-bold shadow-sm">
                С
              </div>
              <div>
                <h3 class="fw-bold mb-1 text-dark">Студент-розробник: Сапіга Олександр</h3>
                <p class="text-muted mb-2">Автор проєкту <code>vue-lottery-app</code> (Лабораторна робота №5)</p>
                <a
                  href="https://github.com/MetallHead39"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-sm btn-outline-dark px-3 py-1"
                >
                  GitHub профіль: @MetallHead39
                </a>
              </div>
            </div>

            <hr class="my-4 text-muted opacity-25" />

            <div class="technical-skills">
              <h5 class="fw-bold mb-3 d-flex align-items-center gap-2">
                <span>🛠️</span>
                <span>Technical skills</span>
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="skill-group p-3 border rounded-3 bg-light h-100">
                    <h6 class="fw-bold text-dark mb-3">Frontend Development</h6>
                    <div class="d-flex flex-wrap gap-2">
                      <span class="badge bg-white text-dark border shadow-sm px-2 py-1">Vue.js 3</span>
                      <span class="badge bg-white text-dark border shadow-sm px-2 py-1">TypeScript</span>
                      <span class="badge bg-white text-dark border shadow-sm px-2 py-1">JavaScript (ES6+)</span>
                      <span class="badge bg-white text-dark border shadow-sm px-2 py-1">Pinia</span>
                      <span class="badge bg-white text-dark border shadow-sm px-2 py-1">Vue Router</span>
                      <span class="badge bg-white text-dark border shadow-sm px-2 py-1">HTML5 / SCSS</span>
                      <span class="badge bg-white text-dark border shadow-sm px-2 py-1">Bootstrap 5</span>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="skill-group p-3 border rounded-3 bg-light h-100">
                    <h6 class="fw-bold text-dark mb-3">Tools & Practices</h6>
                    <div class="d-flex flex-wrap gap-2">
                      <span class="badge bg-white text-dark border shadow-sm px-2 py-1">Git & GitHub</span>
                      <span class="badge bg-white text-dark border shadow-sm px-2 py-1">Vite</span>
                      <span class="badge bg-white text-dark border shadow-sm px-2 py-1">ESLint & Prettier</span>
                      <span class="badge bg-white text-dark border shadow-sm px-2 py-1">VeeValidate + Zod</span>
                      <span class="badge bg-white text-dark border shadow-sm px-2 py-1">REST APIs</span>
                      <span class="badge bg-white text-dark border shadow-sm px-2 py-1">Clean Architecture</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="about-project-note mt-4 p-3 bg-light border-start border-4 border-info rounded-3">
              <h6 class="fw-bold text-dark mb-1">Про лабораторну роботу</h6>
              <p class="mb-0 text-muted small lh-base">
                У межах лабораторної реалізовано повноцінний клієнтський SPA-застосунок з ієрархічною навігацією,
                перевіркою прав доступу, валідацією полів та інтеграцією із зовнішнім REST сервісом DummyJSON.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// About author view
</script>

<style scoped lang="scss">
.author-avatar {
  width: 64px;
  height: 64px;
  min-width: 64px;
  background-color: var(--primary-accent, #00a8e8);
}

.badge {
  font-weight: 500;
  font-size: 0.8rem;
}

.about-view {
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
