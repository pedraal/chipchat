<script lang="ts" setup>
import { twMerge } from 'tailwind-merge'

const props = defineProps<{
  type?: 'text' | 'password' | 'textarea'
  name?: string
  class?: string
}>()

const model = defineModel()

const injectedName = inject<string>('name', '')
</script>

<template>
  <input :id="name || injectedName" v-model="model" :name="name || injectedName" :type="type || 'text'" :class="twMerge('peer bg-gray-500/20  rounded-full py-1 px-4 ring-2 ring-transparent focus:!ring-primary-500  outline-none transition-all', props.class || '')">
</template>
