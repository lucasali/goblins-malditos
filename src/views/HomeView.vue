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

// Estado para controlar se os atributos podem ser editados
const canEditAttributes = ref<boolean>(false);

// Estado para controlar se a imagem está visível
const showImage = ref<boolean>(false);

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

// Função para atualizar os atributos do goblin
const updateGoblinAttributes = (newAttributes: Partial<Goblin['attributes']>) => {
  if (currentGoblin.value) {
    currentGoblin.value.attributes = { ...currentGoblin.value.attributes, ...newAttributes };
  }
};

// Função para alternar a edição de atributos (será usada para implementação futura de níveis)
const toggleAttributeEditing = () => {
  canEditAttributes.value = !canEditAttributes.value;
};

// Função para alternar a visibilidade da imagem
const toggleImageVisibility = () => {
  showImage.value = !showImage.value;
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
      <div v-if="currentGoblin" class="goblin-display flex flex-col items-center gap-12">
        <!-- Collapse para a imagem do goblin -->
        <div class="image-collapse-container mb-12">
          <button 
            @click="toggleImageVisibility" 
            class="collapse-button w-full flex justify-between items-center p-2 bg-goblin-brown hover:bg-goblin-green text-white rounded-t"
          >
            <span>{{ showImage ? 'Esconder Imagem do Goblin' : 'Mostrar Imagem do Goblin' }}</span>
            <span class="transform transition-transform" :class="{ 'rotate-180': showImage }">▼</span>
          </button>
          
          <div 
            v-show="showImage" 
            class="collapse-content bg-goblin-dark bg-opacity-20 p-4 rounded-b"
          >
            <div class="flex justify-end mb-2">
              <button 
                @click="showApiConfig = !showApiConfig" 
                class="text-sm bg-goblin-brown hover:bg-goblin-green px-3 py-1 rounded flex items-center"
              >
                <span class="material-icons text-sm mr-1">key</span>
                {{ apiKey ? 'Alterar API Key' : 'Configurar API Key' }}
              </button>
            </div>
            
            <div v-if="showApiConfig" class="bg-goblin-dark p-4 rounded-lg border border-goblin-brown mb-4">
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
            
            <GoblinImage 
              :goblin="currentGoblin" 
              :apiKey="apiKey"
            />
          </div>
        </div>
        
        <GoblinCard 
          :goblin="currentGoblin" 
          :canEditAttributes="canEditAttributes"
          @copy="copyGoblinToClipboard" 
          @update:attributes="updateGoblinAttributes"
          @share="shareGoblin"
          @toggle-edit="toggleAttributeEditing"
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
