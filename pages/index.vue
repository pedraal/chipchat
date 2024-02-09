<template>
  <div class="grow w-full flex justify-center items-center">
    <div class="flex flex-col items-center gap-6">
      <div class="text-center">
        <p class="text-3xl font-medium">
          Welcome to
        </p>
        <h1 class="text-4xl font-bold flex items-center gap-2">
          <Icon name="fluent-emoji-high-contrast:potato" class="text-primary-400 dark:text-primary-600" />
          <span class=" bg-gradient-to-r primary-gradient bg-clip-text text-transparent">
            ChipChat
          </span>
        </h1>
      </div>
      <div class="relative group mt-8">
        <div class="absolute -inset-1 group-hover:blur-xl transition-all bg-gradient-to-r primary-gradient rounded-full blur-lg animate-tilt" />
        <NuxtLink to="/login/guest" class="relative px-7 py-4 body-bg rounded-full leading-none" data-testid="main-login">
          Signup or login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
