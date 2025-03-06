<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'

interface Props {
  label?: string
}

defineProps<Props>()

const rotation = ref(0)
const isHovered: Ref<boolean> = ref(false)

function generateRandomRotation() {
  const randomValue = Math.random()
  if (randomValue < 0.5) {
    rotation.value = Math.floor(Math.random() * 5) - 15 // Random value between -20 and -10
  }
  else {
    rotation.value = Math.floor(Math.random() * 5) + 15 // Random value between 10 and 20
  }
}

function handleMouseEnter() {
  isHovered.value = true
  generateRandomRotation()
}

function handleMouseLeave() {
  isHovered.value = false
  rotation.value = 0
}
</script>

<template>
  <button
    class="inline-flex items-center gap-2 font-goblin bg-goblin-green hover:bg-goblin-brown text-white font-bold py-2 px-3 rounded-lg shadow-md transition-all duration-300 transform"
    :style="{ transform: `rotate(${rotation}deg) scale(${isHovered ? 1.2 : 1})` }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot>
      {{ label }}
    </slot>
  </button>
</template>
