<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout>
    <div class="grow w-full flex justify-center items-center">
      <div class="text-center">
        <h1 class="text-6xl font-bold mb-4 text-primary-gradient">
          {{ error!.statusCode }}
        </h1>
        <NuxtLink class="text-2xl nav-item" @click="handleError">
          Go back home
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
