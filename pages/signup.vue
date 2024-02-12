<script lang="ts" setup>
import { userDTO } from '~/db/dto/user.dto'

definePageMeta({
  middleware: [
    'guest',
  ],
})

const formData = reactive({
  username: '',
  password: '',
  passwordConfirmation: '',
})

const formErrors = reactive({
  username: [] as string[],
  password: [] as string[],
  passwordConfirmation: [] as string[],
})

function validate(event: Event) {
  const userDTOWithPasswordConfirmation = userDTO.extend({
    passwordConfirmation: userDTO.shape.password.refine((confirmation) => {
      return confirmation === formData.password
    }, { message: 'Passwords don\'t match' }),
  })

  const result = userDTOWithPasswordConfirmation.safeParse(formData)
  if (!result.success) {
    event.preventDefault()
    const formattedError = result.error.format()
    formErrors.username = formattedError.username?._errors || []
    formErrors.password = formattedError.password?._errors || []
    formErrors.passwordConfirmation = formattedError.passwordConfirmation?._errors || []
  }
}

const route = useRoute()
</script>

<template>
  <div class="grow flex items-center justify-center">
    <div class="w-full px-4 mx-auto">
      <h1 class="page-title mb-4">
        Signup to ChipChat
      </h1>
      <Form action="/api/signup" method="post" @submit="validate">
        <p v-if="route.query.error" class="text-red-500">
          Login failed
        </p>
        <FormGroup name="username" label="Username" :errors="formErrors.username">
          <FormInput v-model="formData.username" type="text" autocomplete="username" autofocus />
        </FormGroup>
        <FormGroup name="password" label="Password" :errors="formErrors.password">
          <FormInput v-model="formData.password" type="password" autocomplete="new-password" />
        </FormGroup>
        <FormGroup name="passwordConfirmation" label="Password Confirmation" :errors="formErrors.passwordConfirmation">
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
