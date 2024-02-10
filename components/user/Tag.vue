<script setup lang="ts">
defineProps<{
  user: {
    username: string
  }
}>()
</script>

<template>
  <span class="flex items-center gap-1 bg-gray-950 rounded-full p-1 pr-3 group text-gray-100">
    <img :src="`https://source.boringavatars.com/beam/120/${user.username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`" class="w-6 h-6">
    {{ user.username }}
  </span>
</template>
