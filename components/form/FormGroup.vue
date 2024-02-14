<script lang="ts" setup>
const props = defineProps<{
  label: string
  name: string
  errors?: string[]
}>()

provide('name', props.name)
</script>

<template>
  <div class="flex flex-col-reverse gap-1">
    <span v-if="errors?.length" class="text-red-500" :data-testid="`${name}-error`">
      {{ errors[0] }}
    </span>
    <slot />
    <label :for="name" class="text-xl peer-focus:text-primary-500 transition-colors">{{ label }}</label>
  </div>
</template>
