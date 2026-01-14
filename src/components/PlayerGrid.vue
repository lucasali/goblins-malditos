<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '../types/table'
import PlayerCard from './PlayerCard.vue'

const props = defineProps<{
  players: Player[]
  currentPlayerId: string
  isMaster: boolean
}>()

const emit = defineEmits<{
  (e: 'generate'): void
  (e: 'kick', playerId: string): void
}>()

const orderedPlayers = computed(() => {
  return [...props.players].sort((a, b) => a.joinedAt - b.joinedAt)
})

const slots = computed(() => {
  const list = orderedPlayers.value.slice(0, 12)
  const emptySlots = Array.from({ length: Math.max(0, 12 - list.length) }, () => null)
  return [...list, ...emptySlots]
})
</script>

<template>
  <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <div v-for="(slot, index) in slots" :key="index">
      <PlayerCard
        v-if="slot"
        :player="slot"
        :is-current="slot._id === currentPlayerId"
        :can-kick="isMaster && slot._id !== currentPlayerId"
        @generate="$emit('generate')"
        @kick="$emit('kick', $event)"
      />
      <div
        v-else
        class="h-full min-h-[200px] border-2 border-dashed border-goblin-brown/50 rounded-lg flex items-center justify-center text-goblin-gray italic bg-parchment/60"
      >
        Vaga disponível
      </div>
    </div>
  </div>
</template>
