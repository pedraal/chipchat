<script lang="ts" setup>
const props = defineProps<{
  label: string
  name: string
  error?: string
}>()

provide('name', props.name)
</script>

<template>
  <div class="flex flex-col-reverse gap-1">
    <span class="text-red-500">
      {{ error }}
    </span>
    <slot />
    <label :for="name" class="text-xl peer-focus:text-primary-500">{{ label }}</label>
  </div>
</template>
