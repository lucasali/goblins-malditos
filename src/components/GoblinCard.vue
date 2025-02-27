<script setup lang="ts">
import type { Goblin } from '../services/goblinGenerator'
import { computed, ref } from 'vue'

const props = defineProps<{
  goblin: Goblin
  canEditAttributes?: boolean
}>()

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

function updateAttribute(attribute: keyof typeof attributes.value, value: number) {
  if (!canEdit.value)
    return

  const newValue = Math.max(MIN_ATTRIBUTE, Math.min(MAX_ATTRIBUTE, value))
  attributes.value[attribute] = newValue

  emit('update:attributes', { ...attributes.value })
}

function copyGoblin() {
  emit('copy')
}

function shareGoblin() {
  emit('share')
}

function toggleEditAttributes() {
  emit('toggleEdit')
}
</script>

<template>
  <div v-if="goblin" class="bg-parchment text-goblin-dark p-5 rounded-lg shadow-lg border-2 border-goblin-brown transform rotate-1 hover:rotate-0 transition-transform duration-300 ease-in-out md:max-w-2xl">
    <div class="space-y-6">
      <div class="space-y-2">
        <div class="flex justify-between">
          <h2 class="text-2xl font-bold font-goblin text-goblin-green">
            {{ goblin.name }}
          </h2>

          <div class="flex gap-2">
            <button
              class="action-button"
              title="Compartilhar ficha"
              @click="shareGoblin"
            >
              <span class="material-icons">share</span>
            </button>

            <button
              class="action-button"
              title="Copiar ficha"
              @click="copyGoblin"
            >
              <span class="material-icons">content_copy</span>
            </button>
          </div>
        </div>

        <div>
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
      </div>

      <div class="goblin-section">
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

      <div class="goblin-section">
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

      <div class="goblin-section">
        <h3 class="text-xl font-goblin text-goblin-green mb-2">
          Personalidade
        </h3>
        <ul class="list-disc list-inside ml-2">
          <li v-for="trait in goblin.personality" :key="trait">
            {{ trait }}
          </li>
        </ul>
      </div>

      <div class="goblin-section">
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

      <div v-if="goblin.occupation === 'Bruxo' && goblin.spells && goblin.spells.length > 0" class="goblin-section">
        <h3 class="text-xl font-goblin text-goblin-green mb-2">
          Magias
        </h3>
        <ul class="list-disc list-inside ml-2">
          <li v-for="spell in goblin.spells" :key="spell">
            {{ spell }}
          </li>
        </ul>
      </div>

      <div v-if="goblin.luckOrCurse" class="goblin-section">
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
.goblin-attribute-title {
  @apply font-bold;
}

.action-button {
  @apply w-8 h-8 flex items-center justify-center bg-goblin-brown text-white rounded-full hover:bg-goblin-green transition-colors;
}

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

.disabled-slider {
  @apply opacity-50 cursor-not-allowed;
}

.attribute-info-message {
  @apply bg-goblin-dark bg-opacity-10 p-2 rounded-md;
}
</style>
