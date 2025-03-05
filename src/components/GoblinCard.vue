<script setup lang="ts">
import type { Goblin } from '../services/goblinGenerator'
import { ref } from 'vue'
import GoblinImage from './GoblinImage.vue'

defineProps<{
  goblin: Goblin
}>()

const emit = defineEmits<{
  (e: 'copy'): void
  (e: 'share'): void
  (e: 'toggleEdit'): void
  (e: 'addToCollection'): void
}>()

const showImage = ref<boolean>(false)

const apiKey = ref<string>('')
const showApiConfig = ref<boolean>(false)

function copyGoblin() {
  emit('copy')
}

function shareGoblin() {
  emit('share')
}

function addToCollection() {
  emit('addToCollection')
}

function toggleImageVisibility() {
  showImage.value = !showImage.value
}

function saveApiKey() {
  localStorage.setItem('openai_api_key', apiKey.value)
  showApiConfig.value = false
}
</script>

<template>
  <div v-if="goblin" class="bg-parchment md:max-w-5xl text-goblin-dark p-5 rounded-lg shadow-lg border-2 border-goblin-brown">
    <div class="space-y-6">
      <div class="image-collapse-container">
        <button
          class="collapse-button w-full flex justify-between items-center p-2 bg-goblin-brown hover:bg-goblin-green text-white rounded-t"
          @click="toggleImageVisibility"
        >
          <span>{{ showImage ? 'Esconder Imagem do Goblin' : 'Mostrar Imagem do Goblin' }}</span>
          <span class="transform transition-transform" :class="{ 'rotate-180': showImage }">▼</span>
        </button>

        <div
          v-show="showImage"
          class="collapse-content bg-goblin-dark bg-opacity-20 p-4 rounded-b"
        >
          <div class="space-y-4">
            <div class="flex justify-end">
              <button
                class="text-sm bg-goblin-brown hover:bg-goblin-green px-3 py-1 rounded flex items-center gap-1"
                @click="showApiConfig = !showApiConfig"
              >
                <span class="material-icons text-sm">key</span>
                {{ apiKey ? 'Alterar API Key' : 'Configurar API Key' }}
              </button>
            </div>

            <div v-if="showApiConfig" class="bg-goblin-dark p-4 rounded-lg border border-goblin-brown">
              <div class="space-y-4">
                <h3 class="text-lg font-goblin text-goblin-green">
                  Configuração da API OpenAI
                </h3>
                <p class="text-sm">
                  Para gerar imagens dos goblins, você precisa de uma chave de API da OpenAI.
                  <a href="https://platform.openai.com/api-keys" target="_blank" class="text-goblin-green underline">
                    Obtenha uma aqui
                  </a>.
                </p>
                <div class="space-y-4">
                  <input
                    v-model="apiKey"
                    type="password"
                    placeholder="Insira sua chave de API da OpenAI"
                    class="w-full p-2 rounded bg-goblin-gray text-white"
                  >
                  <div class="flex justify-end">
                    <button class="bg-goblin-green hover:bg-goblin-brown px-3 py-1 rounded" @click="saveApiKey">
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <GoblinImage
              :goblin
              :api-key="apiKey"
            />
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex justify-between">
          <h2 class="text-2xl font-bold font-goblin text-goblin-green">
            {{ goblin.name }}
          </h2>

          <div class="flex gap-2">
            <button
              class="w-8 h-8 flex items-center justify-center bg-goblin-brown text-white rounded-full hover:bg-goblin-green transition-colors"
              title="Adicionar à coleção"
              @click="addToCollection"
            >
              <span class="material-icons">add_to_photos</span>
            </button>

            <button
              class="w-8 h-8 flex items-center justify-center bg-goblin-brown text-white rounded-full hover:bg-goblin-green transition-colors"
              title="Compartilhar ficha"
              @click="shareGoblin"
            >
              <span class="material-icons">share</span>
            </button>

            <button
              class="w-8 h-8 flex items-center justify-center bg-goblin-brown text-white rounded-full hover:bg-goblin-green transition-colors"
              title="Copiar ficha"
              @click="copyGoblin"
            >
              <span class="material-icons">content_copy</span>
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex gap-2">
            <span class="font-semibold text-goblin-brown">Ocupação:</span>
            <span class="text-goblin-dark font-medium">{{ goblin.occupation }}</span>
          </div>
          <div class="flex gap-2">
            <span class="font-semibold text-goblin-brown">Descritor:</span>
            <span class="text-goblin-dark font-medium">{{ goblin.describer }}</span>
          </div>
          <div class="flex gap-2">
            <span class="font-semibold text-goblin-brown">Técnica:</span>
            <div class="text-goblin-dark space-y-1">
              <div class="font-bold text-goblin-green">
                {{ goblin.technique.title }}
              </div>
              <div class="font-medium leading-snug">
                {{ goblin.technique.description }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div class="space-y-4">
          <h3 class="text-xl font-goblin text-goblin-green">
            Características Físicas
          </h3>
          <div class="space-y-2">
            <div class="flex gap-2">
              <span class="font-semibold text-goblin-brown">Característica Distinta:</span>
              <span class="text-goblin-dark font-medium">{{ goblin.physicalAttributes.trait }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold text-goblin-brown">Altura:</span>
              <span class="text-goblin-dark font-medium">{{ goblin.physicalAttributes.height }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold text-goblin-brown">Peso:</span>
              <span class="text-goblin-dark font-medium">{{ goblin.physicalAttributes.weight }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold text-goblin-brown">Cor da Pele:</span>
              <span class="text-goblin-dark font-medium">{{ goblin.physicalAttributes.skinColor }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold text-goblin-brown">Cor dos Olhos:</span>
              <span class="text-goblin-dark font-medium">{{ goblin.physicalAttributes.eyeColor }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-goblin text-goblin-green">
              Atributos
            </h3>
          </div>

          <div class="space-y-2">
            <div class="flex gap-2 items-baseline">
              <span class="font-semibold text-goblin-brown">Combate:</span>
              <span class="text-lg font-bold text-goblin-dark">{{ goblin.attributes.combate }}</span>
            </div>

            <div class="flex gap-2 items-baseline">
              <span class="font-semibold text-goblin-brown">Habilidade:</span>
              <span class="text-lg font-bold text-goblin-dark">{{ goblin.attributes.habilidade }}</span>
            </div>

            <div class="flex gap-2 items-baseline">
              <span class="font-semibold text-goblin-brown">Noção:</span>
              <span class="text-lg font-bold text-goblin-dark">{{ goblin.attributes.noção }}</span>
            </div>

            <div class="flex gap-2 items-baseline">
              <span class="font-semibold text-goblin-brown">Vitalidade:</span>
              <span class="text-lg font-bold text-goblin-dark">{{ goblin.attributes.vitalidade }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-xl font-goblin text-goblin-green">
            Equipamento
          </h3>
          <div class="space-y-2">
            <div class="flex gap-2">
              <span class="font-semibold text-goblin-brown">Arma:</span>
              <div class="flex flex-col">
                <span class="text-goblin-dark font-medium">{{ goblin.equipment.weapon }}</span>
                <span v-if="goblin.equipment.weaponDetails" class="text-xs text-goblin-dark opacity-80 italic tracking-wide mt-1 ml-1">
                  {{ goblin.equipment.weaponDetails.uso }}, {{ goblin.equipment.weaponDetails.ataque }}, Bônus: {{ goblin.equipment.weaponDetails.bônus }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold text-goblin-brown">Proteção:</span>
              <div class="flex flex-col">
                <span class="text-goblin-dark font-medium">{{ goblin.equipment.armor }}</span>
                <span v-if="goblin.equipment.armorDetails" class="text-xs text-goblin-dark opacity-80 italic tracking-wide mt-1 ml-1">
                  {{ goblin.equipment.armorDetails.uso }}, Durabilidade: {{ goblin.equipment.armorDetails.durabilidade }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold text-goblin-brown">Itens:</span>
              <ul class="list-disc list-inside text-goblin-dark space-y-1">
                <li v-for="item in goblin.equipment.items" :key="item" class="font-medium">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-xl font-goblin text-goblin-green">
            Personalidade
          </h3>
          <ul class="list-disc list-inside text-goblin-dark space-y-1">
            <li v-for="trait in goblin.personality" :key="trait" class="font-medium">
              {{ trait }}
            </li>
          </ul>
        </div>

        <div v-if="goblin.occupation === 'Bruxo' && goblin.spells && goblin.spells.length > 0" class="space-y-4">
          <h3 class="text-xl font-goblin text-goblin-green">
            Magias
          </h3>
          <ul class="list-disc list-inside text-goblin-dark space-y-1">
            <li v-for="spell in goblin.spells" :key="spell" class="font-medium">
              {{ spell }}
            </li>
          </ul>
        </div>

        <div v-if="goblin.luckOrCurse" class="space-y-4">
          <h3 class="text-xl font-goblin text-goblin-green">
            {{ goblin.luckOrCurse.type === 'luck' ? 'Sorte' : 'Maldição' }}
          </h3>
          <div :class="{ 'text-green-600 font-medium': goblin.luckOrCurse.type === 'luck', 'text-red-600 font-medium': goblin.luckOrCurse.type === 'curse' }">
            {{ goblin.luckOrCurse.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
