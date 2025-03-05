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
        <i class="material-icons">close</i>
      </button>
    </div>

    <nav class="p-4 border-b border-goblin-green">
      <ul class="space-y-2">
        <li>
          <button
            class="w-full text-left px-4 py-2 rounded hover:bg-goblin-green text-white transition-colors flex items-center"
            @click="navigateTo('/')"
          >
            <i class="material-icons mr-2">home</i>
            Gerador de Goblins
          </button>
        </li>
        <li>
          <button
            class="w-full text-left px-4 py-2 rounded hover:bg-goblin-green text-white transition-colors flex items-center"
            @click="navigateTo('/mesa-do-mestre')"
          >
            <i class="material-icons mr-2">dashboard</i>
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

.material-icons {
  font-size: 24px;
  vertical-align: middle;
}

.close-button .material-icons {
  font-size: 24px;
}
</style>
