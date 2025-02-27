<script setup lang="ts">
import type { Goblin } from '../services/goblinGenerator'
import { computed, ref } from 'vue'

// Propriedades do componente
const props = defineProps<{
  goblin: Goblin
  canEditAttributes?: boolean // Nova prop para controlar se os atributos podem ser editados
}>()

// Emitir eventos
const emit = defineEmits<{
  (e: 'copy'): void
  (e: 'share'): void
  (e: 'toggleEdit'): void
  (e: 'update:attributes', attributes: { combate: number, habilidade: number, noção: number, vitalidade: number }): void
}>()

// Criar cópias locais dos atributos para manipulação
const attributes = ref({
  combate: props.goblin.attributes.combate,
  habilidade: props.goblin.attributes.habilidade,
  noção: props.goblin.attributes.noção,
  vitalidade: props.goblin.attributes.vitalidade,
})

// Limites para os atributos
const MIN_ATTRIBUTE = 1
const MAX_ATTRIBUTE = 6

// Valor padrão para canEditAttributes
const canEdit = computed(() => props.canEditAttributes ?? false)

// Função para atualizar um atributo
function updateAttribute(attribute: keyof typeof attributes.value, value: number) {
  // Se não pode editar, não faz nada
  if (!canEdit.value)
    return

  // Garantir que o valor esteja dentro dos limites
  const newValue = Math.max(MIN_ATTRIBUTE, Math.min(MAX_ATTRIBUTE, value))
  attributes.value[attribute] = newValue

  // Emitir evento para atualizar o goblin no componente pai
  emit('update:attributes', { ...attributes.value })
}

// Função para copiar o goblin
function copyGoblin() {
  emit('copy')
}

// Função para compartilhar o goblin
function shareGoblin() {
  emit('share')
}

// Função para alternar a edição de atributos
function toggleEditAttributes() {
  emit('toggleEdit')
}
</script>

<template>
  <div v-if="goblin" class="goblin-card">
    <div class="flex justify-between items-start mb-4">
      <h2 class="text-3xl font-goblin text-goblin-green">
        {{ goblin.name }}
      </h2>
      <div class="flex space-x-2">
        <button
          class="action-button"
          title="Compartilhar Goblin"
          @click="shareGoblin"
        >
          <span class="material-icons">share</span>
        </button>
        <button
          class="action-button"
          title="Copiar Goblin"
          @click="copyGoblin"
        >
          <span class="material-icons">content_copy</span>
        </button>
      </div>
    </div>

    <div class="goblin-sections">
      <!-- Ocupação e Descritor -->
      <div class="goblin-section mb-4">
        <h3 class="text-xl font-goblin text-goblin-green mb-2">
          Ocupação e Descritor
        </h3>
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
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xl font-goblin text-goblin-green">
            Atributos
          </h3>
          <button
            class="action-button"
            title="Alternar edição de atributos"
            @click="toggleEditAttributes"
          >
            <span class="material-icons">{{ canEdit ? 'lock_open' : 'lock' }}</span>
          </button>
        </div>

        <!-- Combate -->
        <div class="goblin-attribute attribute-slider">
          <div class="flex justify-between items-center mb-1">
            <span class="goblin-attribute-title">Combate:</span>
            <span class="attribute-value">{{ attributes.combate }}</span>
          </div>
          <div class="slider-container">
            <button
              class="slider-button"
              :disabled="!canEdit || attributes.combate <= MIN_ATTRIBUTE"
              :class="{ disabled: !canEdit || attributes.combate <= MIN_ATTRIBUTE }"
              @click="updateAttribute('combate', attributes.combate - 1)"
            >
              -
            </button>
            <input
              v-model.number="attributes.combate"
              type="range"
              min="1"
              max="6"
              class="attribute-slider"
              :disabled="!canEdit"
              :class="{ 'disabled-slider': !canEdit }"
              @input="updateAttribute('combate', attributes.combate)"
            >
            <button
              class="slider-button"
              :disabled="!canEdit || attributes.combate >= MAX_ATTRIBUTE"
              :class="{ disabled: !canEdit || attributes.combate >= MAX_ATTRIBUTE }"
              @click="updateAttribute('combate', attributes.combate + 1)"
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
              class="slider-button"
              :disabled="!canEdit || attributes.habilidade <= MIN_ATTRIBUTE"
              :class="{ disabled: !canEdit || attributes.habilidade <= MIN_ATTRIBUTE }"
              @click="updateAttribute('habilidade', attributes.habilidade - 1)"
            >
              -
            </button>
            <input
              v-model.number="attributes.habilidade"
              type="range"
              min="1"
              max="6"
              class="attribute-slider"
              :disabled="!canEdit"
              :class="{ 'disabled-slider': !canEdit }"
              @input="updateAttribute('habilidade', attributes.habilidade)"
            >
            <button
              class="slider-button"
              :disabled="!canEdit || attributes.habilidade >= MAX_ATTRIBUTE"
              :class="{ disabled: !canEdit || attributes.habilidade >= MAX_ATTRIBUTE }"
              @click="updateAttribute('habilidade', attributes.habilidade + 1)"
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
              class="slider-button"
              :disabled="!canEdit || attributes.noção <= MIN_ATTRIBUTE"
              :class="{ disabled: !canEdit || attributes.noção <= MIN_ATTRIBUTE }"
              @click="updateAttribute('noção', attributes.noção - 1)"
            >
              -
            </button>
            <input
              v-model.number="attributes.noção"
              type="range"
              min="1"
              max="6"
              class="attribute-slider"
              :disabled="!canEdit"
              :class="{ 'disabled-slider': !canEdit }"
              @input="updateAttribute('noção', attributes.noção)"
            >
            <button
              class="slider-button"
              :disabled="!canEdit || attributes.noção >= MAX_ATTRIBUTE"
              :class="{ disabled: !canEdit || attributes.noção >= MAX_ATTRIBUTE }"
              @click="updateAttribute('noção', attributes.noção + 1)"
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
              class="slider-button"
              :disabled="!canEdit || attributes.vitalidade <= MIN_ATTRIBUTE"
              :class="{ disabled: !canEdit || attributes.vitalidade <= MIN_ATTRIBUTE }"
              @click="updateAttribute('vitalidade', attributes.vitalidade - 1)"
            >
              -
            </button>
            <input
              v-model.number="attributes.vitalidade"
              type="range"
              min="1"
              max="6"
              class="attribute-slider"
              :disabled="!canEdit"
              :class="{ 'disabled-slider': !canEdit }"
              @input="updateAttribute('vitalidade', attributes.vitalidade)"
            >
            <button
              class="slider-button"
              :disabled="!canEdit || attributes.vitalidade >= MAX_ATTRIBUTE"
              :class="{ disabled: !canEdit || attributes.vitalidade >= MAX_ATTRIBUTE }"
              @click="updateAttribute('vitalidade', attributes.vitalidade + 1)"
            >
              +
            </button>
          </div>
        </div>

        <!-- Mensagem informativa sobre edição de atributos -->
        <div v-if="!canEdit" class="attribute-info-message">
          <p class="text-xs text-goblin-brown italic mt-2">
            Os atributos só podem ser modificados quando o goblin subir de nível ou receber algum artefato.
          </p>
        </div>
      </div>

      <!-- Características Físicas -->
      <div class="goblin-section mb-4">
        <h3 class="text-xl font-goblin text-goblin-green mb-2">
          Características Físicas
        </h3>
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
        <h3 class="text-xl font-goblin text-goblin-green mb-2">
          Personalidade
        </h3>
        <ul class="list-disc list-inside ml-2">
          <li v-for="trait in goblin.personality" :key="trait">
            {{ trait }}
          </li>
        </ul>
      </div>

      <!-- Equipamento -->
      <div class="goblin-section mb-4">
        <h3 class="text-xl font-goblin text-goblin-green mb-2">
          Equipamento
        </h3>
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
      <div v-if="goblin.occupation === 'Bruxo' && goblin.spells && goblin.spells.length > 0" class="goblin-section mb-4">
        <h3 class="text-xl font-goblin text-goblin-green mb-2">
          Magias
        </h3>
        <ul class="list-disc list-inside ml-2">
          <li v-for="spell in goblin.spells" :key="spell">
            {{ spell }}
          </li>
        </ul>
      </div>

      <!-- Sorte/Maldição -->
      <div v-if="goblin.luckOrCurse" class="goblin-section mb-4">
        <h3 class="text-xl font-goblin text-goblin-green mb-2">
          {{ goblin.luckOrCurse.type === 'luck' ? 'Sorte' : 'Maldição' }}
        </h3>
        <div class="goblin-attribute" :class="{ 'text-green-600': goblin.luckOrCurse.type === 'luck', 'text-red-600': goblin.luckOrCurse.type === 'curse' }">
          {{ goblin.luckOrCurse.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.goblin-card {
  @apply bg-parchment text-goblin-dark p-5 rounded-lg shadow-lg border-2 border-goblin-brown transform rotate-1 md:max-w-2xl;
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

/* Estilos para os botões de ação */
.action-button {
  @apply w-8 h-8 flex items-center justify-center bg-goblin-brown text-white rounded-full hover:bg-goblin-green transition-colors;
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

/* Estilo para sliders desabilitados */
.disabled-slider {
  @apply opacity-50 cursor-not-allowed;
}

/* Estilo para a mensagem informativa */
.attribute-info-message {
  @apply bg-goblin-dark bg-opacity-10 p-2 rounded-md;
}

/* Estilos específicos para impressão */
@media print {
  .goblin-card {
    border: none;
    box-shadow: none;
    transform: none;
    padding: 1cm;
    width: 100%;
    height: 100%;
    min-height: 29.7cm;
  }

  .slider-button, input[type="range"], .action-button {
    display: none;
  }

  .attribute-info-message {
    display: none;
  }

  .goblin-sections {
    page-break-inside: avoid;
  }

  .goblin-section {
    page-break-inside: avoid;
  }
}
</style>
