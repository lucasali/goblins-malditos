<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="relative min-h-screen flex flex-col items-center">
    <main class="flex-grow container mx-auto flex flex-col items-center justify-center p-4 transition-all duration-300 ease-in-out z-0">
      <RouterView />
    </main>
  </div>
</template>
