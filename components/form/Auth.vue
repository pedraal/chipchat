<template>
  <form class="flex flex-col gap-4 bg-gray-500/5 rounded-xl p-8 w-full max-w-sm mx-auto">
    <slot />
    <button type="submit" class="w-full mt-4 px-6 py-1.5 border border-primary-500 text-primary-500 rounded-full text-xl transition-colors hover:border-primary-500 hover:text-primary">
      <slot name="submit" />
    </button>
  </form>
</template>
