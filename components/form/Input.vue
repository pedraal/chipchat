<script lang="ts" setup>
defineProps<{
  type: 'text' | 'password'
  name?: string
}>()

const model = defineModel()

const injectedName = inject<string>('name')
</script>

<template>
  <input v-model="model" :type="type || 'text'" :name="name || injectedName" class="peer bg-transparent ring-1 ring-gray-600 dark:ring-gray-400 rounded-lg py-1 px-2 focus:!ring-primary-500 focus:ring-2 outline-none">
</template>
