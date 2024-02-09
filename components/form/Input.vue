<script lang="ts" setup>
defineProps<{
  modelValue: any
  type: 'text' | 'password'
  name?: string
}>()

defineEmits(['update:modelValue'])

const injectedName = inject('name')
</script>

<template>
  <input :value="modelValue" :type="type || 'text'" :name="name || injectedName" class="peer bg-transparent ring-1 ring-gray-900 dark:ring-gray-100 rounded-lg py-1 px-2 focus:!ring-primary-500 focus:ring-2 outline-none" @input="$emit('update:modelValue')">
</template>
