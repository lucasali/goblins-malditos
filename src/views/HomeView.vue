<script setup lang="ts">
import type { Goblin } from '../types/goblin'
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import GoblinCard from '../components/GoblinCard.vue'
import { generateGoblin, generateGoblinFromSeed } from '../services/goblinGenerator'

const route = useRoute()
const router = useRouter()

const currentGoblin = ref<Goblin | null>(null)

onMounted(() => {
  const envApiKey = import.meta.env.VITE_OPENAI_API_KEY

  const savedApiKey = localStorage.getItem('openai_api_key')

  if (savedApiKey) {
    // apiKey.value = savedApiKey
  }
  else if (envApiKey) {
    localStorage.setItem('openai_api_key', envApiKey)
  }

  const seedFromUrl = route.query.seed as string
  if (seedFromUrl) {
    loadGoblinFromSeed(seedFromUrl)
  }
})

function shareGoblinLink() {
  if (!currentGoblin.value || !currentGoblin.value.seed)
    return

  // Criar a URL com a seed
  const url = `${window.location.origin}${window.location.pathname}?seed=${currentGoblin.value.seed}`

  // Copiar para a área de transferência
  navigator.clipboard.writeText(url)
    .then(() => {

    })
    .catch((err) => {
      console.error('Erro ao copiar URL: ', err)
    })
}

function generateNewGoblin() {
  // Adicionar uma pequena animação de tremor antes de gerar o goblin
  const appElement = document.getElementById('app')
  if (appElement) {
    appElement.classList.add('shake')
    setTimeout(() => {
      appElement.classList.remove('shake')
    }, 500)
  }

  // Gerar o goblin após um pequeno delay para a animação
  setTimeout(() => {
    currentGoblin.value = generateGoblin()

    // Atualizar a URL com a nova seed
    if (currentGoblin.value && currentGoblin.value.seed) {
      router.replace({ query: { seed: currentGoblin.value.seed } })
    }
  }, 300)
}

function loadGoblinFromSeed(seed: string) {
  try {
    const goblin = generateGoblinFromSeed(seed)
    if (goblin) {
      currentGoblin.value = goblin
    }
    else {
      // Se a seed for inválida, gerar um novo goblin
      generateNewGoblin()
    }
  }
  catch (error) {
    console.error('Erro ao carregar goblin da seed:', error)
    // Em caso de erro, gerar um novo goblin
    generateNewGoblin()
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <RouterLink to="/criar-mesa" class="goblin-button">
      Criar mesa online
    </RouterLink>
    <GoblinButton @click="generateNewGoblin">
      <i-game-icons-goblin width="24" height="24" />
    </GoblinButton>

    <p v-if="!currentGoblin" class="text-goblin-brown italic text-sm max-w-md text-center">
      Clique no botão acima para gerar um goblin aleatório para sua aventura.
      Cada goblin é único, caótico e provavelmente não vai durar muito tempo!
    </p>

    <transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 transform -rotate-3 scale-95"
      enter-to-class="opacity-100 transform rotate-1 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="currentGoblin" class="goblin-display flex flex-col items-center gap-12">
        <GoblinCard
          :goblin="currentGoblin"
          @share="shareGoblinLink"
        />
      </div>
    </transition>
  </div>
</template>
