<script setup lang="ts">
import type { TableMessage } from '../types/table'
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{
  messages: TableMessage[]
}>()

const emit = defineEmits<{
  (e: 'send', content: string): void
}>()

const draft = ref('')
const listRef = ref<HTMLElement | null>(null)

function send() {
  const trimmed = draft.value.trim()
  if (!trimmed) {
    return
  }
  emit('send', trimmed)
  draft.value = ''
}

watch(
  () => props.messages.length,
  async () => {
    await nextTick()
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight
    }
  },
)
</script>

<template>
  <div class="bg-parchment border-2 border-goblin-brown rounded-lg p-4 flex flex-col h-full">
    <h3 class="font-goblin text-lg mb-2 text-ink">
      Chat da mesa
    </h3>
    <div ref="listRef" class="flex-1 overflow-y-auto space-y-2 pr-2">
      <div v-if="!messages.length" class="text-sm italic text-goblin-gray">
        Nenhuma mensagem ainda. Seja o primeiro a falar!
      </div>
      <div v-for="message in messages" :key="message._id" class="text-sm">
        <span class="font-bold text-goblin-brown">{{ message.nickname }}:</span>
        <span class="text-ink ml-1">{{ message.content }}</span>
      </div>
    </div>
    <div class="mt-3 flex gap-2">
      <input
        v-model="draft"
        class="flex-1 p-2 bg-white/70 border border-goblin-brown rounded"
        type="text"
        placeholder="Digite sua mensagem..."
        @keydown.enter.prevent="send"
      >
      <button class="goblin-button px-4" @click="send">
        Enviar
      </button>
    </div>
  </div>
</template>
