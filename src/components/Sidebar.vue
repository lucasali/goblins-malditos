<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// Props
const props = defineProps<{
  isOpen: boolean
}>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// Router
const router = useRouter()

// State
const isMobile = ref(false)

// Check if the device is mobile
function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

// Close sidebar when clicking outside on mobile
function handleClickOutside(event: MouseEvent) {
  const sidebar = document.getElementById('goblin-sidebar')
  const target = event.target as HTMLElement

  if (isMobile.value && sidebar && !sidebar.contains(target) && props.isOpen) {
    emit('close')
  }
}

// Close sidebar
function closeSidebar() {
  emit('close')
}

// Navigate to a route and close sidebar on mobile devices
function navigateTo(route: string) {
  router.push(route)
  if (isMobile.value) {
    closeSidebar()
  }
}

// Lifecycle hooks
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div
    v-if="isMobile && isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
    @click="closeSidebar"
  />

  <aside
    id="goblin-sidebar"
    class="sidebar-container"
    :class="[
      isMobile ? 'mobile-sidebar' : 'desktop-sidebar',
      isOpen ? 'open' : 'closed',
    ]"
  >
    <div class="sidebar-header">
      <h2 class="text-xl">
        Menu
      </h2>
      <button
        class="close-button"
        aria-label="Fechar"
        @click="closeSidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <nav class="p-4 border-b border-goblin-green">
      <ul class="space-y-2">
        <li>
          <button
            class="w-full text-left px-4 py-2 rounded hover:bg-goblin-green text-white transition-colors flex items-center"
            @click="navigateTo('/')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Gerador de Goblins
          </button>
        </li>
        <li>
          <button
            class="w-full text-left px-4 py-2 rounded hover:bg-goblin-green text-white transition-colors flex items-center"
            @click="navigateTo('/mesa-do-mestre')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            Mesa do Mestre
          </button>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <p class="text-sm text-goblin-brown">
        Goblins Malditos &copy; 2023
      </p>
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
