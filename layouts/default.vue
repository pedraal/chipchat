<script setup lang="ts">
useHead({
  title: 'ChipChat',
  meta: [
    {
      name: 'description',
      content: 'ChipChat is a chat application',
    },
  ],
  bodyAttrs: {
    class: 'body-bg text-gray-900 dark:text-gray-100',
  },
})
</script>

<template>
  <div class="w-full min-h-screen flex flex-col">
    <Navbar />
    <slot />
  </div>
</template>
