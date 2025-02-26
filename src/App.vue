<script setup lang="ts">
import { ref } from 'vue';
import GoblinCard from './components/GoblinCard.vue';
import { generateGoblin, Goblin } from './services/goblinGenerator';

// Estado para armazenar o goblin atual
const currentGoblin = ref<Goblin | null>(null);

// Função para gerar um novo goblin
const generateNewGoblin = () => {
  // Adicionar uma pequena animação de tremor antes de gerar o goblin
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.classList.add('shake');
    setTimeout(() => {
      appElement.classList.remove('shake');
    }, 500);
  }
  
  // Gerar o goblin após um pequeno delay para a animação
  setTimeout(() => {
    currentGoblin.value = generateGoblin();
  }, 300);
};

// Função para copiar o goblin para a área de transferência
const copyGoblinToClipboard = () => {
  if (!currentGoblin.value) return;
  
  const goblin = currentGoblin.value;
  
  // Formatar o texto do goblin
  const goblinText = `
GOBLIN MALDITO: ${goblin.name}

CARACTERÍSTICAS FÍSICAS:
- Altura: ${goblin.physicalAttributes.height}
- Peso: ${goblin.physicalAttributes.weight}
- Cor da Pele: ${goblin.physicalAttributes.skinColor}
- Cor dos Olhos: ${goblin.physicalAttributes.eyeColor}
- Características Notáveis: ${goblin.physicalAttributes.physicalTraits.join(', ')}

PERSONALIDADE:
${goblin.personality.map(trait => `- ${trait}`).join('\n')}

EQUIPAMENTO:
- Arma: ${goblin.equipment.weapon}
- Armadura: ${goblin.equipment.armor}
- Itens: ${goblin.equipment.items.join(', ')}

TALENTO ESPECIAL:
${goblin.specialTalent}

${goblin.luckOrCurse.type === 'luck' ? 'SORTE' : 'MALDIÇÃO'}:
${goblin.luckOrCurse.description}
  `.trim();
  
  // Copiar para a área de transferência
  navigator.clipboard.writeText(goblinText)
    .then(() => {
      alert('Goblin copiado para a área de transferência!');
    })
    .catch(err => {
      console.error('Erro ao copiar: ', err);
      alert('Erro ao copiar o goblin. Tente novamente.');
    });
};
</script>

<template>
  <div class="goblin-container">
    <header class="mb-8 text-center">
      <h1 class="text-5xl mb-2">Goblins Malditos</h1>
      <p class="text-xl text-goblin-brown">Gerador de Goblins Aleatórios</p>
    </header>
    
    <div class="flex flex-col items-center mb-8">
      <button @click="generateNewGoblin" class="goblin-button mb-4">
        {{ currentGoblin ? 'Gerar Outro Goblin' : 'Gerar Goblin' }}
      </button>
      
      <p class="text-goblin-brown italic text-sm max-w-md text-center" v-if="!currentGoblin">
        Clique no botão acima para gerar um goblin aleatório para sua aventura. 
        Cada goblin é único, caótico e provavelmente não vai durar muito tempo!
      </p>
    </div>
    
    <transition 
      enter-active-class="transition duration-500 ease-out" 
      enter-from-class="opacity-0 transform -rotate-3 scale-95" 
      enter-to-class="opacity-100 transform rotate-1 scale-100"
      leave-active-class="transition duration-300 ease-in" 
      leave-from-class="opacity-100" 
      leave-to-class="opacity-0"
    >
      <GoblinCard 
        v-if="currentGoblin" 
        :goblin="currentGoblin" 
        @copy="copyGoblinToClipboard" 
      />
    </transition>
    
    <footer class="mt-8 text-center text-goblin-brown text-sm">
      <p>Criado para o RPG Goblins Malditos - Onde a morte é apenas o começo!</p>
    </footer>
  </div>
</template>

<style>
/* Animação de tremor para o botão de gerar goblin */
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
</style>
