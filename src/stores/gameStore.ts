import type { Goblin } from '../types/goblin'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { generateGoblinFromSeed } from '../services/goblinGenerator'

export const useGameStore = defineStore('game', () => {
  const players = ref<Goblin[]>([])

  function addPlayer(goblinSeed: string) {
    const goblin = generateGoblinFromSeed(goblinSeed)

    if (goblin) {
      players.value.push(goblin)
    }

    console.warn(goblin)
  }

  function removePlayer(id: string) {
    players.value = players.value.filter(player => player.id !== id)
  }

  return {
    // State
    players,

    // Actions
    addPlayer,
    removePlayer,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
}
