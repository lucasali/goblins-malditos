<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
  initialNickname: string
}>()

const emit = defineEmits<{
  (e: 'submit', nickname: string): void
}>()

const nickname = ref(props.initialNickname)

watch(
  () => props.initialNickname,
  (value) => {
    nickname.value = value
  },
)

function submit() {
  const trimmed = nickname.value.trim()
  if (!trimmed) {
    return
  }
  emit('submit', trimmed)
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div class="bg-parchment-texture p-6 rounded-lg border-2 border-goblin-brown w-full max-w-md text-ink">
      <h2 class="font-goblin text-xl mb-2">
        Escolha seu nome
      </h2>
      <p class="text-sm text-goblin-gray mb-4">
        Esse nome aparecerá na mesa e no chat.
      </p>
      <input
        v-model="nickname"
        class="w-full p-2 mb-4 bg-white/70 border border-goblin-brown rounded"
        type="text"
        placeholder="Seu apelido"
      >
      <button class="w-full goblin-button" @click="submit">
        Entrar na mesa
      </button>
    </div>
  </div>
</template>
