<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Dice from './Dice.vue';
import { useDiceStore } from '../stores/diceStore';
import { socketService } from '../services/socketService';

// Store do Pinia
const diceStore = useDiceStore();

// Refs para os componentes de dados
const diceRefs = ref<Record<number, any>>({});
const diceContainerRef = ref<HTMLElement | null>(null);

// Refs para o Socket.IO
const roomId = ref<string>('');
const isConnected = ref<boolean>(false);
const showRoomControls = ref<boolean>(false);
const connectedUsers = ref<string[]>([]);

// Método para definir referências aos componentes de dados
const setDiceRef = (id: number, el: any) => {
  if (el) {
    diceRefs.value[id] = el;
  }
};

// Adicionar classe de animação aos dados quando rolados
const addRollingAnimation = (id: number) => {
  const diceElement = document.getElementById(`dice-${id}`);
  if (diceElement) {
    // Escolher uma direção aleatória para a animação
    const directions = ['shake-1', 'shake-2', 'shake-3', 'shake-4'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    
    // Adicionar classe de tremor
    diceElement.classList.add('shake-dice', randomDirection);
    
    // Remover as classes após a animação
    const animationDuration = 0.6;
    setTimeout(() => {
      diceElement.classList.remove('shake-dice', randomDirection);
    }, animationDuration * 1000 + 50);
  }
};

// Sobrescrever o método rollDice para adicionar animações e enviar para o servidor
const rollDice = () => {
  if (diceStore.isRolling || diceStore.diceList.length === 0) return;
  
  // Usar o método da store para rolar os dados
  diceStore.rollDice();
  
  // Adicionar animações a todos os dados
  diceStore.diceList.forEach((dice) => {
    addRollingAnimation(dice.id);
  });

  // Enviar o estado dos dados para o servidor se estiver conectado
  if (isConnected.value && socketService.roomId) {
    socketService.sendDiceRoll(diceStore.diceList);
  }
};

// Métodos para o Socket.IO
const toggleRoomControls = () => {
  showRoomControls.value = !showRoomControls.value;
};

const connectToRoom = () => {
  if (!roomId.value.trim()) {
    alert('Por favor, insira um ID de sala válido');
    return;
  }

  // Inicializar o serviço de socket se ainda não estiver inicializado
  if (!socketService.isConnected) {
    socketService.init();
  }

  // Entrar na sala
  socketService.joinRoom(roomId.value);
  isConnected.value = true;
  showRoomControls.value = false;
};

const disconnectFromRoom = () => {
  socketService.disconnect();
  isConnected.value = false;
};

// Gerar um ID de sala aleatório
const generateRoomId = () => {
  const randomId = Math.random().toString(36).substring(2, 10);
  roomId.value = randomId;
};

// Lifecycle hooks
onMounted(() => {
  // Inscrever-se para atualizações de estado dos dados
  const unsubscribe = socketService.onDiceStateUpdate((diceState) => {
    // Atualizar o estado local apenas se não for o remetente
    if (diceState.length > 0) {
      // Pausar a rolagem atual se estiver acontecendo
      if (diceStore.isRolling) {
        diceStore.isRolling = false;
      }

      // Atualizar a lista de dados usando o método da store
      diceStore.updateDiceState(diceState);

      // Adicionar animações aos dados
      diceState.forEach((dice) => {
        addRollingAnimation(dice.id);
      });
    }
  });

  // Limpar a inscrição quando o componente for desmontado
  onUnmounted(() => {
    unsubscribe();
    socketService.disconnect();
  });
});
</script>

<template>
  <div class="dice-roller">
    <div class="dice-roller-header">
      <h3 class="dice-roller-title">Rolador de Dados</h3>
      
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

      <!-- Botão para mostrar/esconder controles de sala -->
      <button 
        @click="toggleRoomControls" 
        class="room-toggle-button"
        :class="{ 'connected': isConnected }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
        </svg>
        <span>{{ isConnected ? 'Conectado' : 'Conectar' }}</span>
      </button>
    </div>

    <!-- Controles de sala -->
    <div v-if="showRoomControls" class="room-controls">
      <div class="room-id-input">
        <label for="room-id">ID da Sala:</label>
        <input 
          type="text" 
          id="room-id" 
          v-model="roomId" 
          placeholder="Digite o ID da sala"
          :disabled="isConnected"
        />
        <button 
          @click="generateRoomId" 
          class="generate-room-button"
          :disabled="isConnected"
        >
          Gerar ID
        </button>
      </div>
      
      <div class="room-buttons">
        <button 
          v-if="!isConnected" 
          @click="connectToRoom" 
          class="connect-button"
        >
          Conectar à Sala
        </button>
        <button 
          v-else 
          @click="disconnectFromRoom" 
          class="disconnect-button"
        >
          Desconectar
        </button>
      </div>

      <div v-if="isConnected && socketService.connectedUsers.length > 0" class="connected-users">
        <p>Usuários conectados: {{ socketService.connectedUsers.length + 1 }}</p>
      </div>
    </div>
    
    <div class="dice-controls">
      <button 
        @click="diceStore.addDice()" 
        class="dice-control-button add-button"
        :disabled="diceStore.isRolling"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Adicionar</span>
      </button>
      
      <button 
        @click="diceStore.removeDice()" 
        class="dice-control-button remove-button"
        :disabled="diceStore.isRolling || diceStore.diceList.length === 0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Remover</span>
      </button>
      
      <button 
        @click="rollDice" 
        class="dice-control-button roll-button"
        :disabled="diceStore.isRolling || diceStore.diceList.length === 0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
          <path d="M16 21h5v-5"></path>
        </svg>
        <span>Rolar</span>
      </button>
      
      <button 
        v-if="diceStore.diceList.length > 0"
        @click="diceStore.removeAllDice()" 
        class="dice-control-button clear-button"
        :disabled="diceStore.isRolling"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        <span>Limpar</span>
      </button>
    </div>
    
    <div 
      v-if="diceStore.diceList.length > 0" 
      class="dice-container"
      ref="diceContainerRef"
    >
      <Dice
        v-for="dice in diceStore.diceList"
        :id="`dice-${dice.id}`"
        :key="dice.id"
        :faces="dice.faces"
        :result="dice.result"
        :selected="dice.selected"
        @select="diceStore.selectDice(dice.id)"
        @roll="(result) => diceStore.setDiceResult(dice.id, result)"
        :ref="el => setDiceRef(dice.id, el)"
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

/* Estilos para os controles de sala */
.room-toggle-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.room-toggle-button:hover {
  background-color: #2d3748;
}

.room-toggle-button.connected {
  background-color: #48bb78;
}

.room-toggle-button.connected:hover {
  background-color: #38a169;
}

.room-controls {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #2d3748;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.room-id-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.room-id-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #4a5568;
  border-radius: 0.25rem;
  background-color: #1a202c;
  color: white;
}

.generate-room-button {
  padding: 0.5rem;
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.room-buttons {
  display: flex;
  gap: 0.5rem;
}

.connect-button, .disconnect-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
}

.connect-button {
  background-color: #4299e1;
  color: white;
}

.connect-button:hover {
  background-color: #3182ce;
}

.disconnect-button {
  background-color: #f56565;
  color: white;
}

.disconnect-button:hover {
  background-color: #e53e3e;
}

.connected-users {
  font-size: 0.875rem;
  color: #a0aec0;
}
</style> 
