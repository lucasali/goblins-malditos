<script setup lang="ts">
import { ref } from 'vue'
import { useDiceStore } from '../stores/diceStore'
import Dice from './Dice.vue'

// Store do Pinia
const diceStore = useDiceStore()

// Refs para os componentes de dados
const diceRefs = ref<Record<number, any>>({})
const diceContainerRef = ref<HTMLElement | null>(null)

// Método para definir referências aos componentes de dados
function setDiceRef(id: number, el: any) {
  if (el) {
    diceRefs.value[id] = el
  }
}

// Adicionar classe de animação aos dados quando rolados
function addRollingAnimation(id: number) {
  const diceElement = document.getElementById(`dice-${id}`)
  if (diceElement) {
    // Escolher uma direção aleatória para a animação
    const directions = ['shake-1', 'shake-2', 'shake-3', 'shake-4']
    const randomDirection = directions[Math.floor(Math.random() * directions.length)]

    // Adicionar classe de tremor
    diceElement.classList.add('shake-dice', randomDirection)

    // Remover as classes após a animação
    const animationDuration = 0.6
    setTimeout(() => {
      diceElement.classList.remove('shake-dice', randomDirection)
    }, animationDuration * 1000 + 50)
  }
}

// Sobrescrever o método rollDice para adicionar animações
function rollDice() {
  if (diceStore.isRolling || diceStore.diceList.length === 0)
    return

  // Usar o método da store para rolar os dados
  diceStore.rollDice()

  // Adicionar animações a todos os dados
  diceStore.diceList.forEach((dice) => {
    addRollingAnimation(dice.id)
  })
}
</script>

<template>
  <div class="dice-roller">
    <div class="dice-roller-header">
      <h3 class="dice-roller-title">
        Rolador de Dados
      </h3>

      <div class="dice-type-selector">
        <label for="dice-type" class="dice-type-label">Tipo:</label>
        <select
          id="dice-type"
          v-model="diceStore.selectedDiceType"
          class="dice-type-select"
        >
          <option v-for="faces in diceStore.commonDice" :key="faces" :value="faces">
            d{{ faces }}
          </option>
        </select>
      </div>
    </div>

    <div class="dice-controls">
      <button
        class="dice-control-button add-button"
        :disabled="diceStore.isRolling"
        @click="diceStore.addDice()"
      >
        <i class="material-icons">add</i>
        <span>Adicionar</span>
      </button>

      <button
        class="dice-control-button remove-button"
        :disabled="diceStore.isRolling || diceStore.diceList.length === 0"
        @click="diceStore.removeDice()"
      >
        <i class="material-icons">remove</i>
        <span>Remover</span>
      </button>

      <button
        class="dice-control-button roll-button"
        :disabled="diceStore.isRolling || diceStore.diceList.length === 0"
        @click="rollDice"
      >
        <i class="material-icons">refresh</i>
        <span>Rolar</span>
      </button>

      <button
        v-if="diceStore.diceList.length > 0"
        class="dice-control-button clear-button"
        :disabled="diceStore.isRolling"
        @click="diceStore.removeAllDice()"
      >
        <i class="material-icons">delete</i>
        <span>Limpar</span>
      </button>
    </div>

    <div
      v-if="diceStore.diceList.length > 0"
      ref="diceContainerRef"
      class="dice-container"
    >
      <Dice
        v-for="dice in diceStore.diceList"
        :id="`dice-${dice.id}`"
        :key="dice.id"
        :ref="el => setDiceRef(dice.id, el)"
        :faces="dice.faces"
        :result="dice.result"
        :selected="dice.selected"
        @select="diceStore.selectDice(dice.id)"
        @roll="(result) => diceStore.setDiceResult(dice.id, result)"
      />
    </div>

    <div v-if="diceStore.showResults && diceStore.diceList.length > 0" class="dice-results">
      <div class="dice-notation">
        {{ diceStore.diceNotation }}
      </div>
      <div class="dice-total">
        Total: <span class="dice-total-value">{{ diceStore.totalResult }}</span>
      </div>
    </div>

    <div v-if="diceStore.diceList.length === 0" class="empty-state">
      <p>Adicione dados para começar a rolar!</p>
    </div>
  </div>
</template>

<style scoped>
.dice-roller {
  @apply bg-goblin-dark border border-goblin-brown rounded-lg p-4 w-full max-w-md mx-auto;
}

.dice-roller-header {
  @apply flex items-center justify-between mb-4 pb-2 border-b border-goblin-brown;
}

.dice-roller-title {
  @apply text-goblin-green font-goblin text-xl;
}

.dice-type-selector {
  @apply flex items-center;
}

.dice-type-label {
  @apply text-white mr-2;
}

.dice-type-select {
  @apply bg-goblin-dark text-white border border-goblin-brown rounded px-2 py-1 focus:outline-none focus:border-goblin-green;
}

.dice-controls {
  @apply flex flex-wrap gap-2 mb-4;
}

.dice-control-button {
  @apply flex items-center justify-center gap-1 py-1 px-3 rounded-md text-sm transition-colors duration-200;
  transform: none !important;
}

.dice-control-button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.add-button {
  @apply bg-goblin-green text-white hover:bg-goblin-green/80;
}

.remove-button {
  @apply bg-goblin-brown text-white hover:bg-goblin-brown/80;
}

.roll-button {
  @apply bg-goblin-green text-white hover:bg-goblin-green/80 ml-auto;
}

.clear-button {
  @apply bg-goblin-brown/70 text-white hover:bg-goblin-brown;
}

.dice-container {
  @apply flex flex-wrap gap-3 mb-4 justify-center;
}

.dice-results {
  @apply mt-4 p-3 bg-goblin-dark/50 border border-goblin-brown rounded-md;
}

.dice-notation {
  @apply text-goblin-brown text-sm mb-1;
}

.dice-total {
  @apply text-white font-bold;
}

.dice-total-value {
  @apply text-goblin-green text-xl;
}

.empty-state {
  @apply text-center text-goblin-brown italic py-4;
}

/* Animation for dice rolling */
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.shake {
  animation: shake 0.5s;
}

/* Animação de tremor individualizada para cada dado */
.shake-dice {
  animation-duration: 0.6s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
  animation-iteration-count: 1;
  transform-origin: center;
  will-change: transform;
}

/* Quatro variações diferentes da animação de tremor */
.shake-1 {
  animation-name: shakeDice1;
}

.shake-2 {
  animation-name: shakeDice2;
}

.shake-3 {
  animation-name: shakeDice3;
}

.shake-4 {
  animation-name: shakeDice4;
}

/* Primeira variação - movimento predominante horizontal */
@keyframes shakeDice1 {
  0% { transform: translate(0, 0) rotate(0deg); }
  10% { transform: translate(5px, 2px) rotate(3deg); }
  20% { transform: translate(-6px, 1px) rotate(-4deg); }
  30% { transform: translate(5px, -2px) rotate(2deg); }
  40% { transform: translate(-4px, 3px) rotate(-3deg); }
  50% { transform: translate(6px, -1px) rotate(4deg); }
  60% { transform: translate(-5px, 2px) rotate(-2deg); }
  70% { transform: translate(4px, -3px) rotate(3deg); }
  80% { transform: translate(-6px, 1px) rotate(-4deg); }
  90% { transform: translate(5px, -2px) rotate(2deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

/* Segunda variação - movimento predominante vertical */
@keyframes shakeDice2 {
  0% { transform: translate(0, 0) rotate(0deg); }
  10% { transform: translate(2px, 5px) rotate(-3deg); }
  20% { transform: translate(-1px, -6px) rotate(4deg); }
  30% { transform: translate(3px, 4px) rotate(-2deg); }
  40% { transform: translate(-2px, -5px) rotate(3deg); }
  50% { transform: translate(1px, 6px) rotate(-4deg); }
  60% { transform: translate(-3px, -4px) rotate(2deg); }
  70% { transform: translate(2px, 5px) rotate(-3deg); }
  80% { transform: translate(-1px, -6px) rotate(4deg); }
  90% { transform: translate(3px, 4px) rotate(-2deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

/* Terceira variação - movimento predominante rotacional */
@keyframes shakeDice3 {
  0% { transform: translate(0, 0) rotate(0deg); }
  10% { transform: translate(3px, 3px) rotate(5deg); }
  20% { transform: translate(-2px, -2px) rotate(-6deg); }
  30% { transform: translate(1px, 1px) rotate(4deg); }
  40% { transform: translate(-3px, -3px) rotate(-5deg); }
  50% { transform: translate(2px, 2px) rotate(6deg); }
  60% { transform: translate(-1px, -1px) rotate(-4deg); }
  70% { transform: translate(3px, 3px) rotate(5deg); }
  80% { transform: translate(-2px, -2px) rotate(-6deg); }
  90% { transform: translate(1px, 1px) rotate(4deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

/* Quarta variação - movimento diagonal */
@keyframes shakeDice4 {
  0% { transform: translate(0, 0) rotate(0deg); }
  10% { transform: translate(4px, -4px) rotate(-3deg); }
  20% { transform: translate(-5px, 5px) rotate(4deg); }
  30% { transform: translate(3px, -3px) rotate(-2deg); }
  40% { transform: translate(-4px, 4px) rotate(3deg); }
  50% { transform: translate(5px, -5px) rotate(-4deg); }
  60% { transform: translate(-3px, 3px) rotate(2deg); }
  70% { transform: translate(4px, -4px) rotate(-3deg); }
  80% { transform: translate(-5px, 5px) rotate(4deg); }
  90% { transform: translate(3px, -3px) rotate(-2deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

/* Removendo a animação diceRoll que causava o efeito estranho */
/* @keyframes diceRoll {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  25% { transform: rotateX(90deg) rotateY(45deg); }
  50% { transform: rotateX(180deg) rotateY(90deg); }
  75% { transform: rotateX(270deg) rotateY(135deg); }
  100% { transform: rotateX(360deg) rotateY(180deg); }
}

.rolling {
  animation: diceRoll 0.6s ease-in-out;
} */

.dice-control-button .material-icons {
  font-size: 20px;
  margin-right: 4px;
  vertical-align: middle;
}
</style>
