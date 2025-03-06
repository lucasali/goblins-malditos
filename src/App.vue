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
  <div class="relative">
    <SidebarToggle @toggle="toggleSidebar" />

    <Sidebar :is-open="isSidebarOpen" @close="closeSidebar" />

    <header class="text-center space-y-2">
      <h1 class="font-bold font-goblin text-goblin-green text-shadow-goblin text-5xl text">
        Goblins Malditos
      </h1>
    </header>

    <main class="container mx-auto transition-all duration-300 ease-in-out" :class="{ 'md:ml-64': isSidebarOpen }">
      <RouterView />
    </main>

    <footer class="text-center text-goblin-brown text-sm">
      <p>Criado por <a href="https://github.com/lucasali">Lucas Ali</a></p>
    </footer>
  </div>
</template>
