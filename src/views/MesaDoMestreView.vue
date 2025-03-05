<script setup lang="ts">
import { ref } from 'vue'
import DiceRoller from '../components/DiceRoller.vue'
import GoblinCard from '../components/GoblinCard.vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

const newSeed = ref<string>('')

const viewMode = ref<'grid' | 'list'>('grid')

function toggleViewMode() {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}
</script>

<template>
  <div class="bg-goblin-dark min-h-screen p-4 text-white">
    <header class="mb-6">
      <h1 class="text-3xl font-bold text-goblin-green">
        Mesa do Mestre
      </h1>

      <p class="mt-2 text-goblin-brown">
        Gerencie sua partida de RPG, adicione goblins à sua mesa e organize suas cartas.
      </p>
    </header>

    <section class="bg-goblin-dark p-5 rounded-lg mb-6 border border-goblin-brown">
      <h2 class="text-2xl text-goblin-green mb-3 font-bold">
        Adicionar Goblin à Mesa
      </h2>

      <div class="mb-3 text-goblin-brown text-sm">
        Para adicionar um goblin, copie a seed ou a URL completa da página inicial usando o botão "Compartilhar" e cole-a abaixo.
        O sistema detectará automaticamente se você colou uma URL ou apenas a seed.
      </div>

      <div class="bg-goblin-dark-lighter p-3 rounded mb-3 border border-goblin-brown border-opacity-30">
        <div class="text-xs text-goblin-brown mb-1">
          Como obter a seed:
        </div>

        <div class="flex items-center gap-2">
          <div class="bg-goblin-green text-white text-xs px-2 py-1 rounded">
            1
          </div>

          <span class="text-xs text-white">Vá para a página inicial e gere um goblin</span>
        </div>

        <div class="flex items-center gap-2 mt-1">
          <div class="bg-goblin-green text-white text-xs px-2 py-1 rounded">
            2
          </div>

          <span class="text-xs text-white">Clique no botão "Compartilhar" para copiar a URL ou seed</span>
        </div>

        <div class="flex items-center gap-2 mt-1">
          <div class="bg-goblin-green text-white text-xs px-2 py-1 rounded">
            3
          </div>

          <span class="text-xs text-white">Cole diretamente no campo abaixo (funciona com URL ou seed)</span>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-2">
        <input
          v-model="newSeed"
          type="text"
          placeholder="Cole a URL completa ou apenas a seed do goblin aqui"
          class="bg-parchment flex-grow p-3 rounded border border-goblin-brown bg-goblin-light text-goblin-dark text-lg"
        >

        <button
          class="bg-goblin-green hover:bg-goblin-brown text-white py-2 px-6 rounded transition-colors text-lg font-medium"
          @click="gameStore.addPlayer(newSeed)"
        >
          Adicionar
        </button>
      </div>

      <div class="mt-2 flex justify-between items-center">
        <span class="text-xs text-goblin-brown">
          Você pode colar a URL completa ou apenas a seed (código base64) do goblin. O sistema detectará automaticamente o formato.
        </span>
      </div>
    </section>

    <section class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-2xl text-goblin-green font-bold">
            Goblins na Mesa
          </h2>

          <span class="text-goblin-brown">{{ gameStore.players.length }} goblins disponíveis</span>
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
            :disabled="gameStore.players.length === 0"
            @click="gameStore.players = []"
          >
            Limpar Mesa
          </button>
        </div>
      </div>

      <div v-if="gameStore.players.length === 0" class="text-center py-10 bg-parchment rounded-lg">
        <p class="text-goblin-dark text-xl">
          Nenhum goblin na mesa
        </p>

        <p class="text-goblin-brown mt-2">
          Adicione goblins usando as seeds geradas na página inicial
        </p>
      </div>

      <div v-else :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'">
        <div v-for="goblin in gameStore.players" :key="goblin.id" class="relative">
          <button
            class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
            title="Remover goblin"
            @click="gameStore.removePlayer(goblin.id)"
          >
            ×
          </button>

          <GoblinCard :goblin="goblin" />
        </div>
      </div>
    </section>

    <section class="mt-8 bg-goblin-dark p-4 rounded-lg border border-goblin-brown opacity-90 hover:opacity-100 transition-opacity">
      <h2 class="text-xl text-goblin-green mb-3">
        Rolador de Dados
      </h2>

      <DiceRoller />
    </section>
  </div>
</template>
