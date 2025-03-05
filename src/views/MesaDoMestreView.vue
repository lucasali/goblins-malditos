<script setup lang="ts">
import type { Goblin } from '../services/goblinGenerator'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DiceRoller from '../components/DiceRoller.vue'
import GoblinCard from '../components/GoblinCard.vue'
import { generateGoblinFromSeed } from '../services/goblinGenerator'

// Router para navegação
const router = useRouter()

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

// Estado para o modal de confirmação
const showConfirmModal = ref<boolean>(false)
const confirmAction = ref<() => void>(() => {})
const confirmMessage = ref<string>('')

// Estado para o modal de extração de URL
const showUrlModal = ref<boolean>(false)
const urlInput = ref<string>('')

// Carregar coleção do localStorage ao montar o componente
onMounted(() => {
  loadCollection()
})

// Função para navegar para a página inicial
function navigateToHome() {
  router.push('/')
}

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

// Função para verificar se uma string é uma seed válida
function isValidSeed(seed: string): boolean {
  // Verificar se a seed parece estar no formato base64
  // Tornando a validação menos restritiva para acomodar possíveis variações
  const base64Regex = /^[\w+/=-]+$/
  if (!base64Regex.test(seed)) {
    console.log('Seed falhou na validação regex base64:', `${seed.substring(0, 30)}...`)
    return false
  }

  try {
    // Tentar decodificar a seed
    const decodedSeed = atob(seed)

    // Verificar se o resultado é um JSON válido
    const goblinData = JSON.parse(decodedSeed)

    // Verificar se o objeto tem pelo menos algumas propriedades básicas de um goblin
    // Tornando a validação menos restritiva
    const isValid = (
      typeof goblinData === 'object'
      && goblinData !== null
      && 'name' in goblinData // Verificar apenas se tem a propriedade name
    )

    if (!isValid) {
      console.log('Seed falhou na validação de estrutura:', goblinData)
    }
    else {
      console.log('Seed válida:', `${seed.substring(0, 20)}...`)
    }

    return isValid
  }
  catch (error) {
    console.error('Erro ao validar seed:', error)
    return false
  }
}

// Função para extrair seed de uma string que pode ser URL ou seed direta
function extractSeedFromString(input: string): string | null {
  console.log('Tentando extrair seed de:', `${input.substring(0, 30)}...`)

  // Verificar se a entrada parece ser uma URL
  if (input.includes('http') && input.includes('seed=')) {
    try {
      // Tentar extrair a seed da URL
      const urlObj = new URL(input)
      const seed = urlObj.searchParams.get('seed')

      if (seed) {
        // Garantir que a seed não tenha caracteres de URL encoding
        const decodedSeed = decodeURIComponent(seed)
        console.log('Seed extraída e decodificada da URL:', `${decodedSeed.substring(0, 20)}...`)
        return decodedSeed
      }
      return null
    }
    catch (error) {
      console.error('Erro ao extrair seed da URL:', error)
      // Se falhar ao analisar como URL, retornar a entrada original
      return null
    }
  }

  // Se não for uma URL, retornar a entrada original
  return input
}

// Função para adicionar um goblin à coleção
function addGoblinToCollection() {
  if (!newSeed.value.trim()) {
    showErrorMessage('Por favor, insira uma seed válida')
    return
  }

  console.log('Entrada original:', `${newSeed.value.substring(0, 30)}...`)

  // Verificar se o usuário colou uma URL em vez da seed
  const extractedSeed = extractSeedFromString(newSeed.value)

  if (!extractedSeed) {
    showErrorMessage('Não foi possível extrair uma seed válida da entrada fornecida')
    return
  }

  if (extractedSeed !== newSeed.value) {
    console.log('Seed extraída da URL:', `${extractedSeed.substring(0, 20)}...`)
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

  if (seeds.includes(extractedSeed)) {
    showErrorMessage('Este goblin já está na mesa')
    return
  }

  // Verificar se a seed é válida antes de tentar gerar o goblin
  if (!isValidSeed(extractedSeed)) {
    showErrorMessage('A seed fornecida não é válida. Verifique se você copiou corretamente.')
    console.error('Seed inválida:', `${extractedSeed.substring(0, 30)}...`)
    return
  }

  // Tentar gerar o goblin diretamente
  try {
    const goblin = generateGoblinFromSeed(extractedSeed)

    if (goblin) {
      console.log('Goblin gerado com sucesso:', goblin.name)

      // Adicionar goblin à coleção
      goblinCollection.value.push(goblin)

      // Adicionar a seed à coleção
      seeds.push(extractedSeed)
      localStorage.setItem('goblinCollection', JSON.stringify(seeds))

      // Limpar campo de input e mostrar mensagem de sucesso
      newSeed.value = ''
      showSuccessMessage('Goblin adicionado à mesa com sucesso!')
    }
    else {
      console.error('Falha ao gerar goblin a partir da seed')
      showErrorMessage('Não foi possível gerar um goblin a partir desta seed. Verifique se a seed está completa.')
    }
  }
  catch (error) {
    console.error('Erro ao processar a seed:', error)
    showErrorMessage('Ocorreu um erro ao processar a seed. Verifique se ela está completa e correta.')
  }
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

// Função para mostrar o modal de confirmação
function showConfirm(message: string, action: () => void) {
  confirmMessage.value = message
  confirmAction.value = action
  showConfirmModal.value = true
}

// Função para limpar toda a coleção
function clearCollection() {
  showConfirm('Tem certeza que deseja limpar toda a mesa?', () => {
    goblinCollection.value = []
    localStorage.removeItem('goblinCollection')
    showSuccessMessage('Mesa limpa com sucesso')
    showConfirmModal.value = false
  })
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

// Função para mostrar o modal de extração de URL
function showExtractUrlModal() {
  urlInput.value = ''
  showUrlModal.value = true
}

// Função para extrair a seed da URL
function extractSeedFromUrl() {
  if (!urlInput.value) {
    showErrorMessage('Por favor, insira uma URL válida')
    return
  }

  try {
    // Tentar extrair a seed da URL
    const urlObj = new URL(urlInput.value)
    const seed = urlObj.searchParams.get('seed')

    if (seed) {
      // Decodificar a seed para garantir que não tenha caracteres de URL encoding
      const decodedSeed = decodeURIComponent(seed)
      newSeed.value = decodedSeed
      console.log('Seed extraída e decodificada da URL:', `${decodedSeed.substring(0, 20)}...`)
      showSuccessMessage('Seed extraída com sucesso!')
      showUrlModal.value = false
    }
    else {
      showErrorMessage('Não foi possível encontrar uma seed na URL fornecida')
    }
  }
  catch (error) {
    console.error('Erro ao extrair seed da URL:', error)
    showErrorMessage('URL inválida. Certifique-se de colar a URL completa.')
  }
}
</script>

<template>
  <div class="dm-view bg-goblin-dark min-h-screen p-4 text-white">
    <header class="mb-6">
      <h1 class="text-3xl font-bold text-goblin-green">
        Mesa do Mestre
      </h1>
      <p class="mt-2 text-goblin-brown">
        Gerencie sua partida de RPG, adicione goblins à sua mesa e organize suas cartas.
      </p>
    </header>

    <!-- Seção de adicionar goblin com destaque -->
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
        <div class="mt-2 pt-2 border-t border-goblin-brown border-opacity-30">
          <button
            class="text-xs bg-goblin-brown hover:bg-goblin-green text-white py-1 px-2 rounded transition-colors"
            @click="showExtractUrlModal"
          >
            Extrair seed de uma URL
          </button>
          <span class="text-xs text-goblin-brown ml-2">Método alternativo para extrair a seed de uma URL</span>
        </div>
      </div>
      <div class="flex flex-col md:flex-row gap-2">
        <input
          v-model="newSeed"
          type="text"
          placeholder="Cole a URL completa ou apenas a seed do goblin aqui"
          class="flex-grow p-3 rounded border border-goblin-brown bg-goblin-light text-goblin-dark text-lg"
        >
        <button
          class="bg-goblin-green hover:bg-goblin-brown text-white py-2 px-6 rounded transition-colors text-lg font-medium"
          @click="addGoblinToCollection"
        >
          Adicionar
        </button>
      </div>
      <div class="mt-2 flex justify-between items-center">
        <span class="text-xs text-goblin-brown">
          Você pode colar a URL completa ou apenas a seed (código base64) do goblin. O sistema detectará automaticamente o formato.
        </span>
        <button
          class="text-goblin-green hover:text-goblin-brown text-sm underline transition-colors"
          @click="navigateToHome"
        >
          Ir para página inicial e gerar novos goblins
        </button>
      </div>
    </section>

    <!-- Mensagens de feedback -->
    <div v-if="showMessage" class="mb-4 p-3 rounded-md transition-all duration-300" :class="isError ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'">
      {{ message }}
    </div>

    <!-- Coleção de goblins com controles -->
    <section class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-2xl text-goblin-green font-bold">
            Goblins na Mesa
          </h2>
          <span class="text-goblin-brown">{{ goblinCollection.length }} goblins disponíveis</span>
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

      <!-- Exibição da coleção de goblins -->
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

    <!-- Rolador de dados movido para o final -->
    <section class="mt-8 bg-goblin-dark p-4 rounded-lg border border-goblin-brown opacity-90 hover:opacity-100 transition-opacity">
      <h2 class="text-xl text-goblin-green mb-3">
        Rolador de Dados
      </h2>
      <DiceRoller />
    </section>

    <!-- Modal de confirmação -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-goblin-light p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-xl text-goblin-dark font-bold mb-4">
          Confirmação
        </h3>
        <p class="text-goblin-dark mb-6">
          {{ confirmMessage }}
        </p>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 bg-gray-300 text-goblin-dark rounded hover:bg-gray-400 transition-colors"
            @click="showConfirmModal = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            @click="confirmAction"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de extração de URL -->
    <div v-if="showUrlModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-goblin-light p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-xl text-goblin-dark font-bold mb-4">
          Extrair Seed de uma URL
        </h3>
        <p class="text-goblin-dark text-sm mb-4">
          Cole a URL completa do goblin abaixo. O sistema extrairá automaticamente a seed da URL.
          <br><br>
          <strong>Nota:</strong> Normalmente você pode colar a URL diretamente no campo principal sem precisar usar esta ferramenta.
          Este método alternativo é útil apenas em casos específicos.
        </p>
        <input
          v-model="urlInput"
          type="text"
          placeholder="Cole a URL completa do goblin aqui (ex: http://localhost:5173/?seed=...)"
          class="w-full p-3 rounded border border-goblin-brown bg-white text-goblin-dark text-lg mb-4"
        >
        <div class="mt-2 flex justify-end gap-3">
          <button
            class="px-4 py-2 bg-gray-300 text-goblin-dark rounded hover:bg-gray-400 transition-colors"
            @click="showUrlModal = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-goblin-green text-white rounded hover:bg-goblin-brown transition-colors"
            @click="extractSeedFromUrl"
          >
            Extrair Seed
          </button>
        </div>
      </div>
    </div>
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

.bg-goblin-dark-lighter {
  background-color: rgba(30, 30, 30, 0.5);
}
</style>
