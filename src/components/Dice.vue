<script setup lang="ts">
import { computed, defineExpose, ref } from 'vue'
import { rollDie } from '../services/diceService'

// Props
const props = defineProps({
  faces: {
    type: Number,
    required: true,
    validator: (value: number) => [4, 6, 8, 10, 12, 20, 100].includes(value),
  },
  result: {
    type: Number as () => number | null | undefined,
    default: undefined as number | undefined | null,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['roll', 'select'])

// State
const isRolling = ref(false)

// Computed
const diceLabel = computed(() => `d${props.faces}`)
const diceClass = computed(() => `dice-d${props.faces}`)
const hasResult = computed(() => props.result !== null && props.result !== undefined)

// Methods
function handleClick() {
  emit('select')
}

function rollDice() {
  if (isRolling.value)
    return

  isRolling.value = true

  // Animate the dice roll
  const animationDuration = 600 // ms
  const animationSteps = 8
  const stepDuration = animationDuration / animationSteps

  let step = 0
  const interval = setInterval(() => {
    const randomResult = rollDie(props.faces)
    emit('roll', randomResult)

    step++
    if (step >= animationSteps) {
      clearInterval(interval)
      isRolling.value = false
    }
  }, stepDuration)
}

// Expose methods to parent component
defineExpose({
  rollDice,
})
</script>

<template>
  <div
    class="dice" :class="[
      diceClass,
      { 'selected': selected, 'has-result': hasResult },
    ]"
    @click="handleClick"
  >
    <div class="dice-inner">
      <div class="dice-face">
        <span class="dice-label">{{ diceLabel }}</span>
        <span v-if="result !== null && result !== undefined" class="dice-result">{{ result }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dice {
  @apply relative cursor-pointer bg-goblin-dark border-2 border-goblin-brown rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 select-none;
  width: 60px;
  height: 60px;
  perspective: 600px;
}

.dice-inner {
  @apply w-full h-full flex items-center justify-center;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.dice-face {
  @apply absolute w-full h-full flex flex-col items-center justify-center;
  backface-visibility: hidden;
}

.dice-label {
  @apply text-goblin-green font-bold text-sm;
}

.dice-result {
  @apply text-white font-bold text-xl mt-1;
}

/* Dice with result */
.has-result .dice-label {
  @apply text-xs opacity-70 absolute top-1;
}

.has-result .dice-result {
  @apply text-2xl text-goblin-green mt-0;
}

/* Dice types with different shapes */
.dice-d4 {
  position: relative;
  border-radius: 0;
}

.dice-d4::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: inherit;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  z-index: -1;
}

.dice-d6 {
  border-radius: 8px;
}

.dice-d8 {
  position: relative;
  border-radius: 0;
}

.dice-d8::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: inherit;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  z-index: -1;
}

.dice-d10 {
  position: relative;
  border-radius: 0;
}

.dice-d10::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: inherit;
  clip-path: polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%);
  z-index: -1;
}

.dice-d12 {
  position: relative;
  border-radius: 0;
}

.dice-d12::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: inherit;
  clip-path: polygon(50% 0%, 70% 10%, 90% 30%, 100% 50%, 90% 70%, 70% 90%, 50% 100%, 30% 90%, 10% 70%, 0% 50%, 10% 30%, 30% 10%);
  z-index: -1;
}

.dice-d20 {
  position: relative;
  border-radius: 0;
}

.dice-d20::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: inherit;
  clip-path: polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%);
  transform: rotate(45deg);
  z-index: -1;
}

.dice-d20 .dice-inner {
  transform: rotate(0deg);
}

.dice-d100 {
  border-radius: 50%;
}

/* Selected state */
.selected {
  @apply border-goblin-green shadow-md;
  transform: scale(1.05);
}

/* Removendo a animação de rotação */
/* .rolling {
  animation: diceRoll 0.6s ease-in-out;
}

@keyframes diceRoll {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  25% { transform: rotateX(90deg) rotateY(45deg); }
  50% { transform: rotateX(180deg) rotateY(90deg); }
  75% { transform: rotateX(270deg) rotateY(135deg); }
  100% { transform: rotateX(360deg) rotateY(180deg); }
} */
</style>
