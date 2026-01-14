<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '../types/table'
import { generateGoblinFromSeed } from '../services/goblinGenerator'

const props = defineProps<{
  player: Player
  isCurrent: boolean
  canKick: boolean
}>()

const emit = defineEmits<{
  (e: 'generate'): void
  (e: 'kick', playerId: string): void
}>()

const goblin = computed(() => {
  if (!props.player.goblinSeed) {
    return null
  }
  return generateGoblinFromSeed(props.player.goblinSeed)
})

function handleKick() {
  emit('kick', props.player._id)
}
</script>

<template>
  <div class="bg-parchment border-2 border-goblin-brown rounded-lg p-4 text-ink shadow">
    <div class="flex items-start justify-between gap-2">
      <div>
        <p class="font-goblin text-sm uppercase tracking-wider text-goblin-brown">
          {{ player.nickname }}
        </p>
        <p v-if="player.isMaster" class="text-xs text-goblin-green font-bold">
          Mestre
        </p>
      </div>
      <button
        v-if="canKick"
        class="text-xs text-red-700 hover:text-red-900"
        @click="handleKick"
      >
        Remover
      </button>
    </div>

    <div v-if="goblin" class="mt-3 space-y-1">
      <h3 class="font-goblin text-lg">
        {{ goblin.name }}
      </h3>
      <p class="text-sm text-goblin-gray">
        {{ goblin.occupation }} • {{ goblin.describer }}
      </p>
      <div class="grid grid-cols-2 gap-2 text-xs mt-2">
        <span>CMB: {{ goblin.attributes.combate }}</span>
        <span>HAB: {{ goblin.attributes.habilidade }}</span>
        <span>NOÇ: {{ goblin.attributes.noção }}</span>
        <span>VIT: {{ goblin.attributes.vitalidade }}</span>
      </div>
    </div>

    <div v-else class="mt-4 text-sm italic text-goblin-gray">
      Nenhum goblin gerado ainda.
    </div>

    <button
      v-if="isCurrent"
      class="mt-4 w-full goblin-button"
      @click="$emit('generate')"
    >
      {{ goblin ? 'Gerar outro goblin' : 'Gerar goblin' }}
    </button>
  </div>
</template>
