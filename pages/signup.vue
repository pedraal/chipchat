<script lang="ts" setup>
const name = ref('')
const password = ref('')
const passwordConfirmation = ref('')
</script>

<template>
  <div class="grow flex items-center justify-center">
    <div class="w-full px-4 mx-auto">
      <h1 class="page-title mb-4">
        Sign up to ChipChat
      </h1>
      <FormAuth action="/api/login">
        <FormGroup name="name" label="Username">
          <FormInput v-model="name" type="text" />
        </FormGroup>
        <FormGroup name="password" label="Password">
          <FormInput v-model="password" type="password" />
        </FormGroup>
        <FormGroup name="passwordConfirmation" label="Password Confirmation">
          <FormInput v-model="passwordConfirmation" type="password" />
        </FormGroup>
        <template #submit>
          Sign up
        </template>
      </FormAuth>
      <NuxtLink to="/login" class="text-center block mt-8">
        Already have an account? <span class="underline">Login</span>
      </NuxtLink>
    </div>
  </div>
</template>
