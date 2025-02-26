<script setup lang="ts">
import { ref } from 'vue';
import { RouterView, RouterLink } from 'vue-router';
import Sidebar from './components/Sidebar.vue';
import SidebarToggle from './components/SidebarToggle.vue';

// Estado para controlar a visibilidade da sidebar
const isSidebarOpen = ref<boolean>(false);

// Função para alternar a visibilidade da sidebar
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Função para fechar a sidebar
const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <div class="goblin-container">
    <!-- Sidebar Toggle Button -->
    <SidebarToggle @toggle="toggleSidebar" />
    
    <!-- Sidebar Component -->
    <Sidebar :isOpen="isSidebarOpen" @close="closeSidebar" />
    
    <!-- Navigation -->
    <nav class="main-nav">
      <RouterLink to="/" class="nav-link">Início</RouterLink>
    </nav>
    
    <!-- Main Content -->
    <div class="main-content" :class="{ 'sidebar-open': isSidebarOpen }">
      <RouterView />
    </div>
  </div>
</template>

<style>
/* Animação de tremor para o botão de gerar goblin */
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.shake {
  animation: shake 0.5s;
}

/* Layout responsivo para a exibição do goblin */
.goblin-display {
  @apply w-full;
}

.goblin-content-wrapper {
  @apply flex flex-col items-center gap-4;
  max-width: 100%;
}

.goblin-image-wrapper, .goblin-card-wrapper {
  @apply w-full;
}

/* Layout para telas médias e grandes */
@media (min-width: 768px) {
  .goblin-content-wrapper {
    @apply flex-row items-start justify-center gap-6;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .goblin-card-wrapper {
    @apply w-1/2;
  }
  
  .goblin-image-wrapper {
    @apply w-1/2;
  }
}

/* Botão de gerar goblin */
.goblin-button {
  @apply bg-goblin-green text-white font-goblin py-3 px-6 rounded-lg shadow-lg hover:bg-goblin-brown transition-colors duration-300 transform hover:scale-105;
}

/* Estilo para a navegação principal */
.main-nav {
  @apply fixed top-0 left-1/2 transform -translate-x-1/2 z-20 bg-goblin-dark px-4 py-2 rounded-b-lg shadow-lg flex gap-4;
}

.nav-link {
  @apply text-white hover:text-goblin-green transition-colors duration-200 font-goblin;
}

.nav-link.router-link-active {
  @apply text-goblin-green;
}

/* Ajuste para o conteúdo principal com a navegação */
.main-content {
  @apply pt-16 transition-all duration-300 ease-in-out;
}

.main-content.sidebar-open {
  @apply md:ml-64;
}
</style>
