<script setup lang="ts">
import { ref } from 'vue';
import type { Goblin } from '../services/goblinGenerator';
import { generateGoblinImage, getPlaceholderImage } from '../services/imageGenerator';

// Propriedades do componente
const props = defineProps<{
  goblin: Goblin;
  apiKey: string;
}>();

// Estado para armazenar a URL da imagem
const imageUrl = ref<string>('');
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);
const isFullscreen = ref<boolean>(false);

// Função para gerar a imagem
const generateImage = async () => {
  if (!props.goblin) return;
  
  // Resetar estados
  error.value = null;
  isLoading.value = true;
  
  // Se não tiver API key, usar placeholder
  if (!props.apiKey) {
    imageUrl.value = getPlaceholderImage(props.goblin);
    isLoading.value = false;
    error.value = 'Chave de API não fornecida. Usando imagem de placeholder.';
    return;
  }
  
  try {
    // Mensagem de carregamento mais informativa
    const loadingMessages = [
      'Criando ficha do goblin...',
      'Isso pode levar até 30 segundos...',
      'O DALL-E 3 está desenhando sua ficha...',
      'Quase lá...'
    ];
    
    let messageIndex = 0;
    const loadingInterval = setInterval(() => {
      if (isLoading.value) {
        const loadingElement = document.querySelector('.loading-message');
        if (loadingElement) {
          loadingElement.textContent = loadingMessages[messageIndex % loadingMessages.length];
        }
        messageIndex++;
      } else {
        clearInterval(loadingInterval);
      }
    }, 5000);
    
    const result = await generateGoblinImage(props.goblin, props.apiKey);
    
    clearInterval(loadingInterval);
    
    if (result.error) {
      // Verificar se é um erro de violação de política de conteúdo
      if (result.error.includes('content_policy_violation') || 
          result.error.includes('safety system') || 
          result.error.includes('policy')) {
        error.value = 'Erro na geração da imagem. Estamos usando o DALL-E 3 com um prompt específico para fichas de personagem. Tente gerar outro goblin ou regenerar a imagem.';
      } else if (result.error.includes('billing')) {
        error.value = 'Erro de cobrança na API da OpenAI. Verifique se sua conta tem créditos suficientes para usar o DALL-E 3.';
      } else {
        error.value = result.error;
      }
      imageUrl.value = getPlaceholderImage(props.goblin);
    } else {
      imageUrl.value = result.url;
      error.value = null; // Limpar qualquer erro anterior em caso de sucesso
    }
  } catch (e) {
    error.value = 'Erro ao gerar imagem. Tente novamente ou gere outro goblin.';
    imageUrl.value = getPlaceholderImage(props.goblin);
  } finally {
    isLoading.value = false;
  }
};

// Função para alternar o modo de tela cheia da imagem
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// Função para baixar a imagem
const downloadImage = async () => {
  if (!imageUrl.value) return;
  
  try {
    // Buscar a imagem como blob
    const response = await fetch(imageUrl.value);
    const blob = await response.blob();
    
    // Criar URL para o blob
    const blobUrl = URL.createObjectURL(blob);
    
    // Criar link para download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `ficha_${props.goblin.name.replace(/\s+/g, '_').toLowerCase()}.png`;
    
    // Adicionar o link ao documento, clicar nele e removê-lo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Liberar a URL do blob
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  } catch (e) {
    console.error('Erro ao baixar imagem:', e);
    error.value = 'Erro ao baixar a imagem. Tente novamente.';
  }
};
</script>

<template>
  <div class="goblin-image-container">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-message text-goblin-brown mt-2">Criando ficha do goblin...</p>
      <p class="text-goblin-gray text-xs mt-1">Usando DALL-E 3 para resultados melhores</p>
    </div>
    
    <div v-else-if="imageUrl" class="image-container">
      <img 
        :src="imageUrl" 
        :alt="goblin.name" 
        class="goblin-image"
        @error="error = 'Erro ao carregar imagem'; imageUrl = getPlaceholderImage(goblin)"
        @click="toggleFullscreen"
      />
      
      <div class="image-controls mt-2 flex space-x-2 justify-center">
        <button 
          @click="generateImage" 
          class="text-sm bg-goblin-brown hover:bg-goblin-green px-2 py-1 rounded"
          :disabled="isLoading"
        >
          Regenerar Ficha
        </button>
        
        <button 
          @click="toggleFullscreen" 
          class="text-sm bg-goblin-brown hover:bg-goblin-green px-2 py-1 rounded"
        >
          {{ isFullscreen ? 'Fechar' : 'Ampliar' }}
        </button>
        
        <button 
          @click="downloadImage" 
          class="text-sm bg-goblin-brown hover:bg-goblin-green px-2 py-1 rounded"
          :disabled="isLoading || !imageUrl"
        >
          Baixar Ficha
        </button>
      </div>
      
      <div v-if="error" class="error-message text-sm text-red-500 mt-2">
        {{ error }}
      </div>
    </div>
    
    <!-- Área para quando não há imagem gerada -->
    <div v-else class="no-image-container">
      <p class="text-goblin-brown mb-4 text-center">
        Clique no botão abaixo para gerar uma ficha de personagem para este goblin.
        <br>
        <span class="text-xs text-goblin-gray">Isso usará a API da OpenAI (DALL-E 3) e pode custar aproximadamente $0.04 USD.</span>
      </p>
      
      <button 
        @click="generateImage" 
        class="goblin-button"
        :disabled="isLoading"
      >
        Gerar imagem com IA
      </button>
      
      <div v-if="error" class="error-message text-sm text-red-500 mt-4">
        {{ error }}
      </div>
    </div>
    
    <!-- Modal de tela cheia para a imagem -->
    <div v-if="isFullscreen && imageUrl" class="fullscreen-modal" @click="toggleFullscreen">
      <div class="fullscreen-content" @click.stop>
        <button class="close-button" @click="toggleFullscreen">×</button>
        <img 
          :src="imageUrl" 
          :alt="goblin.name" 
          class="fullscreen-image"
        />
        <div class="fullscreen-controls mt-4 flex justify-center space-x-4">
          <button 
            @click="downloadImage" 
            class="bg-goblin-brown hover:bg-goblin-green px-3 py-2 rounded text-white"
          >
            Baixar Ficha
          </button>
          <button 
            @click="toggleFullscreen" 
            class="bg-goblin-gray hover:bg-goblin-brown px-3 py-2 rounded text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.goblin-image-container {
  @apply w-full flex justify-center items-center;
  min-height: 200px;
}

.loading-container {
  @apply flex flex-col items-center justify-center w-full;
  min-height: 300px;
}

.loading-spinner {
  @apply w-12 h-12 border-4 border-goblin-green border-t-transparent rounded-full;
  animation: spin 1s linear infinite;
}

.image-container {
  @apply flex flex-col items-center w-full;
}

.goblin-image {
  @apply rounded-lg shadow-lg border-2 border-goblin-brown cursor-pointer;
  max-width: 100%;
  max-height: 500px;
  transform: rotate(-1deg);
  transition: transform 0.3s ease;
  object-fit: contain;
}

.goblin-image:hover {
  transform: rotate(0deg) scale(1.02);
}

.no-image-container {
  @apply flex flex-col items-center justify-center p-6 border-2 border-dashed border-goblin-brown rounded-lg w-full;
  min-height: 300px;
  background-color: rgba(139, 109, 92, 0.1);
}

.error-message {
  @apply text-center;
}

.fullscreen-modal {
  @apply fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50;
}

.fullscreen-content {
  @apply relative max-w-[90vw] max-h-[90vh] flex flex-col items-center;
}

.fullscreen-image {
  @apply max-w-full max-h-[80vh] rounded-lg;
}

.close-button {
  @apply absolute top-2 right-2 w-8 h-8 bg-goblin-brown text-white rounded-full flex items-center justify-center;
  font-size: 24px;
  line-height: 1;
}

.fullscreen-controls {
  @apply w-full;
}

/* Ajustes para o layout responsivo */
@media (min-width: 768px) {
  .goblin-image-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  
  .no-image-container {
    height: 100%;
    min-height: 400px;
  }
  
  .goblin-image {
    max-height: 500px;
    width: 100%;
    object-fit: contain;
    transform: rotate(1deg); /* Rotação oposta à ficha */
  }
  
  .goblin-image:hover {
    transform: rotate(0deg) scale(1.02);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 
