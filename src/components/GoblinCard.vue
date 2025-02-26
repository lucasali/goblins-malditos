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
  <div class="goblin-card" v-if="goblin">
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

    <!-- Características Físicas -->
    <div class="mb-4">
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
    <div class="mb-4">
      <h3 class="text-xl font-goblin text-goblin-green mb-2">Personalidade</h3>
      <ul class="list-disc list-inside ml-2">
        <li v-for="trait in goblin.personality" :key="trait">
          {{ trait }}
        </li>
      </ul>
    </div>

    <!-- Equipamento -->
    <div class="mb-4">
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

    <!-- Talento Especial -->
    <div class="mb-4">
      <h3 class="text-xl font-goblin text-goblin-green mb-2">Talento Especial</h3>
      <div class="goblin-attribute">
        {{ goblin.specialTalent }}
      </div>
    </div>

    <!-- Sorte/Maldição -->
    <div class="mb-4">
      <h3 class="text-xl font-goblin text-goblin-green mb-2">
        {{ goblin.luckOrCurse.type === 'luck' ? 'Sorte' : 'Maldição' }}
      </h3>
      <div class="goblin-attribute" :class="{ 'text-green-600': goblin.luckOrCurse.type === 'luck', 'text-red-600': goblin.luckOrCurse.type === 'curse' }">
        {{ goblin.luckOrCurse.description }}
      </div>
    </div>
  </div>
</template> 
