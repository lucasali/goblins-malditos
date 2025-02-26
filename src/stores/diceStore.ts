import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  rollDie, 
  calculateTotal, 
  formatDiceNotation, 
  commonDice 
} from '../services/diceService';

// Interface para os dados no rolador
interface DiceItem {
  id: number;
  faces: number;
  result: number | null;
  selected: boolean;
}

export const useDiceStore = defineStore('dice', () => {
  // Estado
  const diceList = ref<DiceItem[]>([]);
  const nextId = ref(1);
  const selectedDiceType = ref(20); // Padrão para d20
  const isRolling = ref(false);
  const showResults = ref(false);

  // Getters (computed)
  const totalResult = computed(() => {
    const results = diceList.value
      .map(dice => dice.result)
      .filter((result): result is number => result !== null);
    
    return calculateTotal(results);
  });

  const diceNotation = computed(() => {
    // Agrupar dados por faces
    const diceByFaces: Record<number, number> = {};
    
    diceList.value.forEach(dice => {
      if (!diceByFaces[dice.faces]) {
        diceByFaces[dice.faces] = 0;
      }
      diceByFaces[dice.faces]++;
    });
    
    // Formatar cada grupo
    return Object.entries(diceByFaces)
      .map(([faces, count]) => formatDiceNotation(count, parseInt(faces)))
      .join(' + ');
  });

  const selectedDice = computed(() => {
    return diceList.value.find(dice => dice.selected);
  });

  // Actions
  function addDice(faces?: number) {
    diceList.value.push({
      id: nextId.value++,
      faces: faces || selectedDiceType.value,
      result: null,
      selected: false
    });
  }

  function removeDice(id?: number) {
    // Se um ID for fornecido, remova esse dado específico
    if (id !== undefined) {
      const index = diceList.value.findIndex(dice => dice.id === id);
      if (index !== -1) {
        diceList.value.splice(index, 1);
        return;
      }
    }

    // Se um dado estiver selecionado, remova-o
    const selectedIndex = diceList.value.findIndex(dice => dice.selected);
    
    if (selectedIndex !== -1) {
      diceList.value.splice(selectedIndex, 1);
    } else if (diceList.value.length > 0) {
      // Caso contrário, remova o último dado
      diceList.value.pop();
    }
  }

  function removeAllDice() {
    diceList.value = [];
    showResults.value = false;
  }

  function selectDice(id: number) {
    diceList.value = diceList.value.map(dice => ({
      ...dice,
      selected: dice.id === id ? !dice.selected : false
    }));
  }

  function setDiceResult(id: number, result: number) {
    const diceIndex = diceList.value.findIndex(dice => dice.id === id);
    if (diceIndex !== -1) {
      diceList.value[diceIndex].result = result;
    }
  }

  function rollDice() {
    if (isRolling.value || diceList.value.length === 0) return;
    
    isRolling.value = true;
    showResults.value = true;
    
    // Resetar todos os resultados dos dados
    diceList.value = diceList.value.map(dice => ({
      ...dice,
      result: null
    }));
    
    // Rolar cada dado com um pequeno atraso entre eles
    const rollDelay = 100; // ms
    
    diceList.value.forEach((dice, index) => {
      setTimeout(() => {
        // Gerar o resultado final para este dado
        const result = rollDie(dice.faces);
        
        // Atualizar o resultado do dado
        setDiceResult(dice.id, result);
      }, index * rollDelay);
    });
    
    // Definir resultados finais após a animação
    setTimeout(() => {
      isRolling.value = false;
    }, diceList.value.length * rollDelay + 600);
  }

  function rollSpecificDice(id: number) {
    const diceIndex = diceList.value.findIndex(dice => dice.id === id);
    if (diceIndex !== -1) {
      const dice = diceList.value[diceIndex];
      const result = rollDie(dice.faces);
      setDiceResult(id, result);
      showResults.value = true;
    }
  }

  // Função para atualizar o estado dos dados a partir de uma fonte externa (Socket.IO)
  function updateDiceState(newDiceState: DiceItem[]) {
    if (newDiceState.length === 0) return;
    
    // Atualizar o nextId para ser maior que qualquer ID nos dados recebidos
    const maxId = Math.max(...newDiceState.map(dice => dice.id));
    if (maxId >= nextId.value) {
      nextId.value = maxId + 1;
    }
    
    // Atualizar a lista de dados
    diceList.value = newDiceState;
    showResults.value = true;
  }

  // Inicializar com um d20
  if (diceList.value.length === 0) {
    addDice();
  }

  return {
    // Estado
    diceList,
    selectedDiceType,
    isRolling,
    showResults,
    commonDice,
    
    // Getters
    totalResult,
    diceNotation,
    selectedDice,
    
    // Actions
    addDice,
    removeDice,
    removeAllDice,
    selectDice,
    setDiceResult,
    rollDice,
    rollSpecificDice,
    updateDiceState
  };
}); 
