<script setup lang="ts">
defineProps<{
  username?: string
}>()
</script>

<template>
  <span class="inline-flex items-center gap-1 bg-gray-950 rounded-full p-1 pr-3 group text-gray-100" :data-testid="`${username}-tag`">
    <img :src="`https://source.boringavatars.com/beam/120/${username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`" class="w-6 h-6">
    {{ username }}
  </span>
</template>
