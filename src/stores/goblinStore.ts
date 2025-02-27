import { defineStore } from "pinia";
import { generateGoblin, generateGoblinFromSeed, type Goblin } from "../services/goblinGenerator";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useGoblinCardStore = defineStore('goblin', () => {
  const route = useRoute();
  const router = useRouter();
  const currentGoblin = ref<Goblin | null>(null);

  onMounted(() => {
    const seedFromUrl = route.query.seed as string;

    if (seedFromUrl) {
      loadGoblinFromSeed(seedFromUrl);
    }
  })

  function loadGoblinFromSeed(seed: string) {
    if (!seed) {
      generateNewGoblin()
    }
    
    currentGoblin.value = generateGoblinFromSeed(seed);
  }

  function generateNewGoblin() {
    currentGoblin.value = generateGoblin()

    if (currentGoblin.value && currentGoblin.value.seed) {
      router.replace({ query: { seed: currentGoblin.value.seed } });
    }
  }

  return {
    // State
    goblin: currentGoblin,

    // Actions
    loadGoblinFromSeed,
    generateNewGoblin
  }
})
