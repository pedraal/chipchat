<script setup lang="ts">
definePageMeta({
  middleware: [
    'auth',
  ],
})

const { initSocket } = useSocket()

onMounted(() => {
  initSocket()
})
</script>

<template>
  <div>TODO</div>
</template>
