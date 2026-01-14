<script setup lang="ts">
import type { DiceRoll } from '../types/table'

const props = defineProps<{
  rolls: DiceRoll[]
}>()

const emit = defineEmits<{
  (e: 'roll', dice: string): void
}>()

const diceOptions = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20']
</script>

<template>
  <div class="bg-parchment border-2 border-goblin-brown rounded-lg p-4">
    <h3 class="font-goblin text-lg text-ink mb-3">
      Rolagem de dados
    </h3>
    <div class="grid grid-cols-3 gap-2 mb-4">
      <button
        v-for="dice in diceOptions"
        :key="dice"
        class="goblin-button text-sm"
        @click="$emit('roll', dice)"
      >
        {{ dice }}
      </button>
    </div>
    <div class="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
      <div v-if="!rolls.length" class="text-goblin-gray italic">
        Nenhuma rolagem ainda.
      </div>
      <div v-for="roll in rolls" :key="roll._id">
        <span class="font-bold text-goblin-brown">{{ roll.nickname }}</span>
        rolou <span class="font-bold">{{ roll.dice }}</span> =
        <span class="text-ink font-bold">{{ roll.result }}</span>
      </div>
    </div>
  </div>
</template>
