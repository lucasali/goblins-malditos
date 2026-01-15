<script setup lang="ts">
import type { Player } from '../types/table'
import { computed } from 'vue'
import { generateGoblinFromSeed } from '../services/goblinGenerator'
import GoblinCard from './GoblinCard.vue'

const props = defineProps<{
  players: Player[]
  selectedPlayerId: string
  currentPlayerId: string
  isMaster: boolean
}>()

const emit = defineEmits<{
  (e: 'select', playerId: string): void
  (e: 'generate'): void
  (e: 'kick', playerId: string): void
}>()

const orderedPlayers = computed(() => {
  return [...props.players].sort((a, b) => a.joinedAt - b.joinedAt)
})

const selectedPlayer = computed(() => {
  return orderedPlayers.value.find(player => player._id === props.selectedPlayerId) ?? orderedPlayers.value[0] ?? null
})

const selectedIndex = computed(() => {
  if (!selectedPlayer.value) {
    return -1
  }
  return orderedPlayers.value.findIndex(player => player._id === selectedPlayer.value?._id)
})

const goblin = computed(() => {
  if (!selectedPlayer.value?.goblinSeed) {
    return null
  }
  return generateGoblinFromSeed(selectedPlayer.value.goblinSeed)
})

const isCurrentSelected = computed(() => {
  return selectedPlayer.value?._id === props.currentPlayerId
})

const canKickSelected = computed(() => {
  return Boolean(props.isMaster && selectedPlayer.value && selectedPlayer.value._id !== props.currentPlayerId)
})

function selectByIndex(index: number) {
  const player = orderedPlayers.value[index]
  if (player) {
    emit('select', player._id)
  }
}

function handlePrev() {
  const total = orderedPlayers.value.length
  if (total <= 1) {
    return
  }
  const currentIndex = selectedIndex.value >= 0 ? selectedIndex.value : 0
  const nextIndex = (currentIndex - 1 + total) % total
  selectByIndex(nextIndex)
}

function handleNext() {
  const total = orderedPlayers.value.length
  if (total <= 1) {
    return
  }
  const currentIndex = selectedIndex.value >= 0 ? selectedIndex.value : 0
  const nextIndex = (currentIndex + 1) % total
  selectByIndex(nextIndex)
}
</script>

<template>
  <div class="bg-parchment border-2 border-goblin-brown rounded-lg p-4">
    <div v-if="!orderedPlayers.length" class="text-goblin-gray italic">
      Nenhum jogador entrou na mesa ainda.
    </div>

    <div v-else class="flex flex-col gap-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-wider text-goblin-brown">
            Goblin de
          </p>
          <h2 class="font-goblin text-lg text-ink">
            {{ selectedPlayer?.nickname }}
          </h2>
          <div class="mt-1 flex gap-2 text-xs">
            <span v-if="selectedPlayer?.isMaster" class="rounded bg-goblin-green/20 px-2 py-0.5 text-goblin-green">
              Mestre
            </span>
            <span v-if="isCurrentSelected" class="rounded bg-goblin-brown/20 px-2 py-0.5 text-goblin-brown">
              Você
            </span>
          </div>
        </div>

        <button
          v-if="canKickSelected && selectedPlayer"
          type="button"
          class="text-xs !bg-transparent !px-0 !py-0 text-red-700 hover:text-red-900 !shadow-none !hover:scale-100 !hover:rotate-0"
          @click="emit('kick', selectedPlayer._id)"
        >
          Remover jogador
        </button>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="goblin-button px-3 py-2 text-lg"
          :disabled="orderedPlayers.length <= 1"
          @click="handlePrev"
        >
          ◀
        </button>
        <div class="flex-1">
          <GoblinCard v-if="goblin" :goblin="goblin" />
          <div v-else class="rounded-lg border-2 border-dashed border-goblin-brown/40 bg-parchment/60 p-8 text-center text-goblin-gray">
            <p class="text-sm italic">
              Nenhum goblin gerado ainda.
            </p>
            <button
              v-if="isCurrentSelected"
              type="button"
              class="goblin-button mt-4"
              @click="emit('generate')"
            >
              Gerar goblin
            </button>
          </div>
        </div>
        <button
          type="button"
          class="goblin-button px-3 py-2 text-lg"
          :disabled="orderedPlayers.length <= 1"
          @click="handleNext"
        >
          ▶
        </button>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-2">
        <button
          v-for="(player, index) in orderedPlayers"
          :key="player._id"
          type="button"
          class="h-2.5 w-2.5 rounded-full border-2"
          :class="player._id === selectedPlayerId ? 'border-goblin-green bg-goblin-green' : 'border-goblin-brown/50 bg-parchment/80'"
          :title="player.nickname"
          @click="selectByIndex(index)"
        />
      </div>

      <button
        v-if="isCurrentSelected && goblin"
        type="button"
        class="goblin-button mx-auto"
        @click="emit('generate')"
      >
        Gerar outro goblin
      </button>
    </div>
  </div>
</template>
