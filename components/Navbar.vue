<script setup lang="ts">
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  return true
}

const { loggedIn, user } = useUserSession()
</script>

<template>
  <nav class="flex items-center justify-between gap-4 p-4">
    <NuxtLink :to="loggedIn ? '/chat' : '/'" class="nav-item flex items-center gap-1 text-xl">
      <Icon name="fluent-emoji-high-contrast:potato" class="text-primary-400 dark:text-primary-600" />
      <span class="max-sm:hidden bg-gradient-to-r primary-gradient bg-clip-text text-transparent font-semibold">
        ChipChat
      </span>
    </NuxtLink>
    <div class="flex gap-4 items-center">
      <template v-if="loggedIn">
        <UserTag :username="user.username" />
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
</template>
