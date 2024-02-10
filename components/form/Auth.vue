<template>
  <form class="flex flex-col gap-4 bg-gray-500/5 rounded-xl p-8 w-full max-w-sm mx-auto">
    <slot />
    <button type="submit" class="btn btn-primary mt-6">
      <slot name="submit" />
    </button>
  </form>
</template>
