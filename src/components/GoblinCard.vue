<script setup lang="ts">
import type { Goblin } from '../services/goblinGenerator';

// Propriedades do componente
defineProps<{
  goblin: Goblin;
}>();

// Emitir evento para copiar o goblin
const emit = defineEmits<{
  (e: 'copy'): void;
}>();

// Função para copiar o goblin
const copyGoblin = () => {
  emit('copy');
};
</script>

<template>
  <div class="goblin-card-container" v-if="goblin">
    <div class="goblin-card">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-3xl font-goblin text-goblin-green">{{ goblin.name }}</h2>
        <button 
          @click="copyGoblin" 
          class="text-sm bg-goblin-brown hover:bg-goblin-green px-2 py-1 rounded"
          title="Copiar Goblin"
        >
          Copiar
        </button>
      </div>

      <div class="goblin-sections">
        <!-- Características Físicas -->
        <div class="goblin-section mb-4">
          <h3 class="text-xl font-goblin text-goblin-green mb-2">Características Físicas</h3>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Altura:</span> {{ goblin.physicalAttributes.height }}
          </div>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Peso:</span> {{ goblin.physicalAttributes.weight }}
          </div>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Cor da Pele:</span> {{ goblin.physicalAttributes.skinColor }}
          </div>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Cor dos Olhos:</span> {{ goblin.physicalAttributes.eyeColor }}
          </div>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Características Notáveis:</span> 
            <ul class="list-disc list-inside ml-2">
              <li v-for="trait in goblin.physicalAttributes.physicalTraits" :key="trait">
                {{ trait }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Personalidade -->
        <div class="goblin-section mb-4">
          <h3 class="text-xl font-goblin text-goblin-green mb-2">Personalidade</h3>
          <ul class="list-disc list-inside ml-2">
            <li v-for="trait in goblin.personality" :key="trait">
              {{ trait }}
            </li>
          </ul>
        </div>

        <!-- Talento Especial -->
        <div class="goblin-section mb-4">
          <h3 class="text-xl font-goblin text-goblin-green mb-2">Talento Especial</h3>
          <div class="goblin-attribute">
            {{ goblin.specialTalent }}
          </div>
        </div>

        <!-- Sorte/Maldição -->
        <div class="goblin-section mb-4">
          <h3 class="text-xl font-goblin text-goblin-green mb-2">
            {{ goblin.luckOrCurse.type === 'luck' ? 'Sorte' : 'Maldição' }}
          </h3>
          <div class="goblin-attribute" :class="{ 'text-green-600': goblin.luckOrCurse.type === 'luck', 'text-red-600': goblin.luckOrCurse.type === 'curse' }">
            {{ goblin.luckOrCurse.description }}
          </div>
        </div>

        <!-- Equipamento -->
        <div class="goblin-section mb-4">
          <h3 class="text-xl font-goblin text-goblin-green mb-2">Equipamento</h3>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Arma:</span> {{ goblin.equipment.weapon }}
          </div>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Armadura:</span> {{ goblin.equipment.armor }}
          </div>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Itens:</span>
            <ul class="list-disc list-inside ml-2">
              <li v-for="item in goblin.equipment.items" :key="item">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.goblin-card-container {
  @apply w-full flex justify-center;
}

.goblin-card {
  @apply bg-parchment text-goblin-dark p-5 rounded-lg shadow-lg border-2 border-goblin-brown transform rotate-1 w-full;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%238b6d5c' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.goblin-section {
  @apply mb-3;
}

.goblin-section h3 {
  @apply mb-1.5;
}

.goblin-attribute {
  @apply mb-1.5;
}

/* Ajustes para o layout responsivo */
@media (min-width: 768px) {
  .goblin-card {
    height: auto;
    min-height: 100%;
  }
  
  /* Layout de duas colunas em telas maiores */
  .goblin-sections {
    @apply grid gap-3;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-flow: dense;
  }
  
  /* Distribuição automática das seções nas colunas */
  .goblin-section {
    @apply mb-2;
  }
  
  /* Características físicas na primeira coluna */
  .goblin-section:nth-child(1) {
    grid-column: 1;
    grid-row: 1 / span 2;
  }
  
  /* Personalidade na segunda coluna */
  .goblin-section:nth-child(2) {
    grid-column: 2;
    grid-row: 1;
  }
  
  /* Talento Especial na segunda coluna */
  .goblin-section:nth-child(3) {
    grid-column: 2;
    grid-row: 2;
  }
  
  /* Sorte/Maldição na segunda coluna */
  .goblin-section:nth-child(4) {
    grid-column: 2;
    grid-row: 3;
  }
  
  /* Equipamento na primeira coluna */
  .goblin-section:nth-child(5) {
    grid-column: 1;
    grid-row: 3;
  }
}

@media (min-width: 1024px) {
  .goblin-card {
    padding: 1.5rem;
  }
  
  .goblin-sections {
    @apply gap-4;
  }
}
</style> 
