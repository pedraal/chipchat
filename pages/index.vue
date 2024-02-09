<template>
  <div class="grow w-full flex justify-center items-center">
    <div class="flex flex-col items-center gap-6">
      <div class="text-center">
        <p class="text-3xl font-medium">
          Welcome to
        </p>
        <h1 class="text-4xl font-bold flex items-center gap-2">
          <Icon name="fluent-emoji-high-contrast:potato" class="text-amber-400 dark:text-amber-600" />
          <span class=" bg-gradient-to-r primary-gradient bg-clip-text text-transparent">
            ChipChat
          </span>
        </h1>
      </div>
      <div class="relative group">
        <div class="absolute -inset-0.5 group-hover:blur-lg transition-all bg-gradient-to-r primary-gradient rounded-lg blur animate-tilt" />
        <NuxtLink class="relative px-7 py-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg leading-none" data-testid="main-login">
          Continue as guest
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
