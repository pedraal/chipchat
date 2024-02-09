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
    class: 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100',
  },
})

const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  return true
}
</script>

<template>
  <div class="w-full min-h-screen flex flex-col">
    <nav class="flex items-center justify-end gap-4 container mx-auto p-2">
      <button class="nav-item" data-testid="color-mode-button" @click="toggleColorMode">
        <Icon name="heroicons:sun" class="w-6 h-6" />
      </button>
      <a href="https://github.com/pedraal/chipchat" class="nav-item">
        <Icon name="fa-brands:github" class="w-6 h-6" />
      </a>
    </nav>
    <NuxtPage />
  </div>
</template>
