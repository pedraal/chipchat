<script lang="ts" setup>
definePageMeta({
  middleware: [
    'guest',
  ],
})

const username = ref('')
const password = ref('')
</script>

<template>
  <div class="grow flex items-center justify-center">
    <div class="w-full px-4 mx-auto">
      <h1 class="page-title mb-4">
        Login to ChipChat
      </h1>
      <FormAuth action="/api/login">
        <FormGroup name="username" label="Username">
          <FormInput v-model="username" type="text" autocomplete="username" />
        </FormGroup>
        <FormGroup name="password" label="Password">
          <FormInput v-model="password" type="password" autocomplete="password" />
        </FormGroup>
        <template #submit>
          Login
        </template>
      </FormAuth>
      <NuxtLink to="/signup" class="text-center block mt-8">
        Don't have an account? <span class="underline">Sign up</span>
      </nuxtlink>
    </div>
  </div>
</template>
