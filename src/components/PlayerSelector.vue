<script setup lang="ts">
import type { Player } from '../types/table'
import { computed } from 'vue'

const props = defineProps<{
  players: Player[]
  selectedPlayerId: string
  currentPlayerId: string
}>()

const emit = defineEmits<{
  (e: 'select', playerId: string): void
}>()

const orderedPlayers = computed(() => {
  return [...props.players].sort((a, b) => a.joinedAt - b.joinedAt)
})

const slots = computed(() => {
  const list = orderedPlayers.value.slice(0, 12)
  const emptySlots = Array.from({ length: Math.max(0, 12 - list.length) }, () => null)
  return [...list, ...emptySlots]
})

function getInitial(nickname: string) {
  return nickname?.trim().charAt(0)?.toUpperCase() || '?'
}

function isSelected(player: Player) {
  return player._id === props.selectedPlayerId
}
</script>

<template>
  <div class="bg-parchment border-2 border-goblin-brown rounded-lg p-4">
    <h3 class="font-goblin text-lg text-ink mb-3">
      Jogadores
    </h3>
    <div class="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
      <div v-for="(slot, index) in slots" :key="index" class="min-w-[72px]">
        <button
          v-if="slot"
          type="button"
          class="group flex w-full flex-col items-center gap-2 rounded-md !bg-transparent !p-0 !shadow-none !hover:scale-100 !hover:rotate-0"
          :class="isSelected(slot) ? 'text-ink' : 'text-goblin-gray'"
          @click="emit('select', slot._id)"
        >
          <div
            class="relative flex h-12 w-12 items-center justify-center rounded-full border-2 font-goblin text-lg"
            :class="isSelected(slot) ? 'border-goblin-green bg-parchment shadow' : 'border-goblin-brown/40 bg-parchment/60'"
          >
            <span>{{ getInitial(slot.nickname) }}</span>
            <span
              v-if="slot.isMaster"
              class="absolute -right-1 -top-1 rounded-full bg-goblin-green px-1 text-[9px] font-bold text-white"
            >
              M
            </span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <span class="max-w-[72px] truncate text-xs font-bold">
              {{ slot.nickname }}
            </span>
            <div class="flex gap-1 text-[10px] uppercase">
              <span
                v-if="slot._id === currentPlayerId"
                class="rounded bg-goblin-brown/20 px-1 text-goblin-brown"
              >
                Você
              </span>
              <span
                v-if="slot.isMaster"
                class="rounded bg-goblin-green/20 px-1 text-goblin-green"
              >
                Mestre
              </span>
            </div>
          </div>
        </button>

        <div
          v-else
          class="flex flex-col items-center gap-2 text-goblin-gray"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-goblin-brown/40">
            <span class="text-xs">+</span>
          </div>
          <span class="text-[11px] italic">
            Vaga
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
