<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api, useConvexMutation } from '../composables/useConvex'
import { useSession } from '../composables/useSession'

const router = useRouter()
const slug = ref(generateSlug())
const nicknameInput = ref('')
const errorMessage = ref('')

const { sessionId, saveNickname } = useSession(slug)
const convexEnabled = Boolean(import.meta.env.VITE_CONVEX_URL)
const isPending = ref(false)
let mutate: ((args: { slug: string, sessionId: string, nickname: string }) => Promise<any>) | null = null

if (convexEnabled) {
  const mutation = useConvexMutation(api.tables.createTable)
  mutate = mutation.mutate
  isPending.value = mutation.isPending
}

const slugPreview = computed(() => slug.value.trim().toLowerCase())

function generateSlug() {
  const fragment = Math.random().toString(36).slice(2, 8)
  return `mesa-${fragment}`
}

function regenerateSlug() {
  slug.value = generateSlug()
}

async function createTable() {
  errorMessage.value = ''
  const trimmedSlug = slugPreview.value
  const trimmedNickname = nicknameInput.value.trim()

  if (!trimmedSlug || trimmedSlug.length < 4) {
    errorMessage.value = 'Escolha uma slug válida para a mesa.'
    return
  }
  if (!trimmedNickname) {
    errorMessage.value = 'Digite um apelido para continuar.'
    return
  }

  if (!convexEnabled || !mutate) {
    errorMessage.value = 'Convex não está configurado. Defina VITE_CONVEX_URL.'
    return
  }

  try {
    slug.value = trimmedSlug
    await mutate({
      slug: trimmedSlug,
      sessionId: sessionId.value,
      nickname: trimmedNickname,
    })
    saveNickname(trimmedNickname)
    await router.push(`/mesa/${trimmedSlug}`)
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Erro ao criar mesa.'
  }
}
</script>

<template>
  <div class="w-full max-w-xl mx-auto bg-parchment-texture border-2 border-goblin-brown rounded-lg p-6 text-ink">
    <h1 class="font-goblin text-2xl mb-2">
      Criar mesa online
    </h1>
    <p class="text-sm text-goblin-gray mb-6">
      Gere uma mesa para convidar até 12 jogadores.
    </p>

    <label class="text-sm font-bold text-goblin-brown">Slug da mesa</label>
    <div class="flex gap-2 mt-2 mb-4">
      <input
        v-model="slug"
        class="flex-1 p-2 bg-white/70 border border-goblin-brown rounded"
        type="text"
      >
      <button class="goblin-button px-3" @click="regenerateSlug">
        Aleatória
      </button>
    </div>

    <label class="text-sm font-bold text-goblin-brown">Seu apelido</label>
    <input
      v-model="nicknameInput"
      class="w-full p-2 mt-2 mb-4 bg-white/70 border border-goblin-brown rounded"
      type="text"
      placeholder="Ex: Mestre Caótico"
    >

    <button class="w-full goblin-button" :disabled="isPending || !convexEnabled" @click="createTable">
      {{ isPending ? 'Criando...' : 'Criar mesa' }}
    </button>

    <p v-if="!convexEnabled" class="text-sm text-goblin-gray mt-3">
      Convex não está configurado. Defina `VITE_CONVEX_URL` no `.env`.
    </p>

    <p v-if="errorMessage" class="text-sm text-red-700 mt-3">
      {{ errorMessage }}
    </p>
  </div>
</template>
