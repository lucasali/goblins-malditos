<script setup lang="ts">
import type { Goblin } from '../services/goblinGenerator'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GoblinCard from '../components/GoblinCard.vue'
import GoblinImage from '../components/GoblinImage.vue'
import { generateGoblin, generateGoblinFromSeed } from '../services/goblinGenerator'

// Obter a rota e o router para manipular a URL
const route = useRoute()
const router = useRouter()

// Estado para armazenar o goblin atual
const currentGoblin = ref<Goblin | null>(null)

// Estado para controlar se os atributos podem ser editados
const canEditAttributes = ref<boolean>(false)

// Estado para mensagens de compartilhamento
const shareMessage = ref<string>('')
const showShareMessage = ref<boolean>(false)

// Inicializar a chave da API e verificar se há uma seed na URL
onMounted(() => {
  // Verificar se há uma chave de API no ambiente
  const envApiKey = import.meta.env.VITE_OPENAI_API_KEY

  // Verificar se há uma chave de API salva no localStorage
  const savedApiKey = localStorage.getItem('openai_api_key')

  // Priorizar a chave do localStorage, depois a do ambiente
  if (savedApiKey) {
    // apiKey.value = savedApiKey
  }
  else if (envApiKey) {
    // apiKey.value = envApiKey
    // Salvar no localStorage para uso futuro
    localStorage.setItem('openai_api_key', envApiKey)
  }

  // Verificar se há uma seed na URL
  const seedFromUrl = route.query.seed as string
  if (seedFromUrl) {
    loadGoblinFromSeed(seedFromUrl)
  }
})

// Função para carregar um goblin a partir de uma seed
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

// Função para gerar um novo goblin
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

// Função para compartilhar o link do goblin
function shareGoblinLink() {
  if (!currentGoblin.value || !currentGoblin.value.seed)
    return

  // Criar a URL com a seed
  const url = `${window.location.origin}${window.location.pathname}?seed=${currentGoblin.value.seed}`

  // Copiar para a área de transferência
  navigator.clipboard.writeText(url)
    .then(() => {
      shareMessage.value = 'Link copiado para a área de transferência!'
      showShareMessage.value = true

      // Esconder a mensagem após 3 segundos
      setTimeout(() => {
        showShareMessage.value = false
      }, 3000)
    })
    .catch((err) => {
      console.error('Erro ao copiar URL: ', err)
      shareMessage.value = 'Erro ao copiar o link. Tente novamente.'
      showShareMessage.value = true
    })
}

// Função para copiar o goblin para a área de transferência
function copyGoblinToClipboard() {
  if (!currentGoblin.value)
    return

  const goblin = currentGoblin.value

  // Formatar o texto do goblin
  const goblinText = `
GOBLIN MALDITO: ${goblin.name}

OCUPAÇÃO E DESCRITOR:
- Ocupação: ${goblin.occupation}
- Descritor: ${goblin.describer}
- Técnica: ${goblin.technique}

ATRIBUTOS:
- Combate: ${goblin.attributes.combate}
- Habilidade: ${goblin.attributes.habilidade}
- Noção: ${goblin.attributes.noção}
- Vitalidade: ${goblin.attributes.vitalidade}

CARACTERÍSTICAS FÍSICAS:
- Característica Distinta: ${goblin.physicalAttributes.trait}
- Altura: ${goblin.physicalAttributes.height}
- Peso: ${goblin.physicalAttributes.weight}
- Cor da Pele: ${goblin.physicalAttributes.skinColor}
- Cor dos Olhos: ${goblin.physicalAttributes.eyeColor}

PERSONALIDADE:
${goblin.personality.map(trait => `- ${trait}`).join('\n')}

EQUIPAMENTO:
- Arma: ${goblin.equipment.weapon}${goblin.equipment.weaponDetails ? ` (${goblin.equipment.weaponDetails.uso}, ${goblin.equipment.weaponDetails.ataque}, ${goblin.equipment.weaponDetails.bônus})` : ''}
- Proteção: ${goblin.equipment.armor}${goblin.equipment.armorDetails ? ` (${goblin.equipment.armorDetails.uso}, Durabilidade: ${goblin.equipment.armorDetails.durabilidade})` : ''}
- Itens: ${goblin.equipment.items.join(', ')}

${goblin.spells && goblin.spells.length > 0 ? `MAGIAS:\n${goblin.spells.map(spell => `- ${spell}`).join('\n')}\n` : ''}

${goblin.luckOrCurse ? `${goblin.luckOrCurse.type === 'luck' ? 'SORTE' : 'MALDIÇÃO'}:\n${goblin.luckOrCurse.description}` : ''}
  `.trim()

  navigator.clipboard.writeText(goblinText)
    .catch((err) => {
      console.error('Erro ao copiar: ', err)
      throw new Error('Erro ao copiar o goblin. Tente novamente.')
    })
}

// Função para atualizar os atributos do goblin
function updateGoblinAttributes(newAttributes: Partial<Goblin['attributes']>) {
  if (currentGoblin.value) {
    currentGoblin.value.attributes = { ...currentGoblin.value.attributes, ...newAttributes }
  }
}

// Função para alternar a edição de atributos (será usada para implementação futura de níveis)
function toggleEditAttributes() {
  canEditAttributes.value = !canEditAttributes.value
}

// Função para adicionar o goblin atual à coleção
function addToCollection() {
  if (!currentGoblin.value || !currentGoblin.value.seed) return
  
  // Verificar se já existe uma coleção no localStorage
  const savedCollection = localStorage.getItem('goblinCollection')
  let seeds: string[] = []
  
  if (savedCollection) {
    try {
      seeds = JSON.parse(savedCollection)
    } catch (error) {
      console.error('Erro ao carregar a coleção:', error)
      seeds = []
    }
  }
  
  // Verificar se o goblin já está na coleção
  if (currentGoblin.value.seed && seeds.includes(currentGoblin.value.seed)) {
    shareMessage.value = 'Este goblin já está na coleção!'
    showShareMessage.value = true
    setTimeout(() => {
      showShareMessage.value = false
    }, 3000)
    return
  }
  
  // Adicionar a seed à coleção
  seeds.push(currentGoblin.value.seed)
  localStorage.setItem('goblinCollection', JSON.stringify(seeds))
  
  // Mostrar mensagem de sucesso
  shareMessage.value = 'Goblin adicionado à coleção com sucesso!'
  showShareMessage.value = true
  setTimeout(() => {
    showShareMessage.value = false
  }, 3000)
}

// Função para testar a geração de goblin a partir da seed
function testSeedConsistency() {
  if (!currentGoblin.value || !currentGoblin.value.seed) return
  
  const originalGoblin = currentGoblin.value
  const originalSeed = originalGoblin.seed
  
  // Gerar um novo goblin a partir da mesma seed
  const regeneratedGoblin = generateGoblinFromSeed(originalSeed)
  
  if (regeneratedGoblin) {
    // Verificar se os principais atributos são iguais
    const isNameEqual = originalGoblin.name === regeneratedGoblin.name
    const isOccupationEqual = originalGoblin.occupation === regeneratedGoblin.occupation
    const isDescriberEqual = originalGoblin.describer === regeneratedGoblin.describer
    
    const isConsistent = isNameEqual && isOccupationEqual && isDescriberEqual
    
    shareMessage.value = isConsistent 
      ? `Teste bem-sucedido! O mesmo goblin (${originalGoblin.name}) foi gerado a partir da mesma seed.` 
      : `Teste falhou! Diferenças encontradas:
         ${!isNameEqual ? `Nome: ${originalGoblin.name} ≠ ${regeneratedGoblin.name}` : ''}
         ${!isOccupationEqual ? `Ocupação: ${originalGoblin.occupation} ≠ ${regeneratedGoblin.occupation}` : ''}
         ${!isDescriberEqual ? `Descritor: ${originalGoblin.describer} ≠ ${regeneratedGoblin.describer}` : ''}`
    
    showShareMessage.value = true
    setTimeout(() => {
      showShareMessage.value = false
    }, 5000)
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <header class="text-center space-y-2">
      <h1 class="font-bold font-goblin text-goblin-green text-shadow-goblin text-5xl text">
        Goblins Malditos
      </h1>

      <p class="text-xl text-goblin-brown">
        Gerador de Goblins Aleatórios
      </p>
    </header>

    <button class="goblin-button" @click="generateNewGoblin">
      {{ currentGoblin ? 'Gerar Outro Goblin' : 'Gerar Goblin' }}
    </button>

    <div v-if="currentGoblin" class="mt-2">
      <button 
        @click="testSeedConsistency" 
        class="text-sm bg-goblin-brown hover:bg-goblin-green text-white py-1 px-3 rounded transition-colors"
      >
        Testar Consistência da Seed
      </button>
    </div>

    <p v-if="!currentGoblin" class="text-goblin-brown italic text-sm max-w-md text-center">
      Clique no botão acima para gerar um goblin aleatório para sua aventura.
      Cada goblin é único, caótico e provavelmente não vai durar muito tempo!
    </p>

    <div 
      v-if="showShareMessage" 
      class="mt-2 p-3 rounded-md transition-all duration-300 bg-green-100 text-green-700 border border-green-300"
    >
      {{ shareMessage }}
    </div>

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
          :can-edit-attributes="canEditAttributes"
          @copy="copyGoblinToClipboard"
          @update:attributes="updateGoblinAttributes"
          @share="shareGoblinLink"
          @toggle-edit="toggleEditAttributes"
          @add-to-collection="addToCollection"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Adicionar estilos para a mensagem de compartilhamento */
.share-message {
  animation: fadeOut 3s forwards;
}

@keyframes fadeOut {
  0% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0; }
}

/* Estilos para o collapse da imagem */
.image-collapse-container {
  width: 21cm;
  margin: 0 auto;
}

.collapse-button {
  font-family: 'Goblin', sans-serif;
}

.collapse-content {
  transition: all 0.3s ease-in-out;
}
</style>
