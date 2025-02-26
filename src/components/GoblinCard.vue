<script setup lang="ts">
import type { Goblin } from '../services/goblinGenerator';
import { ref, computed } from 'vue';

// Propriedades do componente
const props = defineProps<{
  goblin: Goblin;
}>();

// Emitir eventos
const emit = defineEmits<{
  (e: 'copy'): void;
  (e: 'update:attributes', attributes: { combate: number; habilidade: number; noção: number; vitalidade: number }): void;
}>();

// Criar cópias locais dos atributos para manipulação
const attributes = ref({
  combate: props.goblin.attributes.combate,
  habilidade: props.goblin.attributes.habilidade,
  noção: props.goblin.attributes.noção,
  vitalidade: props.goblin.attributes.vitalidade
});

// Limites para os atributos
const MIN_ATTRIBUTE = 1;
const MAX_ATTRIBUTE = 6;

// Função para atualizar um atributo
const updateAttribute = (attribute: keyof typeof attributes.value, value: number) => {
  // Garantir que o valor esteja dentro dos limites
  const newValue = Math.max(MIN_ATTRIBUTE, Math.min(MAX_ATTRIBUTE, value));
  attributes.value[attribute] = newValue;
  
  // Emitir evento para atualizar o goblin no componente pai
  emit('update:attributes', { ...attributes.value });
};

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
        <!-- Ocupação e Descritor -->
        <div class="goblin-section mb-4">
          <h3 class="text-xl font-goblin text-goblin-green mb-2">Ocupação e Descritor</h3>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Ocupação:</span> {{ goblin.occupation }}
          </div>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Descritor:</span> {{ goblin.describer }}
          </div>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Técnica:</span> {{ goblin.technique }}
          </div>
        </div>

        <!-- Atributos -->
        <div class="goblin-section mb-4">
          <h3 class="text-xl font-goblin text-goblin-green mb-2">Atributos</h3>
          
          <!-- Combate -->
          <div class="goblin-attribute attribute-slider">
            <div class="flex justify-between items-center mb-1">
              <span class="goblin-attribute-title">Combate:</span>
              <span class="attribute-value">{{ attributes.combate }}</span>
            </div>
            <div class="slider-container">
              <button 
                @click="updateAttribute('combate', attributes.combate - 1)" 
                class="slider-button" 
                :disabled="attributes.combate <= MIN_ATTRIBUTE"
                :class="{ 'disabled': attributes.combate <= MIN_ATTRIBUTE }"
              >
                -
              </button>
              <input 
                type="range" 
                min="1" 
                max="6" 
                v-model.number="attributes.combate" 
                @input="updateAttribute('combate', attributes.combate)"
                class="attribute-slider"
              />
              <button 
                @click="updateAttribute('combate', attributes.combate + 1)" 
                class="slider-button" 
                :disabled="attributes.combate >= MAX_ATTRIBUTE"
                :class="{ 'disabled': attributes.combate >= MAX_ATTRIBUTE }"
              >
                +
              </button>
            </div>
          </div>
          
          <!-- Habilidade -->
          <div class="goblin-attribute attribute-slider">
            <div class="flex justify-between items-center mb-1">
              <span class="goblin-attribute-title">Habilidade:</span>
              <span class="attribute-value">{{ attributes.habilidade }}</span>
            </div>
            <div class="slider-container">
              <button 
                @click="updateAttribute('habilidade', attributes.habilidade - 1)" 
                class="slider-button" 
                :disabled="attributes.habilidade <= MIN_ATTRIBUTE"
                :class="{ 'disabled': attributes.habilidade <= MIN_ATTRIBUTE }"
              >
                -
              </button>
              <input 
                type="range" 
                min="1" 
                max="6" 
                v-model.number="attributes.habilidade" 
                @input="updateAttribute('habilidade', attributes.habilidade)"
                class="attribute-slider"
              />
              <button 
                @click="updateAttribute('habilidade', attributes.habilidade + 1)" 
                class="slider-button" 
                :disabled="attributes.habilidade >= MAX_ATTRIBUTE"
                :class="{ 'disabled': attributes.habilidade >= MAX_ATTRIBUTE }"
              >
                +
              </button>
            </div>
          </div>
          
          <!-- Noção -->
          <div class="goblin-attribute attribute-slider">
            <div class="flex justify-between items-center mb-1">
              <span class="goblin-attribute-title">Noção:</span>
              <span class="attribute-value">{{ attributes.noção }}</span>
            </div>
            <div class="slider-container">
              <button 
                @click="updateAttribute('noção', attributes.noção - 1)" 
                class="slider-button" 
                :disabled="attributes.noção <= MIN_ATTRIBUTE"
                :class="{ 'disabled': attributes.noção <= MIN_ATTRIBUTE }"
              >
                -
              </button>
              <input 
                type="range" 
                min="1" 
                max="6" 
                v-model.number="attributes.noção" 
                @input="updateAttribute('noção', attributes.noção)"
                class="attribute-slider"
              />
              <button 
                @click="updateAttribute('noção', attributes.noção + 1)" 
                class="slider-button" 
                :disabled="attributes.noção >= MAX_ATTRIBUTE"
                :class="{ 'disabled': attributes.noção >= MAX_ATTRIBUTE }"
              >
                +
              </button>
            </div>
          </div>
          
          <!-- Vitalidade -->
          <div class="goblin-attribute attribute-slider">
            <div class="flex justify-between items-center mb-1">
              <span class="goblin-attribute-title">Vitalidade:</span>
              <span class="attribute-value">{{ attributes.vitalidade }}</span>
            </div>
            <div class="slider-container">
              <button 
                @click="updateAttribute('vitalidade', attributes.vitalidade - 1)" 
                class="slider-button" 
                :disabled="attributes.vitalidade <= MIN_ATTRIBUTE"
                :class="{ 'disabled': attributes.vitalidade <= MIN_ATTRIBUTE }"
              >
                -
              </button>
              <input 
                type="range" 
                min="1" 
                max="6" 
                v-model.number="attributes.vitalidade" 
                @input="updateAttribute('vitalidade', attributes.vitalidade)"
                class="attribute-slider"
              />
              <button 
                @click="updateAttribute('vitalidade', attributes.vitalidade + 1)" 
                class="slider-button" 
                :disabled="attributes.vitalidade >= MAX_ATTRIBUTE"
                :class="{ 'disabled': attributes.vitalidade >= MAX_ATTRIBUTE }"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Características Físicas -->
        <div class="goblin-section mb-4">
          <h3 class="text-xl font-goblin text-goblin-green mb-2">Características Físicas</h3>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Característica Distinta:</span> {{ goblin.physicalAttributes.trait }}
          </div>
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

        <!-- Equipamento -->
        <div class="goblin-section mb-4">
          <h3 class="text-xl font-goblin text-goblin-green mb-2">Equipamento</h3>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Arma:</span> {{ goblin.equipment.weapon }}
            <span v-if="goblin.equipment.weaponDetails" class="text-xs ml-2 text-goblin-dark">
              ({{ goblin.equipment.weaponDetails.uso }}, {{ goblin.equipment.weaponDetails.ataque }}, {{ goblin.equipment.weaponDetails.bônus }})
            </span>
          </div>
          <div class="goblin-attribute">
            <span class="goblin-attribute-title">Proteção:</span> {{ goblin.equipment.armor }}
            <span v-if="goblin.equipment.armorDetails" class="text-xs ml-2 text-goblin-dark">
              ({{ goblin.equipment.armorDetails.uso }}, Durabilidade: {{ goblin.equipment.armorDetails.durabilidade }})
            </span>
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

        <!-- Magias (se for Bruxo) -->
        <div class="goblin-section mb-4" v-if="goblin.occupation === 'Bruxo' && goblin.spells && goblin.spells.length > 0">
          <h3 class="text-xl font-goblin text-goblin-green mb-2">Magias</h3>
          <ul class="list-disc list-inside ml-2">
            <li v-for="spell in goblin.spells" :key="spell">
              {{ spell }}
            </li>
          </ul>
        </div>

        <!-- Sorte/Maldição -->
        <div class="goblin-section mb-4" v-if="goblin.luckOrCurse">
          <h3 class="text-xl font-goblin text-goblin-green mb-2">
            {{ goblin.luckOrCurse.type === 'luck' ? 'Sorte' : 'Maldição' }}
          </h3>
          <div class="goblin-attribute" :class="{ 'text-green-600': goblin.luckOrCurse.type === 'luck', 'text-red-600': goblin.luckOrCurse.type === 'curse' }">
            {{ goblin.luckOrCurse.description }}
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

.goblin-attribute-title {
  @apply font-bold;
}

/* Estilos para os sliders de atributos */
.attribute-slider {
  @apply mb-3;
}

.slider-container {
  @apply flex items-center;
}

.attribute-value {
  @apply font-bold text-goblin-green text-lg;
}

input[type="range"] {
  @apply flex-grow mx-2 h-2 rounded-full bg-goblin-brown appearance-none;
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  @apply w-4 h-4 rounded-full bg-goblin-green cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply w-4 h-4 rounded-full bg-goblin-green cursor-pointer border-none;
}

.slider-button {
  @apply w-6 h-6 flex items-center justify-center bg-goblin-brown text-white rounded-full font-bold;
}

.slider-button:hover:not(.disabled) {
  @apply bg-goblin-green;
}

.slider-button.disabled {
  @apply opacity-50 cursor-not-allowed;
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
  
  /* Ocupação e Descritor na primeira coluna */
  .goblin-section:nth-child(1) {
    grid-column: 1;
    grid-row: 1;
  }
  
  /* Atributos na primeira coluna */
  .goblin-section:nth-child(2) {
    grid-column: 1;
    grid-row: 2;
  }
  
  /* Características físicas na primeira coluna */
  .goblin-section:nth-child(3) {
    grid-column: 1;
    grid-row: 3;
  }
  
  /* Personalidade na segunda coluna */
  .goblin-section:nth-child(4) {
    grid-column: 2;
    grid-row: 1;
  }
  
  /* Equipamento na segunda coluna */
  .goblin-section:nth-child(5) {
    grid-column: 2;
    grid-row: 2;
  }
  
  /* Magias na segunda coluna */
  .goblin-section:nth-child(6) {
    grid-column: 2;
    grid-row: 3;
  }
  
  /* Sorte/Maldição na segunda coluna */
  .goblin-section:nth-child(7) {
    grid-column: 2;
    grid-row: 4;
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
