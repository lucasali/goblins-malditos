<script setup lang="ts">
// Emits
const emit = defineEmits(['toggle']);

// Toggle sidebar
const toggleSidebar = () => {
  emit('toggle');
};
</script>

<template>
  <button 
    @click="toggleSidebar" 
    class="sidebar-toggle"
    aria-label="Toggle Sidebar"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
    <span class="ml-2 hidden md:inline">Role os dados</span>
  </button>
</template>

<style scoped>
.sidebar-toggle {
  @apply fixed top-4 left-4 z-30 flex items-center bg-goblin-green hover:bg-goblin-brown text-white py-2 px-3 rounded-md shadow-md transition-all duration-300;
  transform: none !important;
}

.sidebar-toggle:hover {
  @apply shadow-lg;
}

.sidebar-toggle svg {
  @apply transition-transform duration-300;
}

.sidebar-toggle:hover svg {
  transform: rotate(90deg);
}
</style> 
