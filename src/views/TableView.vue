<script setup lang="ts">
import type { Player } from '../types/table'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import JoinTableModal from '../components/JoinTableModal.vue'
import PlayerGrid from '../components/PlayerGrid.vue'
import TableChat from '../components/TableChat.vue'
import TableDiceRoller from '../components/TableDiceRoller.vue'
import { api, useConvexMutation, useConvexQuery } from '../composables/useConvex'
import { useSession } from '../composables/useSession'
import { generateGoblin } from '../services/goblinGenerator'

const route = useRoute()
const slug = computed(() => String(route.params.slug || '').toLowerCase())

const { sessionId, nickname, saveNickname } = useSession(slug)
const convexEnabled = Boolean(import.meta.env.VITE_CONVEX_URL)

const errorMessage = ref('')
const hasJoined = ref(false)
const currentPlayerId = ref('')

const tableData = ref<any>(null)
const tablePending = ref(false)
if (convexEnabled) {
  const tableQuery = useConvexQuery(
    api.tables.getTableBySlug,
    computed(() => ({ slug: slug.value })),
  )
  tableData.value = tableQuery.data
  tablePending.value = tableQuery.isPending
}
const table = computed(() => (tableData.value || null) as { _id: string } | null)
const tableId = computed(() => table.value?._id || '')

const playersArgs = computed(() => ({ tableId: tableId.value || undefined }))
const messagesArgs = computed(() => ({ tableId: tableId.value || undefined }))
const rollsArgs = computed(() => ({ tableId: tableId.value || undefined }))

const playersData = ref<any[]>([])
const messagesData = ref<any[]>([])
const rollsData = ref<any[]>([])
if (convexEnabled) {
  const playersQuery = useConvexQuery(api.players.getTablePlayers, playersArgs)
  const messagesQuery = useConvexQuery(api.messages.getMessages, messagesArgs)
  const rollsQuery = useConvexQuery(api.diceRolls.getDiceRolls, rollsArgs)
  playersData.value = playersQuery.data
  messagesData.value = messagesQuery.data
  rollsData.value = rollsQuery.data
}

const players = computed(() => (playersData.value || []) as Player[])
const messages = computed(() => messagesData.value || [])
const rolls = computed(() => rollsData.value || [])

const currentPlayer = computed(() => {
  return (
    players.value.find(player => player._id === currentPlayerId.value)
    || players.value.find(player => player.sessionId === sessionId.value)
    || null
  )
})

const isMaster = computed(() => currentPlayer.value?.isMaster ?? false)

let joinTable = async () => null
let leaveTable = async () => null
let updateGoblin = async () => null
let kickPlayer = async () => null
let sendMessage = async () => null
let rollDice = async () => null

if (convexEnabled) {
  joinTable = useConvexMutation(api.players.joinTable).mutate
  leaveTable = useConvexMutation(api.players.leaveTable).mutate
  updateGoblin = useConvexMutation(api.players.updateGoblin).mutate
  kickPlayer = useConvexMutation(api.players.kickPlayer).mutate
  sendMessage = useConvexMutation(api.messages.sendMessage).mutate
  rollDice = useConvexMutation(api.diceRolls.rollDice).mutate
}

async function ensureJoin() {
  if (hasJoined.value || !nickname.value || !slug.value) {
    return
  }
  if (!convexEnabled) {
    errorMessage.value = 'Convex não está configurado. Defina VITE_CONVEX_URL.'
    return
  }

  try {
    const { result } = await joinTable({
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
    <div v-else class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div>
        <PlayerGrid
          :players="players"
          :current-player-id="currentPlayer?._id || ''"
          :is-master="isMaster"
          @generate="handleGenerateGoblin"
          @kick="handleKick"
        />
      </div>
      <div class="flex flex-col gap-4">
        <TableChat :messages="messages" @send="handleSendMessage" />
        <TableDiceRoller :rolls="rolls" @roll="handleRollDice" />
      </div>
    </div>
  </div>
</template>
