<script setup lang="ts">
import type { Goblin } from '../services/goblinGenerator'
import { onMounted, ref } from 'vue'
import DiceRoller from '../components/DiceRoller.vue'
import GoblinCard from '../components/GoblinCard.vue'
import { generateGoblinFromSeed } from '../services/goblinGenerator'

// Estado para armazenar a coleção de goblins
const goblinCollection = ref<Goblin[]>([])

// Estado para a seed que será adicionada
const newSeed = ref<string>('')

// Estado para mensagens de erro ou sucesso
const message = ref<string>('')
const isError = ref<boolean>(false)
const showMessage = ref<boolean>(false)

// Estado para controlar o modo de visualização (grid ou lista)
const viewMode = ref<'grid' | 'list'>('grid')

// Carregar coleção do localStorage ao montar o componente
onMounted(() => {
  loadCollection()
})

// Função para carregar a coleção do localStorage
function loadCollection() {
  const savedCollection = localStorage.getItem('goblinCollection')
  if (savedCollection) {
    try {
      const seeds = JSON.parse(savedCollection) as string[]
      goblinCollection.value = []

      // Gerar goblins a partir das seeds salvas
      let failedSeeds = 0
      seeds.forEach((seed) => {
        const goblin = generateGoblinFromSeed(seed)
        if (goblin) {
          goblinCollection.value.push(goblin)
        }
        else {
          failedSeeds++
        }
      })

      // Mostrar mensagem se alguma seed falhou
      if (failedSeeds > 0) {
        showErrorMessage(`Não foi possível carregar ${failedSeeds} goblin(s) da mesa`)
      }
    }
    catch (error) {
      console.error('Erro ao carregar a mesa de goblins:', error)
      showErrorMessage('Erro ao carregar a mesa de goblins')
    }
  }
}

// Função para adicionar um goblin à coleção
function addGoblinToCollection() {
  if (!newSeed.value.trim()) {
    showErrorMessage('Por favor, insira uma seed válida')
    return
  }

  // Verificar se a seed já existe na coleção
  const savedCollection = localStorage.getItem('goblinCollection')
  let seeds: string[] = []

  if (savedCollection) {
    try {
      seeds = JSON.parse(savedCollection)
    }
    catch (error) {
      console.error('Erro ao carregar a mesa:', error)
      seeds = []
    }
  }

  if (seeds.includes(newSeed.value)) {
    showErrorMessage('Este goblin já está na mesa')
    return
  }

  // Gerar goblin a partir da seed
  const goblin = generateGoblinFromSeed(newSeed.value)
  if (!goblin) {
    showErrorMessage('Seed inválida. Não foi possível gerar o goblin')
    return
  }

  // Adicionar goblin à coleção
  goblinCollection.value.push(goblin)

  // Adicionar a seed à coleção
  seeds.push(newSeed.value)
  localStorage.setItem('goblinCollection', JSON.stringify(seeds))

  // Limpar campo de input e mostrar mensagem de sucesso
  newSeed.value = ''
  showSuccessMessage('Goblin adicionado à mesa com sucesso!')
}

// Função para remover um goblin da coleção
function removeGoblinFromCollection(seed: string | undefined) {
  if (!seed)
    return

  // Remover o goblin da coleção em memória
  goblinCollection.value = goblinCollection.value.filter(goblin => goblin.seed !== seed)

  // Remover a seed da coleção no localStorage
  const savedCollection = localStorage.getItem('goblinCollection')
  if (savedCollection) {
    try {
      const seeds = JSON.parse(savedCollection) as string[]
      const updatedSeeds = seeds.filter(s => s !== seed)
      localStorage.setItem('goblinCollection', JSON.stringify(updatedSeeds))
    }
    catch (error) {
      console.error('Erro ao atualizar a mesa:', error)
    }
  }

  showSuccessMessage('Goblin removido da mesa')
}

// Função para limpar toda a coleção
function clearCollection() {
  if (confirm('Tem certeza que deseja limpar toda a mesa?')) {
    goblinCollection.value = []
    localStorage.removeItem('goblinCollection')
    showSuccessMessage('Mesa limpa com sucesso')
  }
}

// Funções para exibir mensagens
function showErrorMessage(msg: string) {
  message.value = msg
  isError.value = true
  showMessage.value = true
  setTimeout(() => {
    showMessage.value = false
  }, 3000)
}

function showSuccessMessage(msg: string) {
  message.value = msg
  isError.value = false
  showMessage.value = true
  setTimeout(() => {
    showMessage.value = false
  }, 3000)
}

// Função para alternar o modo de visualização
function toggleViewMode() {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}
</script>

<template>
  <div class="dm-view bg-goblin-dark min-h-screen p-4 text-white">
    <header class="mb-6">
      <h1 class="text-3xl font-bold text-goblin-green">
        Mesa do Mestre
      </h1>
      <p class="mt-2 text-goblin-brown">
        Gerencie sua partida de RPG, role dados e organize suas cartas de Goblins.
      </p>
    </header>
    <section class="mb-6">
      <DiceRoller />
    </section>
    <section class="bg-goblin-dark p-4 rounded-lg mb-6">
      <h2 class="text-xl text-white mb-3">
        Adicionar Goblin à Mesa
      </h2>
      <div class="flex flex-col md:flex-row gap-2">
        <input
          v-model="newSeed"
          type="text"
          placeholder="Cole a seed do goblin aqui"
          class="flex-grow p-2 rounded border border-goblin-brown bg-goblin-light text-goblin-dark"
        >
        <button
          class="bg-goblin-green hover:bg-goblin-brown text-white py-2 px-4 rounded transition-colors"
          @click="addGoblinToCollection"
        >
          Adicionar
        </button>
      </div>
    </section>
    <section>
      <div v-if="showMessage" class="mb-4 p-3 rounded-md transition-all duration-300" :class="isError ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'">
        {{ message }}
      </div>
      <div class="flex justify-between items-center mb-4">
        <div>
          <span class="text-goblin-brown">{{ goblinCollection.length }} goblins na mesa</span>
        </div>
        <div class="flex gap-2">
          <button
            class="bg-goblin-brown hover:bg-goblin-green text-white py-1 px-3 rounded-md text-sm transition-colors"
            @click="toggleViewMode"
          >
            <span v-if="viewMode === 'grid'">Visualizar em Lista</span>
            <span v-else>Visualizar em Grid</span>
          </button>
          <button
            class="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm transition-colors"
            :disabled="goblinCollection.length === 0"
            @click="clearCollection"
          >
            Limpar Mesa
          </button>
        </div>
      </div>
      <div v-if="goblinCollection.length === 0" class="text-center py-10 bg-parchment rounded-lg">
        <p class="text-goblin-dark text-xl">
          Nenhum goblin na mesa
        </p>
        <p class="text-goblin-brown mt-2">
          Adicione goblins usando as seeds geradas na página inicial
        </p>
      </div>
      <div v-else :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'">
        <div v-for="goblin in goblinCollection" :key="goblin.id" class="relative">
          <button
            class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
            title="Remover goblin"
            @click="removeGoblinFromCollection(goblin.seed)"
          >
            ×
          </button>
          <GoblinCard :goblin="goblin" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dm-view {
  /* Custom DM themed styles can be added here */
}

.goblin-ficha {
  background-color: rgba(0, 0, 0, 0.2);
}

.bg-parchment {
  background-color: #f5f0e6;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%238b6d5c' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
}
</style>
