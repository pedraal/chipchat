<script lang="ts" setup>
definePageMeta({
  middleware: [
    'guest',
  ],
})

const { fetch } = useUserSession()

const formData = reactive({
  username: '',
  password: '',
})
const formError = ref<string | null>(null)

function onSubmit() {
  if (!formData.username || !formData.password)
    return

  $fetch('/api/login', {
    method: 'POST',
    body: formData,
  })
    .then(() => fetch())
    .then(() => {
      navigateTo('/chats')
    }).catch((err) => {
      formError.value = err.data.data.message
    })
}
</script>

<template>
  <div class="grow flex items-center justify-center">
    <div class="w-full px-4 mx-auto">
      <h1 class="page-title mb-4">
        Login to ChipChat
      </h1>
      <Form @submit.prevent="onSubmit">
        <p v-if="formError" class="text-red-500">
          {{ formError }}
        </p>
        <FormGroup name="username" label="Username">
          <FormInput v-model="formData.username" type="text" autocomplete="username" autofocus />
        </FormGroup>
        <FormGroup name="password" label="Password">
          <FormInput v-model="formData.password" type="password" autocomplete="password" />
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
