<script setup lang="ts">
import type { Player } from '../types/table'
import { useConvexMutation, useConvexQuery } from 'convex-vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import GoblinCarousel from '../components/GoblinCarousel.vue'
import JoinTableModal from '../components/JoinTableModal.vue'
import PlayerSelector from '../components/PlayerSelector.vue'
import TableChat from '../components/TableChat.vue'
import TableDiceRoller from '../components/TableDiceRoller.vue'
import { useSession } from '../composables/useSession'
import { api } from '../convex/api'
import { generateGoblin } from '../services/goblinGenerator'

const route = useRoute()
const slug = computed(() => String(route.params.slug || '').toLowerCase())

const { sessionId, nickname, saveNickname } = useSession(slug)
const convexEnabled = Boolean(import.meta.env.VITE_CONVEX_URL)

const errorMessage = ref('')
const hasJoined = ref(false)
const currentPlayerId = ref('')

const { data: tableData, isPending: tablePending } = useConvexQuery(
  api.tables.getTableBySlug,
  computed(() => ({ slug: slug.value })),
)
const table = computed(() => (tableData.value ?? null) as { _id: string } | null)
const tableId = computed(() => table.value?._id || '')

const queryArgs = computed(() => ({ tableId: tableId.value || undefined }))
const { data: playersData } = useConvexQuery(api.players.getTablePlayers, queryArgs)
const { data: messagesData } = useConvexQuery(api.messages.getMessages, queryArgs)
const { data: rollsData } = useConvexQuery(api.diceRolls.getDiceRolls, queryArgs)

const players = computed(() => (playersData.value ?? []) as Player[])
const messages = computed(() => messagesData.value ?? [])
const rolls = computed(() => rollsData.value ?? [])

const currentPlayer = computed(() => {
  return (
    players.value.find(player => player._id === currentPlayerId.value)
    || players.value.find(player => player.sessionId === sessionId.value)
    || null
  )
})

const orderedPlayers = computed(() => {
  return [...players.value].sort((a, b) => a.joinedAt - b.joinedAt)
})

const selectedPlayerId = ref('')

const isMaster = computed(() => currentPlayer.value?.isMaster ?? false)

const { mutate: joinTable } = useConvexMutation(api.players.joinTable)
const { mutate: leaveTable } = useConvexMutation(api.players.leaveTable)
const { mutate: updateGoblin } = useConvexMutation(api.players.updateGoblin)
const { mutate: kickPlayer } = useConvexMutation(api.players.kickPlayer)
const { mutate: sendMessage } = useConvexMutation(api.messages.sendMessage)
const { mutate: rollDice } = useConvexMutation(api.diceRolls.rollDice)

async function ensureJoin() {
  if (hasJoined.value || !nickname.value || !slug.value) {
    return
  }
  if (!convexEnabled) {
    errorMessage.value = 'Convex não está configurado. Defina VITE_CONVEX_URL.'
    return
  }

  try {
    const result = await joinTable({
      slug: slug.value,
      sessionId: sessionId.value,
      nickname: nickname.value,
    })
    currentPlayerId.value = result?.playerId || ''
    hasJoined.value = true
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Erro ao entrar na mesa.'
  }
}

watch([nickname, slug], ensureJoin, { immediate: true })

watch([orderedPlayers, currentPlayer, currentPlayerId], () => {
  if (!orderedPlayers.value.length) {
    selectedPlayerId.value = ''
    return
  }
  const selectedExists = orderedPlayers.value.some(player => player._id === selectedPlayerId.value)
  if (!selectedExists) {
    const preferred = currentPlayer.value || orderedPlayers.value[0]
    selectedPlayerId.value = preferred?._id || ''
  }
}, { immediate: true })

async function handleGenerateGoblin() {
  if (!tableId.value) {
    return
  }
  const goblin = generateGoblin()
  await updateGoblin({
    tableId: tableId.value,
    sessionId: sessionId.value,
    goblinSeed: goblin.seed,
  })
}

async function handleKick(playerId: string) {
  if (!tableId.value) {
    return
  }
  await kickPlayer({
    tableId: tableId.value,
    sessionId: sessionId.value,
    playerId,
  })
}

async function handleSendMessage(content: string) {
  if (!tableId.value) {
    return
  }
  await sendMessage({
    tableId: tableId.value,
    sessionId: sessionId.value,
    content,
  })
}

async function handleRollDice(dice: string) {
  if (!tableId.value) {
    return
  }
  await rollDice({
    tableId: tableId.value,
    sessionId: sessionId.value,
    dice,
  })
}

function handleSubmitNickname(newNickname: string) {
  saveNickname(newNickname)
  ensureJoin()
}

function handleSelectPlayer(playerId: string) {
  selectedPlayerId.value = playerId
}

function handleUnload() {
  if (!tableId.value) {
    return
  }
  leaveTable({
    tableId: tableId.value,
    sessionId: sessionId.value,
  })
}

onMounted(() => window.addEventListener('beforeunload', handleUnload))
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleUnload)
  handleUnload()
})
</script>

<template>
  <div class="w-full">
    <JoinTableModal
      :open="!nickname && convexEnabled"
      :initial-nickname="nickname"
      @submit="handleSubmitNickname"
    />

    <div class="mb-6 flex flex-col gap-2 bg-parchment/90 rounded-lg p-4 border-2 border-goblin-brown/30">
      <h1 class="font-goblin text-2xl text-ink">
        Mesa: {{ slug }}
      </h1>
      <p class="text-sm text-goblin-gray">
        Compartilhe este link para convidar até 12 jogadores.
      </p>
    </div>

    <p v-if="!convexEnabled" class="text-sm text-goblin-gray mb-4">
      Convex não está configurado. Defina `VITE_CONVEX_URL` para usar a mesa online.
    </p>

    <p v-if="errorMessage" class="text-sm text-red-700 mb-4">
      {{ errorMessage }}
    </p>

    <div v-if="tablePending" class="text-goblin-gray italic">
      Carregando mesa...
    </div>
    <div v-else-if="!table" class="text-goblin-gray italic">
      Mesa não encontrada.
    </div>
    <div v-else class="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
      <div class="order-1 lg:order-none">
        <PlayerSelector
          :players="players"
          :selected-player-id="selectedPlayerId"
          :current-player-id="currentPlayer?._id || ''"
          @select="handleSelectPlayer"
        />
      </div>
      <div class="order-2 lg:order-none">
        <GoblinCarousel
          :players="players"
          :selected-player-id="selectedPlayerId"
          :current-player-id="currentPlayer?._id || ''"
          :is-master="isMaster"
          @select="handleSelectPlayer"
          @generate="handleGenerateGoblin"
          @kick="handleKick"
        />
      </div>
      <div class="order-3 lg:order-none flex flex-col gap-4">
        <TableChat :messages="messages" @send="handleSendMessage" />
        <TableDiceRoller :rolls="rolls" @roll="handleRollDice" />
      </div>
    </div>
  </div>
</template>
