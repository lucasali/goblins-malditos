<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import SidebarToggle from './components/SidebarToggle.vue'

const isSidebarOpen = ref<boolean>(false)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="goblin-container">
    <!-- Sidebar Toggle Button -->
    <SidebarToggle @toggle="toggleSidebar" />

    <!-- Sidebar Component -->
    <Sidebar :is-open="isSidebarOpen" @close="closeSidebar" />

    <!-- Main Content -->
    <main class="pt-16 transition-all duration-300 ease-in-out" :class="{ 'md:ml-64': isSidebarOpen }">
      <RouterView />
    </main>

    <footer class="text-center text-goblin-brown text-sm">
      <p>Criado para o RPG Goblins Malditos - Onde a morte é apenas o começo!</p>
    </footer>
  </div>
</template>
