<script setup lang="ts">
import type { Goblin } from '../services/goblinGenerator'
import { computed, defineAsyncComponent, ref } from 'vue'
import { armorIconMap, weaponIconMap } from '../data/iconMaps'

const props = defineProps<{
  goblin: Goblin
}>()

defineEmits<{
  (e: 'share'): void
}>()

// Map of all icon components used
const iconComponents: Record<string, any> = {
  // Weapons
  'sacrificial-dagger': defineAsyncComponent(() => import('~icons/game-icons/sacrificial-dagger')),
  'bow-arrow': defineAsyncComponent(() => import('~icons/game-icons/bow-arrow')),
  'blunderbuss': defineAsyncComponent(() => import('~icons/game-icons/blunderbuss')),
  'crossbow': defineAsyncComponent(() => import('~icons/game-icons/crossbow')),
  'wizard-staff': defineAsyncComponent(() => import('~icons/game-icons/wizard-staff')),
  'wood-club': defineAsyncComponent(() => import('~icons/game-icons/wood-club')),
  'broadsword': defineAsyncComponent(() => import('~icons/game-icons/broadsword')),
  'rusty-sword': defineAsyncComponent(() => import('~icons/game-icons/rusty-sword')),
  'rune-sword': defineAsyncComponent(() => import('~icons/game-icons/rune-sword')),
  'slingshot': defineAsyncComponent(() => import('~icons/game-icons/slingshot')),
  'bone-knife': defineAsyncComponent(() => import('~icons/game-icons/bone-knife')),
  'pitchfork': defineAsyncComponent(() => import('~icons/game-icons/pitchfork')),
  'scythe': defineAsyncComponent(() => import('~icons/game-icons/scythe')),
  'spear-feather': defineAsyncComponent(() => import('~icons/game-icons/spear-feather')),
  'battle-axe': defineAsyncComponent(() => import('~icons/game-icons/battle-axe')),
  'wood-axe': defineAsyncComponent(() => import('~icons/game-icons/wood-axe')),
  'warhammer': defineAsyncComponent(() => import('~icons/game-icons/warhammer')),
  'crossed-pistols': defineAsyncComponent(() => import('~icons/game-icons/crossed-pistols')),
  'two-handed-sword': defineAsyncComponent(() => import('~icons/game-icons/two-handed-sword')),
  'lunar-wand': defineAsyncComponent(() => import('~icons/game-icons/lunar-wand')),
  'magic-broom': defineAsyncComponent(() => import('~icons/game-icons/magic-broom')),

  // Armor
  'round-shield': defineAsyncComponent(() => import('~icons/game-icons/round-shield')),
  'loincloth': defineAsyncComponent(() => import('~icons/game-icons/loincloth')),
  'outback-hat': defineAsyncComponent(() => import('~icons/game-icons/outback-hat')),
  'chain-mail': defineAsyncComponent(() => import('~icons/game-icons/chain-mail')),
  'viking-helmet': defineAsyncComponent(() => import('~icons/game-icons/viking-helmet')),
  'dragon-shield': defineAsyncComponent(() => import('~icons/game-icons/dragon-shield')),
  'cooking-pot': defineAsyncComponent(() => import('~icons/game-icons/cooking-pot')),
  'breastplate': defineAsyncComponent(() => import('~icons/game-icons/breastplate')),
  'empty-wood-bucket-handle': defineAsyncComponent(() => import('~icons/game-icons/empty-wood-bucket-handle')),
  'opened-food-can': defineAsyncComponent(() => import('~icons/game-icons/opened-food-can')),
}

const getWeaponIcon = computed(() => {
  const iconName = weaponIconMap[props.goblin.equipment.weapon]
  return iconName ? iconComponents[iconName] : null
})

const getArmorIcon = computed(() => {
  const iconName = armorIconMap[props.goblin.equipment.armor]
  return iconName ? iconComponents[iconName] : null
})

const apiKey = ref<string>(localStorage.getItem('openai_api_key') || '')
const showApiConfig = ref<boolean>(false)

// 3D Perspective Logic
const cardElement = ref<HTMLElement | null>(null)
const rotationX = ref(0)
const rotationY = ref(0)

function handleMouseMove(e: MouseEvent) {
  if (!cardElement.value)
    return

  const rect = cardElement.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = ((y - centerY) / centerY) * -10 // Max 10 deg rotation
  const rotateY = ((x - centerX) / centerX) * 10

  rotationX.value = rotateX
  rotationY.value = rotateY
}

function resetTilt() {
  rotationX.value = 0
  rotationY.value = 0
}

const cardStyle = computed(() => {
  return {
    transform: `perspective(1000px) rotateX(${rotationX.value}deg) rotateY(${rotationY.value}deg)`,
    backgroundImage: `url('/src/assets/card.png')`,
    backgroundSize: '100% 100%',
  }
})

function saveApiKey() {
  localStorage.setItem('openai_api_key', apiKey.value)
  showApiConfig.value = false
}
</script>

<template>
  <div class="perspective-container w-full max-w-md mx-auto" @mousemove="handleMouseMove" @mouseleave="resetTilt">
    <!-- API Config Modal/Panel -->
    <div v-if="showApiConfig" class="absolute -right-80 top-0 w-72 bg-parchment-texture p-4 rounded border-2 border-goblin-brown shadow-xl z-50 text-ink font-parchment">
      <h3 class="font-goblin text-lg mb-2">
        Configuração API
      </h3>
      <input
        v-model="apiKey"
        type="password"
        placeholder="OpenAI API Key"
        class="w-full p-2 mb-2 bg-white bg-opacity-50 border border-goblin-brown rounded"
      >
      <button class="w-full text-sm" @click="saveApiKey">
        Salvar
      </button>
    </div>

    <!-- THE CARD -->
    <div
      ref="cardElement"
      class="goblin-card relative transition-transform duration-100 ease-out overflow-hidden"
      :style="cardStyle"
    >
      <div class="card-content p-12 h-full flex flex-col gap-4">
        <!-- Header: Name -->
        <div class="text-center border-b-2 border-goblin-brown pb-2">
          <h2 class="text-3xl font-goblin text-ink tracking-widest uppercase">
            {{ goblin.name }}
          </h2>
        </div>

        <!-- Image Area -->
        <!-- <div class="card-image-area relative bg-goblin-dark bg-opacity-10 rounded-lg border-2 border-goblin-brown overflow-hidden min-h-[200px]" /> -->

        <!-- Occupation & Stats Grid -->
        <div class="grid grid-cols-2 gap-4 border-b-2 border-goblin-brown pb-4">
          <div class="flex flex-col justify-center">
            <span class="font-goblin text-xs text-goblin-brown uppercase tracking-wider">Classe</span>
            <span class="font-parchment text-xl text-ink font-bold leading-tight">{{ goblin.occupation }}</span>
            <span class="text-xs italic text-goblin-gray mt-1">{{ goblin.describer }}</span>
          </div>

          <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-sm border-l-2 border-goblin-brown pl-4">
            <div class="flex items-center justify-between">
              <span class="font-bold text-goblin-brown">CMB:</span>
              <span class="font-goblin text-ink">{{ goblin.attributes.combate }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-bold text-goblin-brown">HAB:</span>
              <span class="font-goblin text-ink">{{ goblin.attributes.habilidade }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-bold text-goblin-brown">NOÇ:</span>
              <span class="font-goblin text-ink">{{ goblin.attributes.noção }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-bold text-goblin-brown">VIT:</span>
              <span class="font-goblin text-ink">{{ goblin.attributes.vitalidade }}</span>
            </div>
          </div>
        </div>

        <!-- Equipment -->
        <div class="flex flex-col gap-2">
          <h3 class="font-goblin text-sm text-goblin-brown uppercase border-b border-goblin-brown border-opacity-30">
            Equipamento
          </h3>
          <div class="flex items-start gap-3">
            <!-- Placeholder Icon for weapon -->
            <div class="w-12 h-12 bg-goblin-brown bg-opacity-20 rounded flex items-center justify-center flex-shrink-0">
              <component :is="getWeaponIcon" v-if="getWeaponIcon" class="text-goblin-brown text-2xl" />
              <span v-else class="material-icons text-goblin-brown text-2xl">swords</span>
            </div>
            <div class="flex flex-col">
              <span class="font-parchment font-bold text-ink">{{ goblin.equipment.weapon }}</span>
              <span v-if="goblin.equipment.weaponDetails" class="text-xs text-goblin-gray italic">
                {{ goblin.equipment.weaponDetails.ataque }} ({{ goblin.equipment.weaponDetails.uso }})
              </span>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 bg-goblin-brown bg-opacity-20 rounded flex items-center justify-center flex-shrink-0">
              <component :is="getArmorIcon" v-if="getArmorIcon" class="text-goblin-brown text-2xl" />
              <span v-else class="material-icons text-goblin-brown text-2xl">shield</span>
            </div>
            <div class="flex flex-col">
              <span class="font-parchment font-bold text-ink">{{ goblin.equipment.armor }}</span>
              <span v-if="goblin.equipment.armorDetails" class="text-xs text-goblin-gray italic">
                Dur: {{ goblin.equipment.armorDetails.durabilidade }}
              </span>
            </div>
          </div>
        </div>

        <!-- Special Ability -->
        <div class="mt-auto bg-goblin-brown bg-opacity-10 p-3 rounded border border-goblin-brown border-opacity-30">
          <h3 class="font-goblin text-sm text-goblin-green uppercase mb-1">
            Habilidade Especial: {{ goblin.technique.title }}
          </h3>
          <p class="font-parchment text-sm text-ink leading-snug">
            {{ goblin.technique.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-container {
  perspective: 1000px;
}

.goblin-card {
  /* Aspect ratio of a typical playing card ~ 2.5 : 3.5 or 63x88mm */
  aspect-ratio: 2.5 / 3.5;
  transform-style: preserve-3d;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.6));
}

/* Smooth out the movement just a bit */
.goblin-card {
  will-change: transform;
}

/* Adjust layout for very small screens if necessary */
@media (max-width: 480px) {
  .goblin-card {
    aspect-ratio: auto;
    min-height: 600px;
  }
}

/* Deep styling for GoblinImage component to fit the card theme */
:deep(.goblin-image) {
  border: none !important;
  box-shadow: none !important;
  transform: none !important; /* Disable the rotation in GoblinImage */
  border-radius: 0.5rem;
  filter: sepia(0.3) contrast(1.1); /* Give it a slight vintage look */
}

:deep(.image-controls) {
  opacity: 0;
  transition: opacity 0.3s;
}

:deep(.card-image-area:hover .image-controls) {
  opacity: 1;
}

:deep(.no-image-container) {
  background: transparent !important;
  border: none !important;
  min-height: 200px !important;
}

:deep(.goblin-button) {
  font-family: 'Cinzel', serif;
  background-color: #4a6741 !important;
  color: #f5e8c9 !important;
  border: 2px solid #2c3e2e;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
