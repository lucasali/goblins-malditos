<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import DiceRoller from './DiceRoller.vue';

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['close']);

// State
const isMobile = ref(false);

// Check if the device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// Close sidebar when clicking outside on mobile
const handleClickOutside = (event: MouseEvent) => {
  const sidebar = document.getElementById('goblin-sidebar');
  const target = event.target as HTMLElement;
  
  if (isMobile.value && sidebar && !sidebar.contains(target) && props.isOpen) {
    emit('close');
  }
};

// Lifecycle hooks
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  document.removeEventListener('mousedown', handleClickOutside);
});

// Close sidebar
const closeSidebar = () => {
  emit('close');
};
</script>

<template>
  <!-- Overlay for mobile -->
  <div 
    v-if="isMobile && isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
    @click="closeSidebar"
  ></div>
  
  <!-- Sidebar/Modal -->
  <aside 
    id="goblin-sidebar"
    :class="[
      'sidebar-container',
      isMobile ? 'mobile-sidebar' : 'desktop-sidebar',
      isOpen ? 'open' : 'closed'
    ]"
  >
    <!-- Header -->
    <div class="sidebar-header">
      <h2 class="text-xl">Rolador de Dados</h2>
      <button 
        @click="closeSidebar" 
        class="close-button"
        aria-label="Fechar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <!-- Content -->
    <div class="sidebar-content">
      <DiceRoller />
    </div>
    
    <!-- Footer -->
    <div class="sidebar-footer">
      <p class="text-sm text-goblin-brown">Goblins Malditos &copy; 2023</p>
    </div>
  </aside>
</template>

<style scoped>
/* Base Sidebar Styles */
.sidebar-container {
  @apply bg-goblin-dark border-goblin-green overflow-y-auto flex flex-col z-50 transition-all duration-300 ease-in-out;
  scrollbar-width: thin;
  scrollbar-color: var(--goblin-brown) var(--goblin-dark);
}

.sidebar-container::-webkit-scrollbar {
  width: 6px;
}

.sidebar-container::-webkit-scrollbar-track {
  background: var(--goblin-dark);
}

.sidebar-container::-webkit-scrollbar-thumb {
  background-color: var(--goblin-brown);
  border-radius: 3px;
}

/* Desktop Sidebar */
.desktop-sidebar {
  @apply fixed top-0 left-0 h-full w-64 border-r;
  transform: translateX(0);
}

.desktop-sidebar.closed {
  transform: translateX(-100%);
}

/* Mobile Sidebar (Modal) */
.mobile-sidebar {
  @apply fixed top-0 left-0 h-full w-4/5 max-w-xs border-r rounded-r-lg shadow-xl;
  transform: translateX(-100%);
}

.mobile-sidebar.open {
  transform: translateX(0);
}

/* Header */
.sidebar-header {
  @apply flex items-center justify-between p-4 border-b border-goblin-green bg-goblin-dark sticky top-0;
}

.close-button {
  @apply p-1 rounded-full hover:bg-goblin-green text-white;
  transform: none !important;
}

/* Content */
.sidebar-content {
  @apply flex-grow p-4;
}

/* Footer */
.sidebar-footer {
  @apply p-4 border-t border-goblin-green mt-auto;
}

/* Decorative elements */
.sidebar-container::before {
  content: '';
  @apply absolute top-0 right-0 w-1 h-full bg-goblin-green opacity-50;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 10px,
    rgba(139, 109, 92, 0.5) 10px,
    rgba(139, 109, 92, 0.5) 20px
  );
}
</style> 
