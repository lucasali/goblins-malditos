<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GoblinCard from '../components/GoblinCard.vue';
import GoblinImage from '../components/GoblinImage.vue';
import type { Goblin } from '../services/goblinGenerator';
import { generateGoblin, generateGoblinFromSeed } from '../services/goblinGenerator';

// Obter a rota e o router para manipular a URL
const route = useRoute();
const router = useRouter();

// Estado para armazenar o goblin atual
const currentGoblin = ref<Goblin | null>(null);

// Estado para armazenar a chave da API
const apiKey = ref<string>('');
const showApiConfig = ref<boolean>(false);

// Estado para mensagens de compartilhamento
const shareMessage = ref<string>('');
const showShareMessage = ref<boolean>(false);

// Inicializar a chave da API e verificar se há uma seed na URL
onMounted(() => {
  // Verificar se há uma chave de API no ambiente
  const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  // Verificar se há uma chave de API salva no localStorage
  const savedApiKey = localStorage.getItem('openai_api_key');
  
  // Priorizar a chave do localStorage, depois a do ambiente
  if (savedApiKey) {
    apiKey.value = savedApiKey;
  } else if (envApiKey) {
    apiKey.value = envApiKey;
    // Salvar no localStorage para uso futuro
    localStorage.setItem('openai_api_key', envApiKey);
  }

  // Verificar se há uma seed na URL
  const seedFromUrl = route.query.seed as string;
  if (seedFromUrl) {
    loadGoblinFromSeed(seedFromUrl);
  }
});

// Função para carregar um goblin a partir de uma seed
const loadGoblinFromSeed = (seed: string) => {
  try {
    const goblin = generateGoblinFromSeed(seed);
    if (goblin) {
      currentGoblin.value = goblin;
    } else {
      // Se a seed for inválida, gerar um novo goblin
      generateNewGoblin();
    }
  } catch (error) {
    console.error('Erro ao carregar goblin da seed:', error);
    // Em caso de erro, gerar um novo goblin
    generateNewGoblin();
  }
};

// Função para salvar a chave da API
const saveApiKey = () => {
  localStorage.setItem('openai_api_key', apiKey.value);
  showApiConfig.value = false;
};

// Função para gerar um novo goblin
const generateNewGoblin = () => {
  // Adicionar uma pequena animação de tremor antes de gerar o goblin
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.classList.add('shake');
    setTimeout(() => {
      appElement.classList.remove('shake');
    }, 500);
  }
  
  // Gerar o goblin após um pequeno delay para a animação
  setTimeout(() => {
    currentGoblin.value = generateGoblin();
    
    // Atualizar a URL com a nova seed
    if (currentGoblin.value && currentGoblin.value.seed) {
      router.replace({ query: { seed: currentGoblin.value.seed } });
    }
  }, 300);
};

// Função para compartilhar o goblin atual
const shareGoblin = () => {
  if (!currentGoblin.value || !currentGoblin.value.seed) return;
  
  // Criar a URL completa com a seed
  const url = new URL(window.location.href);
  url.searchParams.set('seed', currentGoblin.value.seed);
  
  // Copiar a URL para a área de transferência
  navigator.clipboard.writeText(url.toString())
    .then(() => {
      shareMessage.value = 'Link copiado para a área de transferência!';
      showShareMessage.value = true;
      
      // Esconder a mensagem após 3 segundos
      setTimeout(() => {
        showShareMessage.value = false;
      }, 3000);
    })
    .catch(err => {
      console.error('Erro ao copiar URL: ', err);
      shareMessage.value = 'Erro ao copiar o link. Tente novamente.';
      showShareMessage.value = true;
    });
};

// Função para copiar o goblin para a área de transferência
const copyGoblinToClipboard = () => {
  if (!currentGoblin.value) return;
  
  const goblin = currentGoblin.value;
  
  // Formatar o texto do goblin
  const goblinText = `
GOBLIN MALDITO: ${goblin.name}

CARACTERÍSTICAS FÍSICAS:
- Altura: ${goblin.physicalAttributes.height}
- Peso: ${goblin.physicalAttributes.weight}
- Cor da Pele: ${goblin.physicalAttributes.skinColor}
- Cor dos Olhos: ${goblin.physicalAttributes.eyeColor}
- Características Notáveis: ${goblin.physicalAttributes.physicalTraits.join(', ')}

PERSONALIDADE:
${goblin.personality.map(trait => `- ${trait}`).join('\n')}

EQUIPAMENTO:
- Arma: ${goblin.equipment.weapon}
- Armadura: ${goblin.equipment.armor}
- Itens: ${goblin.equipment.items.join(', ')}

TALENTO ESPECIAL:
${goblin.specialTalent}

${goblin.luckOrCurse.type === 'luck' ? 'SORTE' : 'MALDIÇÃO'}:
${goblin.luckOrCurse.description}
  `.trim();
  
  // Copiar para a área de transferência
  navigator.clipboard.writeText(goblinText)
    .then(() => {
      alert('Goblin copiado para a área de transferência!');
    })
    .catch(err => {
      console.error('Erro ao copiar: ', err);
      alert('Erro ao copiar o goblin. Tente novamente.');
    });
};
</script>

<template>
  <div class="main-content">
    <header class="mb-8 text-center">
      <h1 class="text-5xl mb-2">Goblins Malditos</h1>
      <p class="text-xl text-goblin-brown">Gerador de Goblins Aleatórios</p>
    </header>
    
    <div class="flex flex-col items-center mb-8">
      <button @click="generateNewGoblin" class="goblin-button mb-4">
        {{ currentGoblin ? 'Gerar Outro Goblin' : 'Gerar Goblin' }}
      </button>
      
      <div class="flex space-x-2 mb-4">
        <button 
          @click="showApiConfig = !showApiConfig" 
          class="text-sm bg-goblin-brown hover:bg-goblin-green px-3 py-1 rounded"
        >
          {{ apiKey ? 'Alterar API Key' : 'Configurar API Key' }}
        </button>
        
        <button 
          v-if="currentGoblin" 
          @click="shareGoblin" 
          class="text-sm bg-goblin-brown hover:bg-goblin-green px-3 py-1 rounded"
          title="Compartilhar este goblin"
        >
          Compartilhar Goblin
        </button>
      </div>
      
      <!-- Mensagem de compartilhamento -->
      <div 
        v-if="showShareMessage" 
        class="share-message bg-goblin-green text-white px-4 py-2 rounded-lg mb-4 transition-opacity duration-300"
      >
        {{ shareMessage }}
      </div>
      
      <div v-if="showApiConfig" class="bg-goblin-dark p-4 rounded-lg border border-goblin-brown mb-4 max-w-md">
        <h3 class="text-lg font-goblin text-goblin-green mb-2">Configuração da API OpenAI</h3>
        <p class="text-sm mb-2">
          Para gerar imagens dos goblins, você precisa de uma chave de API da OpenAI.
          <a href="https://platform.openai.com/api-keys" target="_blank" class="text-goblin-green underline">
            Obtenha uma aqui
          </a>.
        </p>
        <div class="mb-2">
          <input 
            v-model="apiKey" 
            type="password" 
            placeholder="Insira sua chave de API da OpenAI" 
            class="w-full p-2 rounded bg-goblin-gray text-white"
          />
        </div>
        <div class="flex justify-end">
          <button @click="saveApiKey" class="bg-goblin-green hover:bg-goblin-brown px-3 py-1 rounded">
            Salvar
          </button>
        </div>
      </div>
      
      <p class="text-goblin-brown italic text-sm max-w-md text-center" v-if="!currentGoblin">
        Clique no botão acima para gerar um goblin aleatório para sua aventura. 
        Cada goblin é único, caótico e provavelmente não vai durar muito tempo!
      </p>
    </div>
    
    <transition 
      enter-active-class="transition duration-500 ease-out" 
      enter-from-class="opacity-0 transform -rotate-3 scale-95" 
      enter-to-class="opacity-100 transform rotate-1 scale-100"
      leave-active-class="transition duration-300 ease-in" 
      leave-from-class="opacity-100" 
      leave-to-class="opacity-0"
    >
      <div v-if="currentGoblin" class="goblin-display">
        <div class="goblin-content-wrapper">
          <!-- Detalhes do Goblin (agora à esquerda) -->
          <div class="goblin-card-wrapper">
            <GoblinCard 
              :goblin="currentGoblin" 
              @copy="copyGoblinToClipboard" 
            />
          </div>
          
          <!-- Imagem do Goblin (agora à direita) -->
          <div class="goblin-image-wrapper">
            <GoblinImage 
              :goblin="currentGoblin" 
              :apiKey="apiKey"
            />
          </div>
        </div>
      </div>
    </transition>
    
    <footer class="mt-8 text-center text-goblin-brown text-sm">
      <p>Criado para o RPG Goblins Malditos - Onde a morte é apenas o começo!</p>
    </footer>
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
</style> 
