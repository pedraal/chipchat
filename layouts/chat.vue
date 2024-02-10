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
  <div class="w-full h-screen flex flex-col">
    <Navbar />
    <main class="grow overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
