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
    <nav class="flex items-center justify-between gap-4 p-4">
      <NuxtLink :to="loggedIn ? '/chats' : '/'" class="nav-item flex items-center gap-1 text-xl">
        <Icon name="fluent-emoji-high-contrast:potato" class="text-primary-400 dark:text-primary-600" />
        <span class=" bg-gradient-to-r primary-gradient bg-clip-text text-transparent">
          ChipChat
        </span>
      </NuxtLink>
      <div class="flex gap-4 items-center">
        <template v-if="loggedIn">
          <UserTag :user="user" />
          <NuxtLink to="/api/logout" target="_top" class="nav-item">
            <Icon name="heroicons:arrow-right-start-on-rectangle" class="w-6 h-6" />
          </NuxtLink>
        </template>
        <button class="nav-item" data-testid="color-mode-button" @click="toggleColorMode">
          <ClientOnly>
            <Icon :name="colorMode.preference === 'dark' ? 'heroicons:sun' : 'heroicons:moon'" class="w-6 h-6" />
          </ClientOnly>
        </button>
        <a href="https://github.com/pedraal/chipchat" target="_blank" class="nav-item max-sm:hidden">
          <Icon name="fa-brands:github" class="w-6 h-6" />
        </a>
      </div>
    </nav>
    <slot />
  </div>
</template>
