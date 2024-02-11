<script lang="ts" setup>
definePageMeta({
  middleware: [
    'guest',
  ],
})

const username = ref('')
const password = ref('')

const route = useRoute()
</script>

<template>
  <div class="grow flex items-center justify-center">
    <div class="w-full px-4 mx-auto">
      <h1 class="page-title mb-4">
        Login to ChipChat
      </h1>
      <Form action="/api/login" method="post">
        <p v-if="route.query.error" class="text-red-500">
          Login failed
        </p>
        <FormGroup name="username" label="Username">
          <FormInput v-model="username" type="text" autocomplete="username" autofocus />
        </FormGroup>
        <FormGroup name="password" label="Password">
          <FormInput v-model="password" type="password" autocomplete="password" />
        </FormGroup>
        <template #submit>
          Login
        </template>
      </Form>
      <NuxtLink to="/signup" class="text-center block mt-8" data-testid="signup-link">
        Don't have an account? <span class="underline">Sign up</span>
      </nuxtlink>
    </div>
  </div>
</template>
