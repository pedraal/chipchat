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

const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  return true
}

const { loggedIn, user } = useUserSession()
</script>

<template>
  <div class="w-full min-h-screen flex flex-col">
    <nav class="flex items-center justify-between gap-4 container mx-auto p-2">
      <NuxtLink :to="loggedIn ? '/chats' : '/'" class="nav-item flex items-center gap-1 text-xl">
        <Icon name="fluent-emoji-high-contrast:potato" class="text-primary-400 dark:text-primary-600" />
        <span class=" bg-gradient-to-r primary-gradient bg-clip-text text-transparent">
          ChipChat
        </span>
      </NuxtLink>
      <div class="flex gap-4">
        <button class="nav-item" data-testid="color-mode-button" @click="toggleColorMode">
          <Icon :name="colorMode.value === 'dark' ? 'heroicons:sun' : 'heroicons:moon'" class="w-6 h-6" />
        </button>
        <a href="https://github.com/pedraal/chipchat" target="_blank" class="nav-item">
          <Icon name="fa-brands:github" class="w-6 h-6" />
        </a>

        <span v-if="loggedIn" class="flex items-center gap-1 bg-gray-950 rounded-full p-1 pr-3">
          <img :src="`https://source.boringavatars.com/beam/120/${user.username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`" class="w-6 h-6">
          {{ user.username }}
        </span>
      </div>
    </nav>
    <slot />
  </div>
</template>
