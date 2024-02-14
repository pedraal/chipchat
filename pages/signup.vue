<script lang="ts" setup>
import { z } from 'zod'
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

function validate() {
  const userDTOWithPasswordConfirmation = userDTO.extend({
    passwordConfirmation: z.string().refine((confirmation) => {
      return confirmation === formData.password
    }, { message: 'Passwords don\'t match' }),
  })

  const result = userDTOWithPasswordConfirmation.safeParse(formData)
  if (!result.success) {
    const formattedError = result.error.format()
    formErrors.username = formattedError.username?._errors || []
    formErrors.password = formattedError.password?._errors || []
    formErrors.passwordConfirmation = formattedError.passwordConfirmation?._errors || []
  }

  return result.success
}

const { fetch } = useUserSession()
const error = ref(false)
function onSubmit() {
  if (!validate())
    return

  $fetch('/api/signup', {
    method: 'POST',
    body: formData,
  })
    .then(() => fetch())
    .then(() => {
      navigateTo('/chats')
    }).catch((err) => {
      if (err.data) {
        formErrors.username = err.data.data.username?._errors || []
        formErrors.password = err.data.data.password?._errors || []
        formErrors.passwordConfirmation = err.data.data.passwordConfirmation?._errors || []
      }
      else {
        console.error(err)
        error.value = true
      }
    })
}
</script>

<template>
  <div class="grow flex items-center justify-center">
    <div class="w-full px-4 mx-auto">
      <h1 class="page-title mb-4">
        Signup to ChipChat
      </h1>
      <Form @submit.prevent="onSubmit">
        <p v-if="error" class="text-red-500">
          Failed to signup, please try again
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
