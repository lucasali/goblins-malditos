<script setup lang="ts">
// Emits
const emit = defineEmits(['toggle'])

// Toggle sidebar
function toggleSidebar() {
  emit('toggle')
}
</script>

<template>
  <button
    class="fixed top-4 left-4 z-30 flex items-center bg-goblin-green hover:bg-goblin-brown text-white py-2 px-3 rounded-md shadow-md transition-all duration-300 hover:shadow-lg"
    aria-label="Toggle Sidebar"
    @click="toggleSidebar"
  >
    <i class="material-icons">menu</i>
    <span class="ml-2 hidden md:inline">Menu</span>
  </button>
</template>
