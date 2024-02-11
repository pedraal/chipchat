<script lang="ts" setup>
definePageMeta({
  middleware: [
    'guest',
  ],
})

const formData = useState('signupFormData', () => ({
  username: '',
  password: '',
  passwordConfirmation: '',
  errors: {
    username: [] as string[],
    password: [] as string[],
    passwordConfirmation: [] as string[],
  },
}))

useCookieFormData<typeof formData.value>(formData, ['username', 'password'])

function validate(event: Event) {
  if (formData.value.password !== formData.value.passwordConfirmation) {
    event.preventDefault()
    formData.value.errors.passwordConfirmation = ['Passwords do not match']
  }
}
</script>

<template>
  <div class="grow flex items-center justify-center">
    <div class="w-full px-4 mx-auto">
      <h1 class="page-title mb-4">
        Sign up to ChipChat
      </h1>
      <Form action="/api/signup" method="post" @submit="validate">
        <FormGroup name="username" label="Username" :errors="formData.errors.username">
          <FormInput v-model="formData.username" type="text" autocomplete="username" autofocus />
        </FormGroup>
        <FormGroup name="password" label="Password" :errors="formData.errors.password">
          <FormInput v-model="formData.password" type="password" autocomplete="new-password" />
        </FormGroup>
        <FormGroup name="passwordConfirmation" label="Password Confirmation" :errors="formData.errors.passwordConfirmation">
          <FormInput v-model="formData.passwordConfirmation" type="password" autocomplete="new-password" />
        </FormGroup>
        <template #submit>
          Sign up
        </template>
      </Form>
      <NuxtLink to="/login" class="text-center block mt-8">
        Already have an account? <span class="underline">Login</span>
      </NuxtLink>
    </div>
  </div>
</template>
